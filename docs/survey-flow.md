# Flujo de la encuesta

Este documento describe las preguntas, opciones y saltos condicionales de la encuesta de cuidado en casa.

La encuesta vive en:

```txt
/:locale/encuesta
```

Ejemplos:

```txt
/es/encuesta
/en/encuesta
```

También existe:

```txt
/encuesta
```

Esa ruta redirige al idioma detectado.

## Pantalla inicial

Antes de las preguntas se muestra un saludo:

```txt
Hola, gracias por ayudarnos.
```

Mensaje:

```txt
Queremos conocer tu experiencia y tus opiniones sobre cómo se vive el cuidado en casa. Tus respuestas nos ayudan a diseñar algo más claro, útil y realista para las familias.
```

El usuario presiona `Empezar` y pasa a la primera pregunta.

## Preguntas y opciones

### P3. Organización actual

Pregunta visible:

```txt
¿Cómo organizas actualmente su cuidado?
```

Campo interno:

```txt
organizationMethod
```

Opciones:

- `paper`: Papel/agenda física
- `whatsapp`: Grupo de WhatsApp familiar
- `memory`: Memoria (nada por escrito)
- `app`: Ya uso una app
- `other`: Otro

Regla:

- Si elige `other`, se muestra un campo abierto obligatorio: `organizationOther`.
- Luego pasa a P4.

### P4. Mayor reto

Pregunta visible:

```txt
¿Cuál es tu mayor reto al cuidarlo/a?
```

Campo interno:

```txt
careChallenges
```

Tipo:

```txt
Opción múltiple, máximo 2.
```

Opciones:

- `medication_schedules`: Recordar horarios de medicamentos
- `medical_appointments`: Coordinar citas médicas
- `family_sharing`: Compartir información con otros familiares que también cuidan
- `lack_of_time`: Falta de tiempo
- `care_costs`: Costos del cuidado
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra un campo abierto obligatorio: `careChallengesOther`.
- Luego pasa a P5.

### P5. Incidentes por falta de organización

Pregunta visible:

```txt
¿Has tenido algún incidente por falta de organización?
```

Campo interno:

```txt
hadIncident
```

Opciones:

- `yes`: Sí
- `no`: No

Saltos:

- Si responde `yes`, pasa a P5.1.
- Si responde `no`, salta a P6.

### P5.1. Historia del incidente

Pregunta visible:

```txt
Cuéntanos brevemente qué pasó.
```

Campo interno:

```txt
incidentStory
```

Tipo:

```txt
Abierta, opcional.
```

Regla:

- Luego pasa a P6.

### P6. Confianza en una app

Pregunta visible:

```txt
¿Confiarías en una aplicación para llevar el control del cuidado de tu familiar?
```

Contexto visible:

```txt
Medicamentos, citas, contactos de emergencia.
```

Campo interno:

```txt
appTrust
```

Opciones:

- `yes`: Sí
- `no`: No
- `maybe`: Tal vez

Saltos:

- Si responde `yes`, salta a P8.
- Si responde `no`, pasa a P7.
- Si responde `maybe`, pasa a P7.

### P7. Razones para no confiar del todo

Pregunta visible:

```txt
¿Por qué no confiarías del todo?
```

Campo interno:

```txt
trustConcerns
```

Tipo:

```txt
Opción múltiple.
```

Opciones:

- `traditional_preference`: Prefiero el papel/lo tradicional
- `medical_data_privacy`: Me preocupa la privacidad de los datos médicos
- `offline_reliability`: No confío en que funcione sin internet
- `delicate_information`: Es información muy delicada para depender de una app
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra un campo abierto obligatorio: `trustConcernsOther`.
- Luego pasa a P8.

### P8. Interés en usar la app

Pregunta visible:

```txt
¿Te gustaría usar una app que te ayude a gestionar esto?
```

Campo interno:

```txt
appInterest
```

Opciones:

- `yes`: Sí
- `no`: No
- `maybe`: Tal vez

Saltos:

- Si responde `yes`, pasa a P9.
- Si responde `maybe`, pasa a P9.
- Si responde `no`, pasa a P8.1 y termina después de esa respuesta.

### P8.1. Razón para no usarla

Pregunta visible:

```txt
¿Por qué no?
```

Campo interno:

```txt
interestNoReason
```

Tipo:

```txt
Abierta corta, obligatoria.
```

Regla:

- Después de responder, se envía la encuesta.
- No se muestran P9 ni precios.

### P9. Función indispensable

Pregunta visible:

```txt
¿Qué función te parece indispensable?
```

Campo interno:

```txt
essentialFeatures
```

Tipo:

```txt
Opción múltiple, máximo 3.
```

Opciones:

- `medication_reminders`: Recordatorios de medicamentos
- `medical_calendar`: Calendario de citas médicas
- `prescription_history`: Registro/historial de recetas
- `family_sharing`: Compartir información con otros familiares
- `emergency_contacts`: Contactos de emergencia
- `doctor_reports`: Reportes para el médico
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra un campo abierto obligatorio: `essentialFeaturesOther`.
- Luego pasa a P10.

## Precio Van Westendorp

Estas preguntas solo aparecen si P8 fue `yes` o `maybe`.

Los campos de precio:

- Aceptan solo números enteros.
- Se presentan con prefijo `Q`.
- Usan teclado numérico en móvil.
- Se guardan internamente en centavos.

Ejemplo:

```txt
Usuario escribe: 25
Base de datos guarda: 2500
Moneda: GTQ
```

### P10. Demasiado cara

Pregunta visible:

```txt
¿Desde qué precio mensual te parecería demasiado cara?
```

Campo interno:

```txt
priceTooExpensive
```

Regla:

- Número entero obligatorio.
- Luego pasa a P11.

### P11. Cara pero pagable

Pregunta visible:

```txt
¿Desde qué precio mensual dirías que es cara, pero aún la pagarías si te convence?
```

Campo interno:

```txt
priceExpensiveButPay
```

Regla:

- Número entero obligatorio.
- Luego pasa a P12.

### P12. Muy accesible

Pregunta visible:

```txt
¿Desde qué precio mensual dirías que es muy accesible?
```

Campo interno:

```txt
priceBargain
```

Regla:

- Número entero obligatorio.
- Luego pasa a P13.

### P13. Demasiado barata

Pregunta visible:

```txt
¿Desde qué precio mensual dudarías de la calidad por ser demasiado barata?
```

Campo interno:

```txt
priceTooCheap
```

Regla:

- Número entero obligatorio.
- Después de responder, se envía la encuesta.
