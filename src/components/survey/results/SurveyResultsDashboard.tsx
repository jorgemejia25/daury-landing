"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CareSurveyResultRecord } from "@/actions/get-survey-results";
import {
  analyzePrices,
  careChallengeDistribution,
  careTargetDistribution,
  essentialFeatureDistribution,
  organizationDistribution,
  pct,
  ranked,
  summarize,
  toCsv,
  trustConcernDistribution,
  yesNoMaybeLabels,
  type Bucket,
} from "@/lib/care-survey-analytics";
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
} from "@/lib/care-survey";

type SurveyResultsDashboardProps = {
  records: CareSurveyResultRecord[];
  onReset?: () => void;
};

type View = "resumen" | "respuestas";
type ChartRow = { value: string; label: string; pct: number; count: number };
type AttRow = { label: string; yes: number; maybe: number; no: number; total: number };

const ORG_COLORS: Record<string, string> = {
  paper: "var(--org-paper)",
  whatsapp: "var(--org-whatsapp)",
  memory: "var(--org-memory)",
  app: "var(--org-app)",
  other: "var(--org-other)",
};

const ATTITUDE_COLORS = {
  yes: "var(--sent-pos)",
  maybe: "var(--sent-neu)",
  no: "var(--sent-neg)",
} as const;

const PRICE_LINES = [
  { key: "tooCheap", name: "Muy barato", color: "var(--p-toocheap)" },
  { key: "bargain", name: "Buen precio", color: "var(--p-bargain)" },
  { key: "expensive", name: "Caro", color: "var(--p-expensive)" },
  { key: "tooExpensive", name: "Muy caro", color: "var(--p-tooexpensive)" },
] as const;

function formatQ(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `Q${Math.round(value).toLocaleString("es-GT")}`;
}

function qFromCents(cents: number | null): string {
  return cents === null ? "—" : formatQ(cents / 100);
}

function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

function labelOne(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? (value || "—");
}

function toChartRows(items: Bucket[], denom: number): ChartRow[] {
  return items.map((item) => ({
    value: item.value,
    label: item.label,
    count: item.count,
    pct: pct(item.count, denom),
  }));
}

export default function SurveyResultsDashboard({ records, onReset }: SurveyResultsDashboardProps) {
  const total = records.length;
  const [view, setView] = useState<View>("resumen");

  const analytics = useMemo(() => {
    const summary = summarize(records);
    return {
      summary,
      careTarget: ranked(careTargetDistribution(records)),
      careTargetTotal: records.filter((record) => record.careTarget).length,
      challenges: ranked(careChallengeDistribution(records)),
      organization: ranked(organizationDistribution(records)),
      concerns: ranked(trustConcernDistribution(records)),
      features: ranked(essentialFeatureDistribution(records)),
      prices: analyzePrices(records),
    };
  }, [records]);

  const rows = useMemo(
    () => [...records].sort((x, y) => y._creationTime - x._creationTime),
    [records],
  );

  function downloadCsv() {
    const blob = new Blob([`﻿${toCsv(records)}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `daury-encuesta-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const { summary } = analytics;
  const interestPct = pct(summary.interest.yes, summary.interest.total);
  const trustPct = pct(summary.trust.yes, summary.trust.total);
  const incidentPct = summary.incident.total ? pct(summary.incident.yes, summary.incident.total) : 0;

  return (
    <div
      className="sr min-h-screen bg-[var(--bg)] text-[var(--ink)]"
      style={{
        "--sent-pos": "var(--green)",
        "--sent-neu": "var(--ink-mute)",
        "--sent-neg": "var(--coral)",
        "--p-toocheap": "var(--blue)",
        "--p-bargain": "var(--green)",
        "--p-expensive": "#E0A100",
        "--p-tooexpensive": "#D8443C",
        "--org-paper": "var(--blue)",
        "--org-whatsapp": "var(--green)",
        "--org-memory": "#E0A100",
        "--org-app": "var(--coral)",
        "--org-other": "#C43D8F",
      } as React.CSSProperties}
    >
      <DashboardHeader
        total={total}
        view={view}
        onViewChange={setView}
        onDownload={downloadCsv}
        onReset={onReset}
      />

      <div className="sr-body">
        {total === 0 ? (
          <EmptyDashboard />
        ) : view === "resumen" ? (
          <SummaryDashboard
            total={total}
            summary={summary}
            analytics={analytics}
            interestPct={interestPct}
            trustPct={trustPct}
            incidentPct={incidentPct}
          />
        ) : (
          <ResponsesList rows={rows} />
        )}
      </div>
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────── */

function DashboardHeader({
  total,
  view,
  onViewChange,
  onDownload,
  onReset,
}: {
  total: number;
  view: View;
  onViewChange: (view: View) => void;
  onDownload: () => void;
  onReset?: () => void;
}) {
  return (
    <header className="sr-header border-b border-[var(--rule)] bg-[var(--bg-elev)]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--bg-elev)]/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <div className="min-w-0">
          <h1 className="font-['Bricolage_Grotesque','Geist',sans-serif] text-lg font-medium tracking-[-0.02em]">
            Daury
          </h1>
          <p className="font-['Geist_Mono',ui-monospace,monospace] text-[11px] text-[var(--ink-mute)]">
            {total} {total === 1 ? "respuesta" : "respuestas"}
          </p>
        </div>

        {total > 0 && (
          <div className="mx-auto inline-flex rounded-full bg-[var(--bg-2)] p-1" role="tablist" aria-label="Vista">
            <button
              type="button"
              role="tab"
              aria-selected={view === "resumen"}
              onClick={() => onViewChange("resumen")}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                view === "resumen"
                  ? "bg-[var(--bg-elev)] text-[var(--ink)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              Resumen
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "respuestas"}
              onClick={() => onViewChange("respuestas")}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                view === "respuestas"
                  ? "bg-[var(--bg-elev)] text-[var(--ink)] shadow-[var(--shadow-soft)]"
                  : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              }`}
            >
              Respuestas
            </button>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={total === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--bg-2)] px-3.5 font-['Geist_Mono',ui-monospace,monospace] text-xs text-[var(--ink)] transition-colors hover:bg-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            CSV
          </button>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              aria-label="Salir"
              className="inline-flex size-9 items-center justify-center rounded-xl bg-[var(--bg-2)] text-[var(--ink)] transition-colors hover:bg-[var(--bg)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Summary layout ─────────────────────────────────────── */

function SummaryDashboard({
  total,
  summary,
  analytics,
  interestPct,
  trustPct,
  incidentPct,
}: {
  total: number;
  summary: ReturnType<typeof summarize>;
  analytics: {
    challenges: Bucket[];
    careTarget: Bucket[];
    careTargetTotal: number;
    organization: Bucket[];
    concerns: Bucket[];
    features: Bucket[];
    prices: ReturnType<typeof analyzePrices>;
  };
  interestPct: number;
  trustPct: number;
  incidentPct: number;
}) {
  const attitudeRows: AttRow[] = [
    { label: "Interés", ...summary.interest },
    { label: "Confianza", ...summary.trust },
    {
      label: "Incidente",
      yes: summary.incident.yes,
      maybe: 0,
      no: summary.incident.no,
      total: summary.incident.total,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-5">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="Interés" value={formatPct(interestPct)} note={`${summary.interest.yes} de ${summary.interest.total}`} accent="var(--green)" />
          <KpiCard label="Confianza" value={formatPct(trustPct)} note={`${summary.trust.yes} de ${summary.trust.total}`} accent="var(--blue)" />
          <KpiCard
            label="Incidentes"
            value={summary.incident.total ? formatPct(incidentPct) : "—"}
            note={`${summary.incident.yes} de ${summary.incident.total}`}
            accent="var(--coral)"
          />
          <KpiCard label="Precio óptimo" value={formatQ(analytics.prices.opp)} note="al mes" accent="var(--violet)" />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Card
              title="Qué construir primero"
              subtitle={`${summary.denominators.features} interesados`}
            >
              {summary.denominators.features === 0 ? (
                <CardEmpty message="Nadie eligió funciones todavía." />
              ) : (
                <MetricBars rows={toChartRows(analytics.features, summary.denominators.features)} color="var(--violet)" />
              )}
            </Card>

            <Card title="Mayores retos">
              <MetricBars rows={toChartRows(analytics.challenges, summary.denominators.challenges)} color="var(--blue)" />
            </Card>

            <Card title="Tipo de cuidado" subtitle={`${analytics.careTargetTotal} respuestas`}>
              <MetricBars rows={toChartRows(analytics.careTarget, analytics.careTargetTotal)} color="var(--green)" />
            </Card>

            <Card title="Actitud general">
              <AttitudeBars rows={attitudeRows} />
            </Card>

            {summary.denominators.concerns > 0 && (
              <Card
                title="Qué frena la confianza"
                subtitle={`${summary.denominators.concerns} personas dudan`}
              >
                <MetricBars
                  rows={toChartRows(analytics.concerns, summary.denominators.concerns)}
                  color="var(--coral)"
                />
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card title="Cuánto pagarían al mes">
              <PriceChart analysis={analytics.prices} />
            </Card>

            <Card title="Cómo se organizan hoy" subtitle={`${total} respuestas`}>
              <OrganizationBreakdown data={analytics.organization} colors={ORG_COLORS} total={total} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function EmptyDashboard() {
  return (
    <div className="mx-auto flex max-w-md flex-1 items-center justify-center px-6 py-16">
      <div className="rounded-[var(--radius-l)] border border-dashed border-[var(--rule-2)] px-8 py-12 text-center text-[var(--ink-soft)]">
        Aún no hay respuestas. Compartí{" "}
        <code className="rounded-md bg-[var(--bg-2)] px-2 py-0.5 font-['Geist_Mono',monospace] text-[var(--ink)]">
          /es/encuesta
        </code>{" "}
        para empezar a recolectar.
      </div>
    </div>
  );
}

/* ── Card system ────────────────────────────────────────── */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-[var(--rule)] bg-[var(--bg-elev)] p-5 shadow-[0_1px_0_rgba(10,11,18,0.04)]">
      <header className="mb-4 flex items-start justify-between gap-3 border-b border-[var(--rule)] pb-3">
        <h2 className="font-['Bricolage_Grotesque','Geist',sans-serif] text-base font-medium tracking-[-0.015em] text-[var(--ink)]">
          {title}
        </h2>
        {subtitle && (
          <span className="shrink-0 font-['Geist_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.06em] text-[var(--ink-mute)]">
            {subtitle}
          </span>
        )}
      </header>
      <div>{children}</div>
    </article>
  );
}

function CardEmpty({ message }: { message: string }) {
  return <p className="py-2 text-center text-sm text-[var(--ink-mute)]">{message}</p>;
}

function KpiCard({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border border-[var(--rule)] p-5 shadow-[0_1px_0_rgba(10,11,18,0.04)]"
      style={{ background: `color-mix(in oklab, ${accent} 6%, var(--bg-elev))` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="size-1.5 shrink-0 rounded-full" style={{ background: accent }} aria-hidden />
        <span
          className="font-['Geist_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.1em]"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
      <p className="font-['Bricolage_Grotesque','Geist',sans-serif] text-3xl font-medium leading-none tracking-[-0.03em] text-[var(--ink)]">
        {value}
      </p>
      <p className="mt-1.5 font-['Geist_Mono',ui-monospace,monospace] text-[10px] tabular-nums text-[var(--ink-mute)]">
        {note}
      </p>
    </div>
  );
}

/* ── Charts ─────────────────────────────────────────────── */

function MetricBars({ rows, color }: { rows: ChartRow[]; color: string }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {rows.map((row) => (
        <li key={row.value} className={row.count === 0 ? "opacity-50" : undefined}>
          <div className="mb-1.5 flex items-start justify-between gap-4">
            <span className="min-w-0 flex-1 text-[13px] leading-snug text-[var(--ink)]">
              {row.label}
            </span>
            <span className="shrink-0 font-['Geist_Mono',ui-monospace,monospace] text-[12px] font-medium tabular-nums text-[var(--ink)]">
              {formatPct(row.pct)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-2)]">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${row.pct}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AttitudeBars({ rows }: { rows: AttRow[] }) {
  return (
    <div className="flex flex-col gap-4">
      {rows.map((row) => {
        const yesPct = pct(row.yes, row.total);
        const maybePct = pct(row.maybe, row.total);
        const noPct = pct(row.no, row.total);

        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="text-[13px] text-[var(--ink-soft)]">{row.label}</span>
              <span className="font-['Geist_Mono',ui-monospace,monospace] text-[12px] font-medium tabular-nums text-[var(--ink)]">
                {formatPct(yesPct)} sí
              </span>
            </div>
            <div
              className="flex h-2 overflow-hidden rounded-full bg-[var(--bg-2)]"
              title={`Sí ${row.yes} · Tal vez ${row.maybe} · No ${row.no}`}
            >
              {noPct > 0 && (
                <div className="h-full" style={{ width: `${noPct}%`, background: ATTITUDE_COLORS.no }} />
              )}
              {maybePct > 0 && (
                <div className="h-full" style={{ width: `${maybePct}%`, background: ATTITUDE_COLORS.maybe }} />
              )}
              {yesPct > 0 && (
                <div className="h-full" style={{ width: `${yesPct}%`, background: ATTITUDE_COLORS.yes }} />
              )}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3 border-t border-[var(--rule)] pt-3">
        <LegendItem color={ATTITUDE_COLORS.yes} label="Sí" />
        <LegendItem color={ATTITUDE_COLORS.maybe} label="Tal vez" />
        <LegendItem color={ATTITUDE_COLORS.no} label="No" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-[var(--ink-soft)]">
      <span className="size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function OrganizationBreakdown({
  data,
  colors,
  total,
}: {
  data: Bucket[];
  colors: Record<string, string>;
  total: number;
}) {
  const slices = data.filter((item) => item.count > 0);

  return (
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[140px_1fr]">
      <div className="mx-auto w-full max-w-[140px] md:mx-0">
        <div className="aspect-square w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                dataKey="count"
                stroke="var(--bg-elev)"
                strokeWidth={2}
              >
                {slices.map((entry) => (
                  <Cell key={entry.value} fill={colors[entry.value] ?? "var(--ink-mute)"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-elev)",
                  border: "1px solid var(--rule-2)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(value, _name, item) => {
                  const payload = item.payload as Bucket;
                  return [`${value} · ${formatPct(pct(payload.count, total))}`, payload.label];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {data.map((item) => (
          <li key={item.value} className={item.count === 0 ? "opacity-40" : undefined}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ background: colors[item.value] ?? "var(--ink-mute)" }}
                />
                <span className="text-[13px] leading-snug text-[var(--ink)]">{item.label}</span>
              </div>
              <span className="shrink-0 font-['Geist_Mono',ui-monospace,monospace] text-[12px] font-medium tabular-nums text-[var(--ink-soft)]">
                {formatPct(pct(item.count, total))}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-2)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct(item.count, total)}%`,
                  background: colors[item.value] ?? "var(--ink-mute)",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceChart({ analysis }: { analysis: ReturnType<typeof analyzePrices> }) {
  const hasData = analysis.sampleSize > 0 && analysis.points.length > 1;

  if (!hasData) {
    return <CardEmpty message="Aún no hay suficientes precios para trazar la curva." />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analysis.points} margin={{ top: 20, right: 12, bottom: 4, left: 0 }}>
            {analysis.pmc !== null && analysis.pme !== null && (
              <ReferenceArea
                x1={analysis.pmc}
                x2={analysis.pme}
                fill="var(--green)"
                fillOpacity={0.08}
                stroke="none"
              />
            )}
            <XAxis
              dataKey="price"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value: number) => formatQ(value)}
              tick={{ fill: "var(--ink-mute)", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "var(--rule-2)" }}
              minTickGap={28}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fill: "var(--ink-mute)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            {analysis.opp !== null && (
              <ReferenceLine
                x={analysis.opp}
                stroke="var(--violet)"
                strokeDasharray="4 4"
                label={{
                  value: formatQ(analysis.opp),
                  position: "top",
                  fill: "var(--violet)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}
            <Tooltip
              cursor={{ stroke: "var(--rule-2)" }}
              contentStyle={{
                background: "var(--bg-elev)",
                border: "1px solid var(--rule-2)",
                borderRadius: 10,
                fontSize: 12,
              }}
              labelFormatter={(value) => `Precio ${formatQ(Number(value))}`}
              formatter={(value, name) => [`${Math.round(Number(value))}%`, name]}
            />
            {PRICE_LINES.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-elev)" }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-[var(--rule)] pt-3">
        {PRICE_LINES.map((line) => (
          <span key={line.key} className="inline-flex items-center gap-2 text-[11px] text-[var(--ink-soft)]">
            <span className="h-0.5 w-4 rounded-full" style={{ background: line.color }} />
            {line.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Responses table ────────────────────────────────────── */

const TABLE_COLUMNS = [
  { key: "index", label: "#", className: "w-10 pr-2" },
  { key: "date", label: "Fecha", className: "w-[100px]" },
  { key: "interest", label: "Interés", className: "w-[68px]" },
  { key: "trust", label: "Confianza", className: "w-[76px]" },
  { key: "incident", label: "Incidente", className: "w-[76px]" },
  { key: "careTarget", label: "Cuidado", className: "min-w-[132px]" },
  { key: "organization", label: "Organiza", className: "min-w-[168px]" },
  { key: "challenges", label: "Retos", className: "min-w-[192px]" },
  { key: "features", label: "Funciones", className: "min-w-[168px]" },
  { key: "price", label: "Buen precio", className: "w-[88px]" },
  { key: "expand", label: "", className: "w-8" },
] as const;

const ROW_EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

function ResponsesList({ rows }: { rows: CareSurveyResultRecord[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fmtDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  function toggleRow(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-5">
      <div className="overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--bg-elev)] shadow-[0_1px_0_rgba(10,11,18,0.04)]">
        <div className="overflow-x-auto px-8 py-7">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--rule-2)]">
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={`pr-7 pb-4 pt-1 font-['Geist_Mono',ui-monospace,monospace] text-[9px] font-normal uppercase tracking-[0.12em] text-[var(--ink-mute)] last:pr-0 ${column.className}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((record, index) => (
                <ResponseTableRow
                  key={record._id}
                  record={record}
                  index={rows.length - index}
                  dateLabel={fmtDate(record._creationTime)}
                  expanded={expandedId === record._id}
                  onToggle={() => toggleRow(record._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ResponseTableRow({
  record,
  index,
  dateLabel,
  expanded,
  onToggle,
}: {
  record: CareSurveyResultRecord;
  index: number;
  dateLabel: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasPrice =
    record.priceTooCheapCents !== null ||
    record.priceBargainCents !== null ||
    record.priceExpensiveButPayCents !== null ||
    record.priceTooExpensiveCents !== null;

  const hasDetail =
    record.careChallenges.length > 0 ||
    record.essentialFeatures.length > 0 ||
    record.trustConcerns.length > 0 ||
    record.incidentStory.length > 0 ||
    record.interestNoReason.length > 0 ||
    Boolean(record.organizationAppName) ||
    Boolean(record.priorCareAppName) ||
    Boolean(record.paidCareDetails) ||
    Boolean(record.carePayer) ||
    Boolean(record.whatsappPreference) ||
    Boolean(record.discoveryChannel) ||
    Boolean(record.conditionDuration) ||
    Boolean(record.closingExperience) ||
    hasPrice;

  const orgLabel = labelOne(organizationMethodOptions, record.organizationMethod);
  const orgColor = ORG_COLORS[record.organizationMethod] ?? "var(--ink-mute)";

  return (
    <>
      <tr
        className={`group border-b border-[var(--rule)] transition-[border-color] duration-300 ${
          expanded ? "border-[var(--rule-2)]" : ""
        } ${hasDetail ? "cursor-pointer" : ""}`}
        onClick={hasDetail ? onToggle : undefined}
      >
        <td className="py-5 pr-7">
          <span
            className={`font-['Geist_Mono',ui-monospace,monospace] text-[11px] tabular-nums transition-colors duration-300 ${
              expanded ? "text-[var(--ink)]" : "text-[var(--ink-mute)]"
            }`}
          >
            {String(index).padStart(2, "0")}
          </span>
        </td>
        <td className="py-5 pr-7">
          <span className="whitespace-nowrap font-['Geist_Mono',ui-monospace,monospace] text-[11px] text-[var(--ink-soft)]">
            {dateLabel}
          </span>
        </td>
        <td className="py-5 pr-7">
          <AttitudeSignal value={record.appInterest} />
        </td>
        <td className="py-5 pr-7">
          <AttitudeSignal value={record.appTrust} />
        </td>
        <td className="py-5 pr-7">
          <AttitudeSignal value={record.hadIncident} />
        </td>
        <td className="py-5 pr-7">
          <span className="block truncate text-[12px] leading-snug text-[var(--ink)]" title={labelOne(careTargetOptions, record.careTarget ?? "")}>
            {labelOne(careTargetOptions, record.careTarget ?? "")}
          </span>
        </td>
        <td className="py-5 pr-7">
          <span className="block truncate text-[12px] leading-snug text-[var(--ink)]" title={orgLabel}>
            <span className="font-['Geist_Mono',ui-monospace,monospace] text-[10px]" style={{ color: orgColor }}>
              {record.organizationMethod ? "■ " : ""}
            </span>
            {orgLabel}
            {record.organizationOther ? (
              <span className="text-[var(--ink-soft)]"> · {record.organizationOther}</span>
            ) : null}
          </span>
        </td>
        <td className="py-5 pr-7">
          <TruncatedLabels
            options={careChallengeOptions}
            values={record.careChallenges}
            other={record.careChallengesOther}
          />
        </td>
        <td className="py-5 pr-7">
          <TruncatedLabels
            options={essentialFeatureOptions}
            values={record.essentialFeatures}
            other={record.essentialFeaturesOther}
          />
        </td>
        <td className="py-5 pr-7">
          <span className="font-['Geist_Mono',ui-monospace,monospace] text-[12px] tabular-nums text-[var(--ink)]">
            {qFromCents(record.priceBargainCents)}
          </span>
        </td>
        <td className="py-5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            disabled={!hasDetail}
            aria-expanded={expanded}
            aria-label={expanded ? "Ocultar detalle" : "Ver detalle"}
            className={`inline-flex size-6 items-center justify-center transition-colors duration-300 disabled:cursor-default disabled:opacity-25 ${
              expanded ? "text-[var(--ink)]" : "text-[var(--ink-mute)] hover:text-[var(--ink)]"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </td>
      </tr>

      {hasDetail && (
        <tr className="border-b border-[var(--rule)]">
          <td colSpan={TABLE_COLUMNS.length} className="p-0">
            <div
              className="grid transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className={`overflow-hidden ${expanded ? "" : "pointer-events-none"}`}>
                <ResponseDetailPanel
                  record={record}
                  hasPrice={hasPrice}
                  expanded={expanded}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ResponseDetailPanel({
  record,
  hasPrice,
  expanded,
}: {
  record: CareSurveyResultRecord;
  hasPrice: boolean;
  expanded: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={expanded ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: ROW_EXPAND_EASE }}
      className="grid grid-cols-1 gap-6 border-t border-[var(--rule-2)] px-1 py-6 lg:grid-cols-[1fr_220px]"
    >
      <div className="flex flex-col gap-5">
        {record.careChallenges.length > 0 && (
          <DetailSection label="Retos" expanded={expanded} delay={0.04}>
            <InlineTags
              options={careChallengeOptions}
              values={record.careChallenges}
              other={record.careChallengesOther}
            />
          </DetailSection>
        )}
        <DetailSection label="Contexto" expanded={expanded} delay={0.06}>
          <InlineFactList
            items={[
              ["Edad", labelOne(caredPersonAgeOptions, record.caredPersonAge ?? "")],
              ["Familiares", labelOne(familyCaregiverOptions, record.familyCaregivers ?? "")],
              ["Frecuencia", labelOne(coordinationFrequencyOptions, record.coordinationFrequency ?? "")],
              ["App de organización", record.organizationAppName ?? ""],
              ["App previa", record.priorCareAppName ?? ""],
            ]}
          />
        </DetailSection>
        {(record.currentlyPaysCare || record.carePayer || record.paidCareDetails) && (
          <DetailSection label="Gasto" expanded={expanded} delay={0.07}>
            <InlineFactList
              items={[
                ["Paga hoy", yesNoMaybeLabels[record.currentlyPaysCare ?? ""] ?? (record.currentlyPaysCare ?? "")],
                ["Detalle", record.paidCareDetails ?? ""],
                ["Quién pagaría", labelOne(carePayerOptions, record.carePayer ?? "")],
              ]}
            />
          </DetailSection>
        )}
        {record.trustConcerns.length > 0 && (
          <DetailSection label="Le frena" expanded={expanded} delay={0.08}>
            <InlineTags
              options={trustConcernOptions}
              values={record.trustConcerns}
              other={record.trustConcernsOther}
            />
          </DetailSection>
        )}
        {(record.interestRequirements?.length ?? 0) > 0 && (
          <DetailSection label="Para decir sí" expanded={expanded} delay={0.1}>
            <InlineTags
              options={interestRequirementOptions}
              values={record.interestRequirements ?? []}
              other={record.interestRequirementOther ?? ""}
            />
          </DetailSection>
        )}
        {record.essentialFeatures.length > 0 && (
          <DetailSection label="Funciones" expanded={expanded} delay={0.12}>
            <InlineTags
              options={essentialFeatureOptions}
              values={record.essentialFeatures}
              other={record.essentialFeaturesOther}
            />
          </DetailSection>
        )}
        {(record.whatsappPreference || record.discoveryChannel || record.conditionDuration) && (
          <DetailSection label="Producto" expanded={expanded} delay={0.14}>
            <InlineFactList
              items={[
                ["WhatsApp", labelOne(whatsappPreferenceOptions, record.whatsappPreference ?? "")],
                ["Canal", labelOne(discoveryChannelOptions, record.discoveryChannel ?? "")],
                ["Canal otro", record.discoveryOther ?? ""],
                ["Duración", labelOne(conditionDurationOptions, record.conditionDuration ?? "")],
              ]}
            />
          </DetailSection>
        )}
        {record.incidentStory && (
          <DetailSection label="Incidente" expanded={expanded} delay={0.16}>
            <p className="m-0 text-[12px] leading-[1.6] text-[var(--ink-soft)]">
              {record.incidentStory}
            </p>
          </DetailSection>
        )}
        {record.interestNoReason && (
          <DetailSection label="Sin interés" expanded={expanded} delay={0.2}>
            <p className="m-0 text-[12px] leading-[1.6] text-[var(--ink-soft)]">
              {record.interestNoReason}
            </p>
          </DetailSection>
        )}
        {record.closingExperience && (
          <DetailSection label="Cierre" expanded={expanded} delay={0.22}>
            <p className="m-0 text-[12px] leading-[1.6] text-[var(--ink-soft)]">
              {record.closingExperience}
            </p>
          </DetailSection>
        )}
      </div>

      {hasPrice && (
        <motion.div
          initial={false}
          animate={expanded ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
          transition={{ duration: 0.28, ease: ROW_EXPAND_EASE, delay: expanded ? 0.1 : 0 }}
          className="flex flex-col gap-4 border-t border-[var(--rule)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0"
        >
          <span className="font-['Geist_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.1em] text-[var(--ink-mute)]">
            Precios
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <PriceCell label="Muy caro" value={qFromCents(record.priceTooExpensiveCents)} />
            <PriceCell label="Caro" value={qFromCents(record.priceExpensiveButPayCents)} />
            <PriceCell label="Buen precio" value={qFromCents(record.priceBargainCents)} />
            <PriceCell label="Muy barato" value={qFromCents(record.priceTooCheapCents)} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function DetailSection({
  label,
  children,
  expanded,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  expanded: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={expanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      transition={{ duration: 0.24, ease: ROW_EXPAND_EASE, delay: expanded ? delay : 0 }}
      className="flex flex-col gap-1"
    >
      <span className="font-['Geist_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.1em] text-[var(--ink-mute)]">
        {label}
      </span>
      <div>{children}</div>
    </motion.div>
  );
}

function AttitudeSignal({ value }: { value: string }) {
  const text = yesNoMaybeLabels[value] ?? (value || "—");
  const tone =
    value === "yes" ? "yes" : value === "no" ? "no" : value === "maybe" ? "maybe" : "none";
  const toneConfig: Record<string, { color: string; weight: string }> = {
    yes: { color: "var(--green)", weight: "font-medium text-[var(--ink)]" },
    no: { color: "var(--coral)", weight: "font-medium text-[var(--ink)]" },
    maybe: { color: "var(--ink-mute)", weight: "text-[var(--ink-soft)]" },
    none: { color: "var(--rule-2)", weight: "text-[var(--ink-mute)]" },
  };
  const config = toneConfig[tone];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-[5px] shrink-0"
        style={{ background: config.color }}
        aria-hidden
      />
      <span className={`font-['Geist_Mono',ui-monospace,monospace] text-[11px] ${config.weight}`}>
        {text}
      </span>
    </span>
  );
}

function TruncatedLabels({
  options,
  values,
  other,
  maxVisible = 1,
}: {
  options: { value: string; label: string }[];
  values: string[];
  other?: string;
  maxVisible?: number;
}) {
  if (values.length === 0) {
    return <span className="font-['Geist_Mono',ui-monospace,monospace] text-[11px] text-[var(--ink-mute)]">—</span>;
  }

  const labels = values.map((value) =>
    value === "other" && other ? other : labelOne(options, value),
  );
  const visible = labels.slice(0, maxVisible);
  const extra = labels.length - maxVisible;

  return (
    <span className="text-[12px] leading-snug text-[var(--ink-soft)]">
      {visible.join(", ")}
      {extra > 0 && (
        <span className="ml-1 font-['Geist_Mono',ui-monospace,monospace] text-[10px] text-[var(--ink-mute)]">
          +{extra}
        </span>
      )}
    </span>
  );
}

function InlineTags({
  options,
  values,
  other,
}: {
  options: { value: string; label: string }[];
  values: string[];
  other?: string;
}) {
  if (values.length === 0) {
    return <span className="text-[12px] text-[var(--ink-mute)]">—</span>;
  }

  const labels = values.map((value) =>
    value === "other" && other ? other : labelOne(options, value),
  );

  return (
    <p className="m-0 text-[12px] leading-[1.55] text-[var(--ink)]">
      {labels.join(" · ")}
    </p>
  );
}

function InlineFactList({ items }: { items: [string, string][] }) {
  const visibleItems = items.filter(([, value]) => value && value !== "—");

  if (visibleItems.length === 0) {
    return <span className="text-[12px] text-[var(--ink-mute)]">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {visibleItems.map(([label, value]) => (
        <span key={label} className="text-[12px] leading-[1.55] text-[var(--ink-soft)]">
          <span className="text-[var(--ink-mute)]">{label}: </span>
          <span className="text-[var(--ink)]">{value}</span>
        </span>
      ))}
    </div>
  );
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-['Geist_Mono',ui-monospace,monospace] text-[8px] uppercase tracking-[0.08em] text-[var(--ink-mute)]">
        {label}
      </p>
      <p className="mt-0.5 font-['Geist_Mono',ui-monospace,monospace] text-[12px] tabular-nums text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
