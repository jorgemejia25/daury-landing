import { Check, Minus } from "lucide-react";
import { Chip } from "@/ui/atoms/Chip";
import type { Tone } from "@/ui/lib/tones";
import { Card } from "@/ui/molecules/Card";
import { architecture, codeTree, libraries, offlineRules, roles, scaleLimits, scaleStats, scopes, syncExample, syncSteps, techRoadmap, type TreeNode } from "@/features/admin/lib/knowledge";
import { BrandSection, BrandSubhead } from "../brand/BrandSection";
import styles from "./Knowledge.styles";

const statusChip = (status?: string) => {
  if (!status) return null;
  const map: Record<string, { label: string; tone: Tone }> = { done: { label: "Hecho", tone: "green" }, next: { label: "Sigue", tone: "amber" }, later: { label: "Después", tone: "violet" }, F2: { label: "F2", tone: "amber" } };
  const chip = map[status] ?? { label: status, tone: "violet" as Tone };
  return <Chip size="sm" tone={chip.tone}>{chip.label}</Chip>;
};

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className={styles.tree}>
      {nodes.map((node) => (
        <li key={node.path}>
          <span className={styles.treeRow}>
            <code>{node.path}</code>
            {node.note ? <span className={styles.treeNote}>{node.note}</span> : null}
            {statusChip(node.status)}
          </span>
          {node.children ? <Tree nodes={node.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

/** Arquitectura de Daury: componentes, reglas sin conexión, sincronización, permisos, código, librerías y ruta. */
export function TechnologyOverview() {
  return (
    <>
      <BrandSection id="arquitectura" eyebrow="Arquitectura" title="Los datos se guardan en el teléfono y después se sincronizan" lede="El servidor es un programa en Go dividido en módulos, más un worker para tareas en segundo plano. PostgreSQL guarda la copia oficial. El teléfono tiene su propia base cifrada y todas las funciones de registro operan sin conexión.">
        <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
          {architecture.map((block) => (
            <li key={block.title}>
              <Card padding="lg" className={styles.stack} data-tone={block.tone}>
                <span className={styles.blockBar} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{block.title}</h3>
                <p className={styles.text}>{block.text}</p>
                <ul className={`m-0 p-0 list-none ${styles.parts}`}>
                  {block.parts.map((part) => (
                    <li key={part.name} data-status={part.status}>
                      <span>
                        <code>{part.name}</code>
                        <small>{part.note}</small>
                      </span>
                      {part.status === "done" ? <Chip size="sm" tone="green">Hecho</Chip> : <Chip size="sm" tone={part.status === "next" ? "amber" : "violet"}>{"phase" in part ? part.phase : ""}</Chip>}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="reglas" eyebrow="Sin conexión" title="Tres reglas, definidas antes que los endpoints">
        <ol className={`m-0 p-0 list-none ${styles.grid3}`}>
          {offlineRules.map((rule, index) => (
            <li key={rule.title}>
              <Card padding="lg" className={styles.stack}>
                <span className={styles.number}>{index + 1}</span>
                <h3 className={styles.cardTitle}>{rule.title}</h3>
                <p className={styles.text}>{rule.text}</p>
                <p className={styles.why}>{rule.why}</p>
              </Card>
            </li>
          ))}
        </ol>
        <BrandSubhead title="Sincronización (fase 2)" note="Una petición por lote: el teléfono envía lo pendiente y recibe lo nuevo de los demás en la misma respuesta." />
        <div className={styles.split}>
          <ol className={`m-0 p-0 list-none ${styles.steps}`}>
            {syncSteps.map((step, index) => (
              <li key={index}><span>{index + 1}</span>{step}</li>
            ))}
          </ol>
          <Card padding="lg" tone="ink" className={styles.code}>
            <pre><code>{syncExample}</code></pre>
          </Card>
        </div>
      </BrandSection>

      <BrandSection id="permisos" eyebrow="Modelo de datos" title="Cada tabla pertenece a un espacio de cuidado" lede="Cada tabla lleva su care_space_id y las llaves foráneas compuestas impiden apuntar a datos de otro espacio. Una petición sobre un espacio ajeno responde 404, igual que un recurso inexistente.">
        <BrandSubhead title="Qué puede hacer cada rol" note="Cada membresía crea un permiso con estos alcances. Una clínica recibirá un permiso con el mismo formato, sin cambios en el esquema." />
        <Card padding="none" className={styles.table}>
          <table className={styles.permissions}>
            <thead>
              <tr>
                <th scope="col">Rol</th>
                {scopes.map((scope) => <th scope="col" key={scope.id}>{scope.label}<code>{scope.id}</code></th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <th scope="row"><b>{role.name}</b><code>{role.id}</code></th>
                  {scopes.map((scope) => (
                    <td key={scope.id}>
                      {role.scopes.includes(scope.id) ? (
                        <span className={styles.yes} aria-label="Sí"><Check size={15} strokeWidth={3} aria-hidden="true" /></span>
                      ) : (
                        <span className={styles.no} aria-label="No"><Minus size={15} strokeWidth={2.4} aria-hidden="true" /></span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </BrandSection>

      <BrandSection id="codigo" eyebrow="Código" title="Una carpeta por módulo, con la misma estructura" lede="http/ recibe la petición, el servicio aplica permisos y reglas, el dominio no importa ninguna otra capa y adapter/ implementa el acceso a PostgreSQL con sqlc.">
        <Card padding="lg">
          <Tree nodes={codeTree} />
        </Card>
        <BrandSubhead title="Librerías" note="Pocas dependencias, todas fijadas a una versión." />
        <ul className={`m-0 p-0 list-none ${styles.grid3}`}>
          {libraries.map((group) => (
            <li key={group.title}>
              <Card padding="lg" className={styles.stack}>
                <Chip tone={group.tone}>{group.title}</Chip>
                <dl className={styles.libs}>
                  {group.items.map((lib) => (
                    <div key={lib.name}>
                      <dt>{lib.name}<code>{lib.version}</code></dt>
                      <dd>{lib.note}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection id="fases" eyebrow="Ruta" title="Seis fases, cada una con un control de capacidad">
        <ol className={`m-0 p-0 list-none ${styles.grid3}`}>
          {techRoadmap.map((step) => (
            <li key={step.phase}>
              <Card padding="lg" className={styles.phase} data-status={step.status}>
                <span className={styles.planHead}>
                  <span className={styles.phaseLabel}>{step.phase}</span>
                  {statusChip(step.status)}
                </span>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
                <p className={styles.measure}><b>Control:</b> {step.control}</p>
              </Card>
            </li>
          ))}
        </ol>
      </BrandSection>

      <BrandSection id="escala" eyebrow="Escala" title="¿Y si de pronto hay 20,000 descargas?" lede="El diseño soporta unos 100,000 usuarios sin cambiar el código. Pasar a la siguiente etapa es cambiar variables de infraestructura.">
        <ul className={`m-0 p-0 list-none ${styles.grid4}`}>
          {scaleStats.map((stat) => (
            <li key={stat.label}>
              <Card padding="lg" className={styles.stat}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </Card>
            </li>
          ))}
        </ul>
        <BrandSubhead title="Dónde se rompe primero" />
        <ul className={`m-0 p-0 list-none ${styles.grid4}`}>
          {scaleLimits.map((limit) => (
            <li key={limit.title}>
              <Card padding="lg" tone="amber" className={styles.stack}>
                <h3 className={styles.cardTitle}>{limit.title}</h3>
                <p className={styles.text}>{limit.text}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className={styles.footnote}>Fuente: artifact “Backend de Daury” y docs/05_architecture/backend-fases.md.</p>
      </BrandSection>
    </>
  );
}
