---
title: "Pitch y estrategia"
description: "Notas sobre el mensaje del pitch y la estrategia."
tags: ["pitch", "estrategia"]
source: "Notas del proyecto"
---

> Migrado desde: Notas del proyecto. Conserva el contenido original; las cifras y fechas son las de ese documento.

## Cómo vendes Daury?

**En una frase**: Daury convierte una instrucción médica o una rutina de cuidado en algo que un cuidador puede seguir sin tener que leer, y que avisa cuando algo se sale de lo normal.

**¿Qué problema resuelve?**
La transición de la consulta/hospital a la casa es donde se pierde continuidad: instrucciones verbales, papeles sueltos, nadie sabe con certeza qué se hizo y qué falta. En Guatemala esto se agrava porque 1.8 millones de personas mayores de 15 años no saben leer ni escribir, y en algunas áreas rurales el analfabetismo llega hasta 75% — ese es, estadísticamente, el perfil más probable de un cuidador familiar en el país. No es una barrera de accesibilidad opcional, es el escenario por defecto.

**¿Por qué Daury es para todos?**
Porque está diseñado desde el caso más exigente hacia abajo, no al revés: ícono antes que palabra, audio en cada pantalla, caras en vez de texto para el ánimo/dolor, una sola instrucción a la vez. Si funciona para alguien que no puede leer, funciona para cualquiera. La mayoría de apps de cuidado hacen el camino inverso (texto primero, accesibilidad como opción en ajustes) y por eso excluyen justo al cuidador que más lo necesita.

**¿Por qué Daury es la solución?**
Porque no le pide al cuidador que aprenda un sistema nuevo. La pieza central —tomar una foto de la indicación del profesional y que la IA la convierta en una tarjeta clara que se puede escuchar— elimina el paso más tedioso (transcribir a mano) sin quitarle al cuidador la decisión final: siempre confirma o corrige antes de guardar. Daury no diagnostica ni prescribe, no reemplaza al profesional ni es un dispositivo de seguridad — organiza lo que ya fue indicado o lo que la familia decide como rutina diaria.

**¿En qué ganamos contra la competencia?**
Ver detalle completo en la sección "Frente a Caring Village" más abajo. Resumen: ellos requieren que toda la familia se una a su plataforma; nosotros llevamos la información a donde la familia ya está (WhatsApp), incluso sin internet estable.

## Mercado objetivo

- Cuidador familiar sin entrenamiento clínico, cuidando a un adulto mayor con deterioro cognitivo o en recuperación física.
- Perfil por defecto: baja o nula alfabetización, conectividad limitada, zona rural o semi-urbana de Guatemala — no la excepción, el diseño parte de ahí.
- Canal de distribución más lógico a validar: profesionales de salud (geriatras, fisioterapeutas, neurólogos) que recomiendan la app a las familias al momento del alta o durante el tratamiento — ver [[Monetización]] para el modelo B2B2C relacionado.
- Fuera del mercado objetivo por ahora: cuidado pediátrico, salud mental/psiquiátrica, oncológico y paliativo — excluidos a propósito para mantener el producto enfocado.

## Qué problema se resuelve

- Los cuidadores apuntan en WhatsApp, notas sueltas o cuadernos la información de la persona a la que cuidan, o deben organizar y recordar recetas médicas e instrucciones por su cuenta, de memoria.
- Daury centraliza esa información de forma seguible y consultable — no como un diario pasivo, sino como una rutina activa que se ejecuta día a día, se registra, y avisa cuando hay un patrón de riesgo (ej. confusión repetida, dolor alto varios días seguidos, actividades omitidas).

## Frente a Caring Village (competencia directa más relevante)

Caring Village es un producto maduro de EE. UU. con modelo "village": múltiples cuidadores, permisos por rol, asistente de IA conversacional (Julia), coordinación familiar en tiempo real. No tiene sentido competir en cantidad de funciones — ahí pierden por volumen y madurez. La estrategia es competir en el problema que ese modelo no resuelve:

- **Ellos dependen de que todos se unan a la plataforma.** Ese modelo asume conectividad estable y comodidad tecnológica en toda la familia — exactamente lo que no se puede asumir en el contexto objetivo de Daury.
- **Nosotros llevamos la información a donde la familia ya está.** Enlace de solo lectura por WhatsApp para familiares, sin necesidad de cuenta ni de instalar nada. Modo offline para el cuidador principal.
- **Accesibilidad como núcleo, no como feature.** Nada en Caring Village sugiere diseño para baja alfabetización; todo su lenguaje asume un cuidador cómodo leyendo texto en una app compleja.
- **La IA resuelve un paso de trabajo, no reemplaza una conversación.** Julia es un chatbot de preguntas generales. La IA de Daury convierte una foto de instrucción real en una rutina estructurada — más fácil de demostrar en vivo, más difícil de descartar como "otro chatbot".

**Frase para el pitch**: *"Ellos necesitan que toda la familia esté dentro de su plataforma. Nosotros llevamos la información a donde la familia ya está, incluso sin internet."*

## Guion sugerido para la demo (según el prototipo actual)

1. Tomar foto de una receta real (ej. Paracetamol) → mostrar cómo la IA arma la tarjeta → confirmar escuchándola, no solo leyéndola.
2. Crear una actividad de vida diaria con plantilla (sin IA) — mostrar que no todo depende de una foto.
3. Ver ambas actividades en "Hoy", completarlas, hacer el registro con caras + nota de voz.
4. Ir a "Semana" y mostrar el patrón detectado (ej. confusión 2 días seguidos) con el banner de alerta y su botón de audio.
5. (Bonus, si el tiempo alcanza) "Alexa, ¿qué sigue?" respondiendo en vivo — mencionarlo como extra, no como pieza central.
6. Cerrar con la comparación directa frente a Caring Village y la frase clave de arriba.

## UI/UX

- Si es para todos, debe ser amigable, entendible y simple — no como principio decorativo, sino como criterio de diseño verificable en cada pantalla: ¿se entiende sin leer una sola palabra? Ver principios completos en [[MVP]].

## Related

- [[MVP]]
- [[Seguridad y Legal]]
- [[Monetización]]
- [[Roadmap y Equipo]]
