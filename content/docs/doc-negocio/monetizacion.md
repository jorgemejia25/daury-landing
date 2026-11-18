---
title: "Monetización"
description: "Notas sobre planes, precios y fuentes de ingreso."
tags: ["precios"]
source: "Notas del proyecto"
---

> Migrado desde: Notas del proyecto. Conserva el contenido original; las cifras y fechas son las de ese documento.

## Cómo genera ingresos la infraestructura
- Si es todo gratis, ¿cómo se mantiene?
- Si tiene planes de pago, ¿cómo se mantiene?

## Opciones a evaluar

Marca con `[x]` la(s) que decidan seguir. Se puede combinar más de una (ej. Freemium + B2B2C).

- [ ] **Freemium (B2C)** — Núcleo diario, gestión de actividades y registro siempre gratis. De pago: historial extendido (más de X semanas), reporte para el doctor en PDF, o "Familia" con más de 1-2 personas invitadas.
  - Pro: fácil de explicar, sin fricción de entrada, alinea con el argumento social del proyecto.
  - Contra: en el perfil de usuario que definimos (bajos recursos, rural), la disposición a pagar puede ser baja — hay que validarlo, no asumirlo.

- [x] **B2B2C vía clínicas / fisioterapeutas / geriatras** — El profesional paga una licencia y la ofrece a sus pacientes como parte del alta o del plan de tratamiento (la app queda gratis para la familia).
~~  - Pro: quien paga (la clínica) no es quien tiene la barrera de conectividad/alfabetización; canal de distribución natural, ya lo identificamos como el más lógico en la comparación de potencial del proyecto.~~
  - Contra: ciclo de venta más largo, requiere validar con profesionales antes de tener ingresos.

Investigar con clinica.

- [x] **B2B con residencias / centros de día** — Licencia por número de pacientes atendidos, uso institucional en vez de familiar.
  - Pro: ticket más alto, pago recurrente predecible.
  - Contra: cambia el usuario principal (de familia a institución), puede desviar el foco del MVP actual.

- [ ] **Suscripción simple (B2C, sin freemium)** — Un solo plan mensual/anual, sin capas gratis/paga.
  - Pro: simple de comunicar y de construir.
  - Contra: barrera de entrada alta para el público que más necesita la app; choca con el argumento social si se cobra desde el día uno.

- [ ] **Patrocinio / alianza con ONG o programa de salud pública** — Financiamiento externo (ONG, ministerio de salud, cooperación internacional) para que la app sea gratuita para las familias.
  - Pro: coherente con el impacto social como eje central del proyecto; posible vía de validación temprana sin necesidad de que la familia pague.
  - Contra: depende de terceros, no es un modelo de negocio sostenible por sí solo a largo plazo.

Intentar e investigar, no basarnos al 100 en esto.

- [ ] **Datos agregados y anónimos para investigación** — Vender o compartir estadísticas agregadas (no datos personales) a instituciones de salud o investigación.
  - Pro: ingreso adicional sin cobrar directo al usuario.
  - Contra: requiere resolver primero las preguntas de [[Seguridad y Legal]] sobre manejo de datos de salud; riesgo reputacional si no se comunica con total transparencia.

## Preguntas abiertas antes de decidir
- ¿El profesional de salud (Fase B2B2C) es el mismo que ya usan como aliado en el pitch, o hay que buscar uno nuevo?
- ¿Cuánto costaría operar el backend + la llamada a IA por usuario activo? Eso define el piso mínimo de cualquier plan pagado.
- ¿La demo/prototipo actual necesita mostrar monetización, o solo el producto? (Probablemente no — el MVP de producto no depende de esto.)

## Related
- [[Seguridad y Legal]]
- [[Pitch y Estrategia]]
