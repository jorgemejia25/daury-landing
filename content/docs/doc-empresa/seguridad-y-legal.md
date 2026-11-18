---
title: "Seguridad y legal"
description: "Notas sobre privacidad, datos de salud y requisitos legales."
tags: ["legal", "seguridad"]
source: "Notas del proyecto"
---

> Migrado desde: Notas del proyecto. Conserva el contenido original; las cifras y fechas son las de ese documento.

## Contexto legal en Guatemala (importante: no confundir con otros países)

**Guatemala NO tiene todavía una ley integral de protección de datos personales.** A julio de 2026, existe un vacío legal reconocido incluso por gremiales de tecnología del país. Lo que sí existe:

- **Constitución Política**: reconoce el derecho a la intimidad y el honor (Art. 24, 30, 31), base del derecho a la "autodeterminación informativa" — el fundamento de cualquier reclamo futuro relacionado con datos personales.
- **Ley de Acceso a la Información Pública, Decreto 57-2008**: define por primera vez "datos personales" y "datos sensibles" en el ordenamiento guatemalteco, y establece el mecanismo de hábeas data. Pero su alcance se limita a archivos estatales o entidades privadas que manejan fondos públicos — **no aplica directamente a una app privada como Daury**, aunque sus definiciones sirven como referencia de buenas prácticas.
- **Jurisprudencia de la Corte de Constitucionalidad** (expedientes 1356-2006, 863-2011, 3552-2014): reconoce derechos tipo ARCO (acceso, rectificación, cancelación, oposición) por vía judicial, aunque no exista ley específica que los regule para el sector privado.
- **Código Penal**: sí castiga la comercialización no autorizada de datos personales — de 5 a 8 años de prisión y multa de Q50,000 a Q100,000. Esto aplica sin importar que no haya ley de protección de datos general.
- **Iniciativa de Ley de Protección de Datos Personales**: hay una propuesta activa en el Congreso (más reciente que la iniciativa 4090 de años anteriores) que busca crear por fin una ley integral, con derechos ARCO-POL y una autoridad de aplicación. **Sigue siendo iniciativa, no ley vigente** — hay que monitorear su avance, no asumir que ya aplica.
- **No se encontró regulación específica de salud digital, telemedicina o apps médicas para Guatemala.** El Código de Salud (Decreto 90-97) rige al Ministerio de Salud, pero no hay evidencia de un marco específico para aplicaciones privadas que gestionan datos de salud de terceros.

**Nota importante**: El Salvador sí tiene una ley integral vigente desde noviembre 2024 (Decreto Legislativo 144, con Agencia de Ciberseguridad del Estado como autoridad, derechos ARCO-POL, notificación de brechas en 72 horas). Es un buen modelo de referencia para diseñar buenas prácticas — pero no es la ley de Guatemala y no debe citarse como tal en el pitch.

## Qué significa esto para Daury, en la práctica

Que no exista una ley integral **no reduce el riesgo, lo cambia de forma**: sin un marco claro, el reclamo más probable no vendría de un regulador (no hay uno para el sector privado todavía), sino de una demanda civil o penal directa por mal manejo de datos sensibles de salud, o de daño reputacional si hay una filtración. La estrategia correcta es diseñar como si la ley ya existiera — así, cuando la iniciativa del Congreso se apruebe (o si expanden a mercados como El Salvador, que ya la tiene), Daury ya cumple.

## Estrategias de prevención — checklist de buenas prácticas

**Consentimiento y transparencia**
- [ ] Consentimiento explícito del cuidador antes de guardar datos de salud de la persona a su cargo (no solo términos y condiciones genéricos).
- [ ] Aviso de privacidad simple, en el mismo estilo accesible del resto de la app (ícono + audio), no un documento legal ilegible para el propio público objetivo.
- [ ] Dejar claro qué se guarda, para qué se usa, y que Daury no vende ni comparte datos con terceros sin autorización.

**Minimización y seguridad técnica**
- [ ] Guardar solo los datos estrictamente necesarios (evitar campos "por si acaso").
- [ ] Cifrado de datos en tránsito y en reposo (HTTPS, cifrado en base de datos) — estándar mínimo esperado para datos de salud aunque no haya ley que lo exija todavía.
- [ ] Control de acceso: el enlace de solo lectura para "Familia" (ver [[MVP]]) debe expirar o ser revocable, no un link permanente sin control.
- [ ] Política de retención: definir cuánto tiempo se guarda un historial después de que el cuidador deja de usar la app.

**Responsabilidad de la IA**
- [ ] El cuidador siempre confirma/edita el resultado de la IA antes de guardar — ya está en el diseño del MVP, y es también la defensa legal más fuerte: la decisión final es humana, no automatizada.
- [ ] Guardar la foto original junto al resultado interpretado (trazabilidad: se puede demostrar qué vio la IA y qué confirmó la persona).
- [ ] Registrar (log interno) cuándo un cuidador edita o rechaza un resultado de la IA — útil tanto para mejorar el modelo como para defenderse ante un reclamo.

**Ante fallos o incidentes**
- [ ] Protocolo simple de qué hacer si una alerta falla o los datos se pierden — aunque no haya ley que exija notificar en 72 horas (como sí exige El Salvador), es buena práctica definir un plazo propio y cumplirlo.
- [ ] Límite de responsabilidad claro en los términos de uso: Daury organiza información y apoya la rutina, no sustituye criterio médico ni es un dispositivo de seguridad — esto ya es un principio de diseño del producto (ver [[MVP]]), debe quedar igual de explícito en el texto legal.

**Si el modelo B2B2C con clínicas avanza** (ver [[Monetización]])
- [ ] Definir con claridad quién es responsable de los datos cuando una clínica recomienda o distribuye la app a sus pacientes — la clínica no debería asumir que Daury es su "encargado de tratamiento" sin un acuerdo explícito.
- [ ] Si en el futuro se maneja el caso "1 cuidador : varios pacientes" (organización/institución), cada paciente o su representante legal debe autorizar individualmente — no basta una autorización general de la institución.

## Preguntas abiertas / pendientes de decidir

- ¿Dónde se aloja la base de datos? Si es fuera de Guatemala (ej. AWS en EE. UU.), no hay hoy una ley guatemalteca que regule transferencia internacional de datos — pero si más adelante expanden a El Salvador, ese país sí exige que el país receptor tenga protección equivalente.
- ¿Vale la pena nombrar un responsable informal de privacidad dentro del equipo desde ya, aunque no sea obligatorio legalmente? Da buena señal ante inversionistas o alianzas institucionales.
- Monitorear el avance de la iniciativa de ley en el Congreso de Guatemala — si se aprueba durante el desarrollo del proyecto, cambia de "buena práctica voluntaria" a "requisito legal".

## Related
- [[Pitch y Estrategia]]
- [[Monetización]]
- [[MVP]]
