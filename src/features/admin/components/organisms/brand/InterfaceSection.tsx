import { ArrowRight, Bell, Check, HeartPulse, House, Pill, Users } from "lucide-react";
import { Button, type ButtonVariant } from "@/ui/atoms/Button";
import { Chip } from "@/ui/atoms/Chip";
import { IconTile } from "@/ui/atoms/IconTile";
import type { Tone } from "@/ui/lib/tones";
import { Card } from "@/ui/molecules/Card";
import { ListRow } from "@/ui/molecules/ListRow";
import { BrandSection, BrandSubhead } from "./BrandSection";
import styles from "./BrandGuide.styles";

const buttons: { variant: ButtonVariant; label: string; use: string }[] = [
  { variant: "primary", label: "Guardar", use: "Acción principal de la pantalla. Una por pantalla." },
  { variant: "secondary", label: "Cancelar", use: "Acción secundaria." },
  { variant: "soft", label: "Escuchar", use: "Acciones ligeras: ver, escuchar." },
  { variant: "ink", label: "Listo", use: "Confirmaciones." },
  { variant: "success", label: "Tomada", use: "Confirmar algo hecho." },
  { variant: "danger", label: "Eliminar", use: "Acciones destructivas." },
  { variant: "text", label: "Omitir", use: "Enlaces y acciones discretas." },
];

const tones: { tone: Tone; meaning: string; icon: React.ReactNode }[] = [
  { tone: "blue", meaning: "Acción", icon: <House size={22} strokeWidth={2} /> },
  { tone: "green", meaning: "Hecho", icon: <Check size={22} strokeWidth={2.4} /> },
  { tone: "coral", meaning: "Alerta", icon: <HeartPulse size={22} strokeWidth={2} /> },
  { tone: "violet", meaning: "Familia", icon: <Users size={22} strokeWidth={2} /> },
  { tone: "amber", meaning: "Aviso", icon: <Bell size={22} strokeWidth={2} /> },
  { tone: "neutral", meaning: "Neutro", icon: <Pill size={22} strokeWidth={2} /> },
];

const radii = [
  { name: "xs", value: 10 },
  { name: "sm", value: 14 },
  { name: "md", value: 16, note: "Campos" },
  { name: "lg", value: 20, note: "Tarjetas pequeñas" },
  { name: "xl", value: 24, note: "Tarjetas" },
  { name: "xxl", value: 28, note: "Hojas modales" },
  { name: "pill", value: 999, note: "Botones y chips" },
];

export function InterfaceSection() {
  return (
    <BrandSection
      id="interfaz"
      eyebrow="Interfaz"
      title="Los componentes de la app"
      lede="La app y este admin comparten el mismo sistema: botones en píldora, tarjetas blancas con sombra suave y un tono por significado. Estos ejemplos son los componentes reales de la wiki, en src/ui."
    >
      <BrandSubhead title="Botones" note="Píldora con etiqueta en Geist Bold. Alturas de 56, 46 y 38 px." />
      <Card padding="none">
        <ul className={`m-0 p-0 list-none ${styles.buttonList}`}>
          {buttons.map((button) => (
            <li key={button.variant}>
              <span className={styles.buttonSample}>
                <Button variant={button.variant} size="md" tabIndex={-1} aria-hidden="true">
                  {button.label}
                </Button>
              </span>
              <span className={styles.buttonName}>
                <b>{button.variant}</b>
                <small>{button.use}</small>
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <div className={styles.sizes} aria-hidden="true">
        <Button variant="primary" size="lg" tabIndex={-1} icon={<ArrowRight size={20} strokeWidth={2.2} />} iconPosition="trailing">Grande · 56</Button>
        <Button variant="primary" size="md" tabIndex={-1}>Mediano · 46</Button>
        <Button variant="primary" size="sm" tabIndex={-1}>Pequeño · 38</Button>
      </div>

      <BrandSubhead title="Tonos, chips y tiles" note="Cada tono tiene fondo suave y tinta. Se usan en chips de estado, cuadros de ícono y puntos." />
      <ul className={`m-0 p-0 list-none ${styles.toneGrid}`}>
        {tones.map((item) => (
          <li key={item.tone}>
            <Card padding="md" className={styles.toneCard}>
              <IconTile tone={item.tone}>{item.icon}</IconTile>
              <span className={styles.toneChips}>
                <Chip tone={item.tone} dot>{item.meaning}</Chip>
                <Chip tone={item.tone} solid size="sm">{item.tone}</Chip>
              </span>
            </Card>
          </li>
        ))}
      </ul>

      <div className={styles.grid2}>
        <div>
          <BrandSubhead title="Filas de lista" note="Tile de 46 px, título en Geist SemiBold 16 y meta en 13." />
          <Card padding="none">
            <ListRow leading={<IconTile tone="blue"><Pill size={22} strokeWidth={2} /></IconTile>} title="Losartán 50 mg" subtitle="08:00 · Con el desayuno" chevron />
            <ListRow divider leading={<IconTile tone="green"><Check size={22} strokeWidth={2.4} /></IconTile>} title="Caminata corta" subtitle="Completada a las 07:30" trailing={<Chip size="sm" tone="green">Hecho</Chip>} />
            <ListRow divider leading={<IconTile tone="amber"><Bell size={22} strokeWidth={2} /></IconTile>} title="Cita de control" subtitle="Jueves · 10:00" chevron />
          </Card>
        </div>
        <div>
          <BrandSubhead title="Radios y sombras" note="Escala BorderRadius de la app." />
          <Card padding="lg">
            <ul className={`m-0 p-0 list-none ${styles.radii}`}>
              {radii.map((radius) => (
                <li key={radius.name}>
                  <span className={styles.radiusBox} style={{ borderRadius: Math.min(radius.value, 32) }} aria-hidden="true" />
                  <b>{radius.name}</b>
                  <small>{radius.value === 999 ? "999" : `${radius.value} px`}{radius.note ? ` · ${radius.note}` : ""}</small>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </BrandSection>
  );
}
