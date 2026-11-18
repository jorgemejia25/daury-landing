import { Card } from "@/ui/molecules/Card";
import { Chip } from "@/ui/atoms/Chip";
import { mascotAnimation, mascotDo, mascotDont, mascotExplorations, mascotMoods, mascotMoodsImage, mascotPoses } from "@/features/admin/lib/brand";
import { MascotMono } from "@/features/admin/components/atoms/brand/MascotMono";
import { BrandList, BrandSection, BrandSubhead } from "./BrandSection";
import styles from "./BrandGuide.styles";
import gallery from "./BrandGallery.styles";

/* eslint-disable @next/next/no-img-element -- ilustraciones estáticas de marca, sin optimización de imagen. */
export function MascotSection() {
  return (
    <BrandSection
      id="mascota"
      eyebrow="Mascota"
      title="La mascota y sus poses"
      lede="La mascota es un cerebro que camina. Acompaña contenido de apoyo y no reemplaza al logo. Cada pose tiene un uso: elige la que cuente lo que pasa en la pantalla."
    >
      <BrandSubhead title="Poses" note="Siempre en azul marino, sobre crema, blanco o azul claro." />
      <ul className={`m-0 p-0 list-none ${gallery.poses}`}>
        {mascotPoses.map((pose) => (
          <li key={pose.name} className={gallery.tile}>
            <div className={gallery.stage}><img src={pose.file} alt={`Mascota de Daury: ${pose.name.toLowerCase()}`} loading="lazy" /></div>
            <div className={gallery.caption}>
              <b>{pose.name}</b>
              <span>{pose.use}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className={gallery.split}>
        <figure className={gallery.tile}>
          <video className={gallery.video} src={mascotAnimation.video} poster={mascotAnimation.poster} autoPlay muted loop playsInline aria-label="Mascota de Daury animada saludando" />
          <figcaption className={gallery.caption}>
            <b>Animada · saludo</b>
            <span>Versión con volumen para vídeo y redes. Úsala en aperturas y despedidas, no en la interfaz.</span>
          </figcaption>
        </figure>
        <Card padding="lg" className={styles.stack}>
          <div className={styles.mascotStage}>
            <span className={styles.monoRow}>
              <span  className={"[color:#2358E8]!"}><MascotMono label="Mascota monocroma azul" /></span>
              <span  className={"[color:#15161D]!"}><MascotMono label="Mascota monocroma tinta" /></span>
            </span>
          </div>
          <h3 className={styles.cardTitle}>Un solo color</h3>
          <p className={styles.note}>En azul o tinta, sobre fondos claros. La cara siempre queda en blanco.</p>
        </Card>
      </div>

      <BrandSubhead title="Emociones" note="Sistema de caras de la identidad original: refleja cómo está la persona cuidada." />
      <div className={gallery.moods}>
        <div className={gallery.moodImage}><img src={mascotMoodsImage} alt="Cuatro caras de la mascota original: tranquila, triste, feliz y alerta" loading="lazy" /></div>
        <ul className={`m-0 p-0 list-none ${gallery.moodList}`}>
          {mascotMoods.map((mood) => (
            <li key={mood.name}>
              <Chip size="sm" tone={mood.tone} dot>{mood.name}</Chip>
              <span>{mood.use}</span>
            </li>
          ))}
        </ul>
      </div>

      <BrandSubhead title="Exploraciones" note="Variantes de la pose caminando antes de fijar la versión final. Solo como referencia." />
      <ul className={`m-0 p-0 list-none ${gallery.explorations}`}>
        {mascotExplorations.map((item) => (
          <li key={item.name} className={gallery.tile}>
            <div className={gallery.stage} data-size="sm"><img src={item.file} alt={`Mascota de Daury, ${item.name.toLowerCase()}`} loading="lazy" /></div>
          </li>
        ))}
      </ul>

      <div className={styles.grid2}>
        <Card padding="lg" className={styles.stack}>
          <Chip tone="green" dot>Sí</Chip>
          <BrandList items={mascotDo} />
        </Card>
        <Card padding="lg" className={styles.stack}>
          <Chip tone="coral" dot>No</Chip>
          <BrandList items={mascotDont} />
        </Card>
      </div>
    </BrandSection>
  );
}
