import { Bell, BookOpenCheck, Check, HeartPulse, Pill, ScanText, Star, Users, WifiOff, X } from "lucide-react";
import { Chip } from "@/ui/atoms/Chip";
import { IconTile } from "@/ui/atoms/IconTile";
import type { Tone } from "@/ui/lib/tones";
import { Card } from "@/ui/molecules/Card";
import { audiences, businessModes, features, plans, productRoadmap, viability, viabilityCriteria, week } from "@/features/admin/lib/knowledge";
import { BrandList, BrandSection } from "./KnowledgeSection";
import styles from "./Knowledge.styles";

const featureIcons: Record<string, React.ReactNode> = {
  today: <Bell size={22} strokeWidth={2} />,
  guide: <BookOpenCheck size={22} strokeWidth={2} />,
  scan: <ScanText size={22} strokeWidth={2} />,
  family: <Users size={22} strokeWidth={2} />,
  health: <HeartPulse size={22} strokeWidth={2} />,
  offline: <WifiOff size={22} strokeWidth={2} />,
};
const audienceIcons = [<Users key="f" size={22} strokeWidth={2} />, <Pill key="c" size={22} strokeWidth={2} />, <HeartPulse key="m" size={22} strokeWidth={2} />];

/** Qué es Daury, para quién, qué hace la app, sus planes y el modelo con clínicas. */
export function ProductOverview() {
  return (
    <>
      <BrandSection id="personas" eyebrow="Para quién" title="Cuidar a quien quieres, en familia" lede="Daury es una app hecha en Guatemala, en español, para quienes cuidan en casa a una persona con dificultades de memoria o con tratamientos que seguir.">
        <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
          {audiences.map((item, index) => (
            <li key={item.title}>
              <Card padding="lg" className={styles.stack}>
                <IconTile tone={item.tone}>{audienceIcons[index]}</IconTile>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="funciones" eyebrow="La app" title="Lo que hace Daury" lede="Las pantallas principales de la app móvil. Todo lo que se registra funciona sin conexión.">
        <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
          {features.map((feature) => (
            <li key={feature.title}>
              <Card padding="lg" className={styles.feature}>
                <IconTile tone={feature.tone} size={48}>{featureIcons[feature.icon]}</IconTile>
                <span>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  <p className={styles.text}>{feature.text}</p>
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="consultas" eyebrow="La idea" title="El médico no ve lo que pasa entre una consulta y otra" lede="Hoy no sabe si el paciente tomó sus medicinas o tuvo síntomas. Daury ya registra eso en casa; con permiso del paciente, el médico podría verlo.">
        <Card padding="lg" className={styles.track}>
          <div className={styles.trackRow} role="img" aria-label="Siete días entre dos consultas: cinco dosis registradas y dos omitidas">
            <span className={styles.visit}><IconTile tone="ink" size={52}><HeartPulse size={26} strokeWidth={2} /></IconTile>Consulta</span>
            <ol className={`m-0 p-0 list-none ${styles.days}`}>
              {week.map((item, index) => (
                <li key={index} data-done={item.done || undefined}>
                  <span>{item.done ? <Check size={18} strokeWidth={3} aria-hidden="true" /> : <X size={18} strokeWidth={3} aria-hidden="true" />}</span>
                  <small>{item.day}</small>
                </li>
              ))}
            </ol>
            <span className={styles.visit}><IconTile tone="blue" solid size={52}><HeartPulse size={26} strokeWidth={2} /></IconTile>Próxima consulta</span>
          </div>
          <div className={styles.trackCaption}>
            <p><b>Lo que registra la familia:</b> dosis, síntomas, ánimo y actividades.</p>
            <p><b>Lo que ve el médico:</b> adherencia y alertas, solo si el paciente lo autoriza.</p>
          </div>
        </Card>
      </BrandSection>

      <BrandSection id="planes" eyebrow="Planes" title="Dos planes para familias y dos para profesionales" lede="Professional y Business usan los datos que Daury ya registra. Ninguno reemplaza el expediente de la clínica ni se conecta a sus sistemas al inicio.">
        <ul className={`m-0 p-0 list-none ${styles.grid4}`}>
          {plans.map((plan) => (
            <li key={plan.name}>
              <Card padding="lg" className={styles.plan} data-tone={plan.tone}>
                <span className={styles.planHead}>
                  <h3 className={styles.cardTitle}>{plan.name}</h3>
                  <Chip size="sm" tone={plan.tone as Tone}>{plan.status}</Chip>
                </span>
                <span className={styles.price}><b>{plan.price}</b><small>{plan.note}</small></span>
                <BrandList items={plan.items} />
              </Card>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="clinicas" eyebrow="Modelo con clínicas" title="Tres formas de trabajar con clínicas" lede="Se pueden usar por separado o juntas. Ninguna le da a la clínica acceso a los datos del paciente sin su permiso.">
        <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
          {businessModes.map((mode) => (
            <li key={mode.title}>
              <Card padding="lg" className={styles.stack}>
                <span className={styles.planHead}>
                  <Chip size="sm" tone={mode.tone}>{mode.kind}</Chip>
                  {mode.favorite ? <Chip size="sm" tone="amber" solid icon={<Star size={12} strokeWidth={2.6} aria-hidden="true" />}>Favorita</Chip> : null}
                </span>
                <h3 className={styles.cardTitle}>{mode.title}</h3>
                <p className={styles.text}>{mode.text}</p>
                <p className={styles.meta}>Paga: {mode.payer}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Card padding="none" className={styles.table}>
          <table>
            <caption className="sr-only">Viabilidad preliminar de cada opción, de 1 a 3 puntos</caption>
            <thead>
              <tr><th scope="col">Opción</th>{viabilityCriteria.map((criterion) => <th scope="col" key={criterion}>{criterion}</th>)}<th scope="col">Lectura</th></tr>
            </thead>
            <tbody>
              {viability.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  {row.scores.map((score, index) => (
                    <td key={index}>
                      <span className={styles.dots} aria-label={`${score} de 3`}>
                        {[1, 2, 3].map((dot) => <i key={dot} data-on={dot <= score || undefined} />)}
                      </span>
                    </td>
                  ))}
                  <td><Chip size="sm" tone={row.tone}>{row.verdict}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className={styles.footnote}>Evaluación preliminar para discutir en equipo, no un estudio. Propuesta, planes y modelo de negocio: Fátima Cerezo.</p>
      </BrandSection>

      <BrandSection id="ruta" eyebrow="Ruta" title="De lo más barato a lo más grande" lede="Cada fase empieza solo si la anterior demostró demanda.">
        <ol className={`m-0 p-0 list-none ${styles.grid4}`}>
          {productRoadmap.map((step) => (
            <li key={step.phase}>
              <Card padding="lg" className={styles.phase} data-tone={step.tone}>
                <span className={styles.phaseLabel}>{step.phase}</span>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
                <p className={styles.measure}><b>Mide:</b> {step.measure}</p>
              </Card>
            </li>
          ))}
        </ol>
      </BrandSection>
    </>
  );
}
