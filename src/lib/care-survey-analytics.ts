import type { CareSurveyResultRecord } from "@/actions/get-survey-results";
import {
  careChallengeOptions,
  carePayerOptions,
  careTargetOptions,
  caredPersonAgeOptions,
  conditionDurationOptions,
  coordinationFrequencyOptions,
  discoveryChannelOptions,
  essentialFeatureOptions,
  familyCaregiverOptions,
  interestRequirementOptions,
  organizationMethodOptions,
  trustConcernOptions,
  whatsappPreferenceOptions,
  type SurveyChoice,
} from "@/lib/care-survey";

export type Bucket = { value: string; label: string; count: number };

export const yesNoMaybeLabels: Record<string, string> = {
  yes: "Sí",
  no: "No",
  maybe: "Tal vez",
};

function labelFor(options: SurveyChoice[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** Distribution over a single-choice field, preserving the option order. */
export function distributionSingle(
  records: CareSurveyResultRecord[],
  options: SurveyChoice[],
  pick: (record: CareSurveyResultRecord) => string,
): Bucket[] {
  const buckets = new Map<string, Bucket>(
    options.map((option) => [option.value, { ...option, count: 0 }]),
  );

  for (const record of records) {
    const value = pick(record);
    const bucket = buckets.get(value);
    if (bucket) bucket.count += 1;
  }

  return [...buckets.values()];
}

/** Distribution over a multi-choice (array) field, preserving option order. */
export function distributionMulti(
  records: CareSurveyResultRecord[],
  options: SurveyChoice[],
  pick: (record: CareSurveyResultRecord) => string[],
): Bucket[] {
  const buckets = new Map<string, Bucket>(
    options.map((option) => [option.value, { ...option, count: 0 }]),
  );

  for (const record of records) {
    for (const value of pick(record)) {
      const bucket = buckets.get(value);
      if (bucket) bucket.count += 1;
    }
  }

  return [...buckets.values()];
}

/** Distribution over a yes / no / maybe field. */
export function distributionYesNoMaybe(
  records: CareSurveyResultRecord[],
  pick: (record: CareSurveyResultRecord) => string,
  values: string[] = ["yes", "no", "maybe"],
): Bucket[] {
  const buckets = new Map<string, Bucket>(
    values.map((value) => [
      value,
      { value, label: yesNoMaybeLabels[value] ?? value, count: 0 },
    ]),
  );

  for (const record of records) {
    const bucket = buckets.get(pick(record));
    if (bucket) bucket.count += 1;
  }

  return [...buckets.values()];
}

/** Sort a distribution descending by count, keeping ties in option order. */
export function ranked(buckets: Bucket[]): Bucket[] {
  return [...buckets].sort((a, b) => b.count - a.count);
}

/** Rounded share of `part` over `whole`, guarding division by zero. */
export function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : (part / whole) * 100;
}

// ---------------------------------------------------------------------------
// Headline summary
// ---------------------------------------------------------------------------

export type AttitudeSplit = {
  yes: number;
  maybe: number;
  no: number;
  total: number;
};

export type SurveySummary = {
  /** Everyone who submitted. */
  total: number;
  /** ¿Le interesaría usar la app? (yes / maybe / no) */
  interest: AttitudeSplit;
  /** ¿Confiaría en una app? (yes / maybe / no) */
  trust: AttitudeSplit;
  /** ¿Tuvo un incidente por falta de organización? (yes / no) */
  incident: { yes: number; no: number; total: number };
  /** Denominators for the multi-select charts. */
  denominators: {
    /** All respondents answer the challenges question. */
    challenges: number;
    /** Only interested respondents reach the features question. */
    features: number;
    /** Only skeptics (trust ≠ yes) reach the concerns question. */
    concerns: number;
  };
  /** How many completed the four price points. */
  reachedPrice: number;
};

function splitYesNoMaybe(
  records: CareSurveyResultRecord[],
  pick: (r: CareSurveyResultRecord) => string,
): AttitudeSplit {
  const split = { yes: 0, maybe: 0, no: 0, total: 0 };
  for (const record of records) {
    const value = pick(record);
    if (value === "yes") split.yes += 1;
    else if (value === "maybe") split.maybe += 1;
    else if (value === "no") split.no += 1;
    else continue;
    split.total += 1;
  }
  return split;
}

export function summarize(records: CareSurveyResultRecord[]): SurveySummary {
  const interest = splitYesNoMaybe(records, (r) => r.appInterest);
  const trust = splitYesNoMaybe(records, (r) => r.appTrust);
  const incidentSplit = splitYesNoMaybe(records, (r) => r.hadIncident);

  const featureRespondents = records.filter((r) => r.essentialFeatures.length > 0).length;
  const concernRespondents = records.filter(
    (r) => r.appTrust === "no" || r.appTrust === "maybe",
  ).length;
  const reachedPrice = records.filter(
    (r) =>
      r.priceTooCheapCents !== null &&
      r.priceBargainCents !== null &&
      r.priceExpensiveButPayCents !== null &&
      r.priceTooExpensiveCents !== null,
  ).length;

  return {
    total: records.length,
    interest,
    trust,
    incident: { yes: incidentSplit.yes, no: incidentSplit.no, total: incidentSplit.yes + incidentSplit.no },
    denominators: {
      challenges: records.length,
      features: featureRespondents,
      concerns: concernRespondents,
    },
    reachedPrice,
  };
}

export const organizationDistribution = (records: CareSurveyResultRecord[]) =>
  distributionSingle(records, organizationMethodOptions, (r) => r.organizationMethod);

export const careTargetDistribution = (records: CareSurveyResultRecord[]) =>
  distributionSingle(records, careTargetOptions, (r) => r.careTarget ?? "");

export const careChallengeDistribution = (records: CareSurveyResultRecord[]) =>
  distributionMulti(records, careChallengeOptions, (r) => r.careChallenges);

export const trustConcernDistribution = (records: CareSurveyResultRecord[]) =>
  distributionMulti(records, trustConcernOptions, (r) => r.trustConcerns);

export const essentialFeatureDistribution = (records: CareSurveyResultRecord[]) =>
  distributionMulti(records, essentialFeatureOptions, (r) => r.essentialFeatures);

// ---------------------------------------------------------------------------
// Van Westendorp Price Sensitivity Meter
// ---------------------------------------------------------------------------

export type PricePoint = {
  price: number;
  tooCheap: number;
  bargain: number;
  expensive: number;
  tooExpensive: number;
};

export type PriceAnalysis = {
  sampleSize: number;
  currency: string;
  points: PricePoint[];
  /** Optimal Price Point: too cheap ∩ too expensive. */
  opp: number | null;
  /** Indifference Price Point: bargain ∩ expensive. */
  ipp: number | null;
  /** Point of Marginal Cheapness: too cheap ∩ expensive (range lower bound). */
  pmc: number | null;
  /** Point of Marginal Expensiveness: bargain ∩ too expensive (range upper bound). */
  pme: number | null;
  averages: {
    tooCheap: number;
    bargain: number;
    expensive: number;
    tooExpensive: number;
  } | null;
};

type PriceRow = {
  tooCheap: number;
  bargain: number;
  expensive: number;
  tooExpensive: number;
};

function toQuetzales(cents: number | null): number | null {
  if (cents === null || !Number.isFinite(cents)) return null;
  return cents / 100;
}

/** Linear interpolation of the price where curve A crosses curve B. */
function intersect(
  points: PricePoint[],
  a: (p: PricePoint) => number,
  b: (p: PricePoint) => number,
): number | null {
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const dPrev = a(prev) - b(prev);
    const dCurr = a(curr) - b(curr);

    if (dPrev === 0) return prev.price;
    if (dCurr === 0) return curr.price;

    if ((dPrev < 0 && dCurr > 0) || (dPrev > 0 && dCurr < 0)) {
      const t = dPrev / (dPrev - dCurr);
      return prev.price + t * (curr.price - prev.price);
    }
  }
  return null;
}

export function analyzePrices(records: CareSurveyResultRecord[]): PriceAnalysis {
  const currency = records.find((r) => r.priceCurrency)?.priceCurrency ?? "GTQ";

  const rows: PriceRow[] = [];
  for (const record of records) {
    const tooCheap = toQuetzales(record.priceTooCheapCents);
    const bargain = toQuetzales(record.priceBargainCents);
    const expensive = toQuetzales(record.priceExpensiveButPayCents);
    const tooExpensive = toQuetzales(record.priceTooExpensiveCents);

    if (
      tooCheap === null ||
      bargain === null ||
      expensive === null ||
      tooExpensive === null
    ) {
      continue;
    }

    rows.push({ tooCheap, bargain, expensive, tooExpensive });
  }

  const sampleSize = rows.length;

  if (sampleSize === 0) {
    return {
      sampleSize: 0,
      currency,
      points: [],
      opp: null,
      ipp: null,
      pmc: null,
      pme: null,
      averages: null,
    };
  }

  const prices = Array.from(
    new Set(
      rows.flatMap((row) => [row.tooCheap, row.bargain, row.expensive, row.tooExpensive]),
    ),
  ).sort((a, b) => a - b);

  const points: PricePoint[] = prices.map((price) => {
    const pct = (n: number) => (n / sampleSize) * 100;
    return {
      price,
      // Descending cumulative curves.
      tooCheap: pct(rows.filter((row) => row.tooCheap >= price).length),
      bargain: pct(rows.filter((row) => row.bargain >= price).length),
      // Ascending cumulative curves.
      expensive: pct(rows.filter((row) => row.expensive <= price).length),
      tooExpensive: pct(rows.filter((row) => row.tooExpensive <= price).length),
    };
  });

  const sum = (pick: (row: PriceRow) => number) =>
    rows.reduce((total, row) => total + pick(row), 0);

  return {
    sampleSize,
    currency,
    points,
    opp: intersect(points, (p) => p.tooCheap, (p) => p.tooExpensive),
    ipp: intersect(points, (p) => p.bargain, (p) => p.expensive),
    pmc: intersect(points, (p) => p.tooCheap, (p) => p.expensive),
    pme: intersect(points, (p) => p.bargain, (p) => p.tooExpensive),
    averages: {
      tooCheap: sum((r) => r.tooCheap) / sampleSize,
      bargain: sum((r) => r.bargain) / sampleSize,
      expensive: sum((r) => r.expensive) / sampleSize,
      tooExpensive: sum((r) => r.tooExpensive) / sampleSize,
    },
  };
}

// ---------------------------------------------------------------------------
// Open-text responses
// ---------------------------------------------------------------------------

export type OpenTextEntry = {
  id: string;
  createdAt: number;
  question: string;
  answer: string;
};

const openTextSources: { question: string; pick: (r: CareSurveyResultRecord) => string }[] = [
  { question: "Historia del incidente", pick: (r) => r.incidentStory },
  { question: "Por qué no le interesa", pick: (r) => r.interestNoReason },
  { question: "Organización (otro)", pick: (r) => r.organizationOther },
  { question: "App usada para organizar", pick: (r) => r.organizationAppName ?? "" },
  { question: "App conocida/usada antes", pick: (r) => r.priorCareAppName ?? "" },
  { question: "Qué paga actualmente", pick: (r) => r.paidCareDetails ?? "" },
  { question: "Retos (otro)", pick: (r) => r.careChallengesOther },
  { question: "Preocupaciones (otro)", pick: (r) => r.trustConcernsOther },
  { question: "Condición para usar la app (otro)", pick: (r) => r.interestRequirementOther ?? "" },
  { question: "Funciones (otro)", pick: (r) => r.essentialFeaturesOther },
  { question: "Canal de descubrimiento (otro)", pick: (r) => r.discoveryOther ?? "" },
  { question: "Cierre", pick: (r) => r.closingExperience ?? "" },
];

export function collectOpenText(records: CareSurveyResultRecord[]): OpenTextEntry[] {
  const entries: OpenTextEntry[] = [];

  for (const record of records) {
    for (const source of openTextSources) {
      const answer = source.pick(record).trim();
      if (answer) {
        entries.push({
          id: `${record._id}-${source.question}`,
          createdAt: record._creationTime,
          question: source.question,
          answer,
        });
      }
    }
  }

  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function multiLabels(values: string[], options: SurveyChoice[]): string {
  return values.map((value) => labelFor(options, value)).join("; ");
}

function priceToQ(cents: number | null): string {
  const q = toQuetzales(cents);
  return q === null ? "" : String(q);
}

export function toCsv(records: CareSurveyResultRecord[]): string {
  const headers = [
    "fecha",
    "idioma",
    "administro_cuidado",
    "tipo_cuidado",
    "edad_persona_cuidada",
    "familiares_cuidando",
    "frecuencia_coordinacion",
    "organizacion",
    "organizacion_otro",
    "organizacion_app",
    "retos",
    "retos_otro",
    "uso_app_previa",
    "app_previa_nombre",
    "tuvo_incidente",
    "historia_incidente",
    "paga_actualmente",
    "pago_actual_detalle",
    "quien_pagaria",
    "confia_app",
    "preocupaciones",
    "preocupaciones_otro",
    "interes_app",
    "razon_no_interes",
    "condiciones_para_si",
    "condiciones_para_si_otro",
    "preferencia_whatsapp",
    "funciones_esenciales",
    "funciones_otro",
    "como_se_enteraria",
    "como_se_enteraria_otro",
    "duracion_condicion",
    "precio_muy_caro_q",
    "precio_caro_pero_pagaria_q",
    "precio_buen_precio_q",
    "precio_muy_barato_q",
    "moneda",
    "experiencia_adicional",
    "camino",
    "user_agent",
  ];

  const rows = records.map((record) => [
    new Date(record._creationTime).toISOString(),
    record.locale,
    yesNoMaybeLabels[record.hasManagedCare ?? ""] ?? (record.hasManagedCare ?? ""),
    labelFor(careTargetOptions, record.careTarget ?? ""),
    labelFor(caredPersonAgeOptions, record.caredPersonAge ?? ""),
    labelFor(familyCaregiverOptions, record.familyCaregivers ?? ""),
    labelFor(coordinationFrequencyOptions, record.coordinationFrequency ?? ""),
    labelFor(organizationMethodOptions, record.organizationMethod),
    record.organizationOther,
    record.organizationAppName ?? "",
    multiLabels(record.careChallenges, careChallengeOptions),
    record.careChallengesOther,
    yesNoMaybeLabels[record.priorCareAppUse ?? ""] ?? (record.priorCareAppUse ?? ""),
    record.priorCareAppName ?? "",
    yesNoMaybeLabels[record.hadIncident] ?? record.hadIncident,
    record.incidentStory,
    yesNoMaybeLabels[record.currentlyPaysCare ?? ""] ?? (record.currentlyPaysCare ?? ""),
    record.paidCareDetails ?? "",
    labelFor(carePayerOptions, record.carePayer ?? ""),
    yesNoMaybeLabels[record.appTrust] ?? record.appTrust,
    multiLabels(record.trustConcerns, trustConcernOptions),
    record.trustConcernsOther,
    yesNoMaybeLabels[record.appInterest] ?? record.appInterest,
    record.interestNoReason,
    multiLabels(record.interestRequirements ?? [], interestRequirementOptions),
    record.interestRequirementOther ?? "",
    labelFor(whatsappPreferenceOptions, record.whatsappPreference ?? ""),
    multiLabels(record.essentialFeatures, essentialFeatureOptions),
    record.essentialFeaturesOther,
    labelFor(discoveryChannelOptions, record.discoveryChannel ?? ""),
    record.discoveryOther ?? "",
    labelFor(conditionDurationOptions, record.conditionDuration ?? ""),
    priceToQ(record.priceTooExpensiveCents),
    priceToQ(record.priceExpensiveButPayCents),
    priceToQ(record.priceBargainCents),
    priceToQ(record.priceTooCheapCents),
    record.priceCurrency,
    record.closingExperience ?? "",
    record.completedPath.join(" > "),
    record.userAgent,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell))).join(","))
    .join("\n");
}
