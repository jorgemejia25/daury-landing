import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` first or set it in .env.local.");
  process.exit(1);
}

const count = Number(process.argv[2]) || 32;

// Deterministic PRNG (mulberry32) so repeated runs produce a stable, reviewable dataset.
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260711);

function pick(rand, weighted) {
  const total = weighted.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand() * total;
  for (const [value, weight] of weighted) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return weighted[weighted.length - 1][0];
}

function pickMany(rand, values, min, max) {
  const n = Math.min(values.length, min + Math.floor(rand() * (max - min + 1)));
  const pool = [...values];
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const idx = Math.floor(rand() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function intInRange(rand, min, max) {
  return Math.round(min + rand() * (max - min));
}

const CARE_TARGETS = [
  ["personal", 45],
  ["third_party", 55],
];

const ORGANIZATION = [
  ["whatsapp", 34],
  ["paper", 24],
  ["memory", 20],
  ["app", 12],
  ["other", 10],
];

const ORGANIZATION_OTHER = ["Notas en el celular", "Una libreta compartida en casa", "Calendario de Google familiar"];

const CHALLENGES = [
  "medication_schedules",
  "medical_appointments",
  "family_sharing",
  "lack_of_time",
  "care_costs",
];

const CHALLENGES_OTHER = ["Coordinar turnos entre hermanos", "Encontrar cuidadores de confianza"];

const INCIDENT_STORIES = [
  "Se le olvidó una dosis y tuvimos que llamar al médico para confirmar si repetirla.",
  "Confundimos el horario de dos medicamentos distintos.",
  "Faltamos a una cita porque nadie anotó la fecha correctamente.",
  "Duplicamos una dosis porque dos personas se la dieron sin avisarse.",
  "No nos dimos cuenta de que la receta ya había vencido.",
];

const TRUST_CONCERNS = [
  "traditional_preference",
  "medical_data_privacy",
  "offline_reliability",
  "delicate_information",
];

const TRUST_CONCERNS_OTHER = ["No sé si mi familiar sabría usarla", "Dependemos de internet muy inestable en casa"];

const INTEREST_NO_REASONS = [
  "Ya tenemos un sistema que nos funciona bien.",
  "Prefiero mantenerlo simple con papel y llamadas.",
  "Me preocupa depender de una app para algo tan importante.",
  "No estoy seguro de que mi familiar la use.",
];

const FEATURES = [
  "medication_reminders",
  "medical_calendar",
  "prescription_history",
  "family_sharing",
  "emergency_contacts",
  "doctor_reports",
];

const FEATURES_OTHER = ["Alertas para reabastecer medicamentos", "Historial compartido con el médico de cabecera"];

function buildCompletedPath(data) {
  const steps = ["intro", "p1", "p3", "p4", "p5"];
  if (data.hadIncident === "yes") steps.push("p5Story");
  steps.push("p6");
  if (data.appTrust === "no" || data.appTrust === "maybe") steps.push("p7");
  steps.push("p8");
  if (data.appInterest === "no" || data.appInterest === "maybe") {
    steps.push("p8Reason");
    return steps;
  }
  steps.push("p9", "p10", "p11", "p12", "p13");
  return steps;
}

const USER_AGENTS = [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15",
  "Mozilla/5.0 (Linux; Android 14; SM-A155M) AppleWebKit/537.36 Chrome/126.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
];

function generateResponse(rand) {
  const careTarget = pick(rand, CARE_TARGETS);
  const organizationMethod = pick(rand, ORGANIZATION);
  const organizationOther = organizationMethod === "other" ? pick(rand, ORGANIZATION_OTHER.map((v) => [v, 1])) : "";

  const careChallenges = pickMany(rand, CHALLENGES, 1, 3);
  const includeOtherChallenge = rand() < 0.12;
  if (includeOtherChallenge) careChallenges.push("other");
  const careChallengesOther = includeOtherChallenge ? pick(rand, CHALLENGES_OTHER.map((v) => [v, 1])) : "";

  const hadIncident = pick(rand, [["yes", 42], ["no", 58]]);
  const incidentStory = hadIncident === "yes" ? pick(rand, INCIDENT_STORIES.map((v) => [v, 1])) : "";

  const appTrust = pick(rand, [["yes", 45], ["maybe", 35], ["no", 20]]);
  let trustConcerns = [];
  let trustConcernsOther = "";
  if (appTrust === "maybe" || appTrust === "no") {
    trustConcerns = pickMany(rand, TRUST_CONCERNS, 1, 3);
    const includeOtherConcern = rand() < 0.1;
    if (includeOtherConcern) {
      trustConcerns.push("other");
      trustConcernsOther = pick(rand, TRUST_CONCERNS_OTHER.map((v) => [v, 1]));
    }
  }

  const appInterest = pick(rand, [["yes", 58], ["maybe", 26], ["no", 16]]);

  const data = {
    locale: "es",
    careTarget,
    organizationMethod,
    organizationOther,
    careChallenges,
    careChallengesOther,
    hadIncident,
    incidentStory,
    appTrust,
    trustConcerns,
    trustConcernsOther,
    appInterest,
    interestNoReason: "",
    essentialFeatures: [],
    essentialFeaturesOther: "",
    priceTooExpensiveCents: null,
    priceExpensiveButPayCents: null,
    priceBargainCents: null,
    priceTooCheapCents: null,
    priceCurrency: "GTQ",
    completedPath: [],
    userAgent: pick(rand, USER_AGENTS.map((v) => [v, 1])),
  };

  if (appInterest === "no" || appInterest === "maybe") {
    data.interestNoReason = pick(rand, INTEREST_NO_REASONS.map((v) => [v, 1]));
  } else {
    const essentialFeatures = pickMany(rand, FEATURES, 1, 4);
    const includeOtherFeature = rand() < 0.1;
    if (includeOtherFeature) essentialFeatures.push("other");
    data.essentialFeatures = essentialFeatures;
    data.essentialFeaturesOther = includeOtherFeature ? pick(rand, FEATURES_OTHER.map((v) => [v, 1])) : "";

    // Van Westendorp: four ascending price points per respondent, in quetzales.
    const tooCheap = intInRange(rand, 8, 35);
    const bargain = tooCheap + intInRange(rand, 20, 45);
    const expensive = bargain + intInRange(rand, 30, 70);
    const tooExpensive = expensive + intInRange(rand, 30, 90);

    data.priceTooCheapCents = tooCheap * 100;
    data.priceBargainCents = bargain * 100;
    data.priceExpensiveButPayCents = expensive * 100;
    data.priceTooExpensiveCents = tooExpensive * 100;
  }

  data.completedPath = buildCompletedPath(data);

  return data;
}

const convex = new ConvexHttpClient(convexUrl);

console.log(`Sembrando ${count} respuestas en ${convexUrl}...`);

let inserted = 0;
for (let i = 0; i < count; i += 1) {
  const payload = generateResponse(rng);
  await convex.mutation(api.careSurvey.submit, payload);
  inserted += 1;
}

console.log(`Listo. ${inserted} respuestas insertadas.`);
