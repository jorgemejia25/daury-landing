# Flujo de la encuesta

Este documento describe las preguntas, opciones, campos internos y saltos condicionales de la encuesta de cuidado en casa.

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

## Regla de lenguaje

Después de P1, la encuesta adapta el texto según el tipo de cuidado:

- Si `careTarget = personal`, las preguntas hablan de `tu cuidado` o `cuidarte`.
- Si `careTarget = third_party`, las preguntas hablan de `su cuidado` o `cuidarlo/a`.

Ejemplos:

- Personal: `¿Cómo administraste tu cuidado?`
- Tercero: `¿Cómo administraste su cuidado?`

## Pantalla inicial

Antes de las preguntas se muestra un saludo:

```txt
Hola, gracias por ayudarnos.
```

Mensaje:

```txt
Queremos saber cómo llevaste el cuidado de una persona: puede haber sido tu cuidado personal, en casa, en un consultorio o dentro de una institución.
```

El usuario presiona `Empezar` y pasa a P0.

## Filtro inicial

### P0. Experiencia administrando cuidado

Pregunta visible:

```txt
¿Has administrado el cuidado de una persona?
```

Contexto:

```txt
Medicamentos, citas médicas, rutinas diarias. Recordá que tu propio cuidado también cuenta.
```

Campo interno:

```txt
hasManagedCare
```

Opciones:

- `yes`: Sí
- `no`: No

Saltos:

- `yes`: continúa a P1.
- `no`: agradece y finaliza sin enviar una respuesta a Convex.

## Bloque 1: Situación actual

### P1. Tipo de cuidado

Campo interno:

```txt
careTarget
```

Opciones:

- `personal`: Es mi cuidado personal
- `third_party`: Cuidé a otra persona

Regla:

- Siempre pasa a P1.1.
- Si responde `personal`, se omite P2.
- Si responde `third_party`, se muestra P2.

### P1.1. Edad aproximada

Campo interno:

```txt
caredPersonAge
```

Texto:

- Personal: `¿Qué edad aproximada tenías durante ese cuidado?`
- Tercero: `¿Qué edad aproximada tenía la persona cuidada?`

Opciones:

- `under_18`: Menos de 18
- `18_40`: 18 a 40
- `41_60`: 41 a 60
- `61_plus`: 61 o más

### P2. Familiares involucrados

Solo si `careTarget = third_party`.

Campo interno:

```txt
familyCaregivers
```

Opciones:

- `only_me`: Solo yo
- `2_3`: 2 a 3 personas
- `4_plus`: 4 personas o más

### P3. Frecuencia de coordinación

Campo interno:

```txt
coordinationFrequency
```

Opciones:

- `daily`: A diario
- `several_times_week`: Varias veces por semana
- `weekly`: Una vez por semana
- `occasional`: De forma ocasional

### P4. Organización del cuidado

Campo interno:

```txt
organizationMethod
```

Texto:

- Personal: `¿Cómo administraste tu cuidado?`
- Tercero: `¿Cómo administraste su cuidado?`

Opciones:

- `paper`: Papel/agenda física
- `whatsapp`: Grupo de WhatsApp familiar
- `memory`: Memoria (nada por escrito)
- `app`: Ya uso una app
- `other`: Otro

Reglas:

- Si elige `app`, se muestra P4.1.
- Si elige `other`, se muestra el campo abierto obligatorio `organizationOther`.

### P4.1. App usada

Solo si `organizationMethod = app`.

Campo interno:

```txt
organizationAppName
```

Tipo: abierta corta obligatoria.

### P5. Mayor reto

Campo interno:

```txt
careChallenges
```

Tipo: selección múltiple.

Opciones:

- `medication_schedules`: Recordar horarios de medicamentos
- `medical_appointments`: Coordinar citas médicas
- `doctor_instructions`: Entender las instrucciones del médico
- `family_sharing`: Compartir información con otros familiares que también cuidan
- `lack_of_time`: Falta de tiempo
- `care_costs`: Costos del cuidado
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra P5.1.

### P5.1. Uso previo de apps

Solo si `careChallenges` incluye `other`.

Campo interno:

```txt
priorCareAppUse
```

Opciones:

- `yes`: Sí
- `no`: No

Saltos:

- `yes`: muestra P5.1.1.
- `no`: continúa a P6.

### P5.1.1. App previa

Solo si `priorCareAppUse = yes`.

Campo interno:

```txt
priorCareAppName
```

Tipo: abierta corta obligatoria.

### P6. Incidentes por falta de organización

Campo interno:

```txt
hadIncident
```

Opciones:

- `yes`: Sí
- `no`: No

Saltos:

- `yes`: muestra P6.1.
- `no`: continúa a P7.

### P6.1. Historia del incidente

Campo interno:

```txt
incidentStory
```

Tipo: abierta opcional.

## Bloque 2: Comportamiento de gasto

### P7. Pago actual relacionado al cuidado

Campo interno:

```txt
currentlyPaysCare
```

Opciones:

- `yes`: Sí
- `no`: No

Saltos:

- `yes`: muestra P7.1.
- `no`: continúa a P8.

### P7.1. Detalle del pago actual

Campo interno:

```txt
paidCareDetails
```

Tipo: abierta corta obligatoria.

### P8. Quién cubriría un costo mensual

Campo interno:

```txt
carePayer
```

Opciones:

- `myself`: Yo mismo/a
- `family_guatemala`: Otro familiar en Guatemala
- `family_abroad`: Familiar en el extranjero
- `shared`: Se dividiría entre varios
- `not_sure`: No sabría decir

## Bloque 3: Confianza

### P9. Confianza en una app

Campo interno:

```txt
appTrust
```

Opciones:

- `yes`: Sí
- `no`: No
- `maybe`: Tal vez

Saltos:

- `yes`: salta a P11.
- `no`: muestra P10.
- `maybe`: muestra P10.

### P10. Razones para no confiar

Solo si `appTrust = no` o `appTrust = maybe`.

Campo interno:

```txt
trustConcerns
```

Tipo: selección múltiple.

Opciones:

- `traditional_preference`: Prefiero el papel/lo tradicional
- `medical_data_privacy`: Me preocupa la privacidad de los datos médicos
- `offline_reliability`: No confío en que funcione sin internet
- `internet_stability`: No tengo/no confío en tener internet estable
- `delicate_information`: Es información muy delicada para depender de una app
- `constant_use`: No sé si la usaría de forma constante
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra `trustConcernsOther`.

## Bloque 4: Producto y diferenciador competitivo

### P11. Interés en usar una app

Campo interno:

```txt
appInterest
```

Texto:

- Personal: `¿Te habría gustado usar una app que te ayudara a gestionar tu cuidado?`
- Tercero: `¿Te habría gustado usar una app que te ayudara a gestionar su cuidado?`

Opciones:

- `yes`: Sí
- `no`: No
- `maybe`: Tal vez

Saltos:

- `yes`: salta a P13.
- `no`: muestra P12 y P12.1.
- `maybe`: muestra P12 y P12.1.

### P12. Qué tendría que ofrecer para decir sí

Solo si `appInterest = no` o `appInterest = maybe`.

Campo interno:

```txt
interestRequirements
```

Tipo: selección múltiple.

Opciones:

- `offline`: Que funcione sin necesidad de internet
- `privacy_guarantees`: Garantías claras de privacidad de los datos médicos
- `family_onboarding`: Que alguien de la familia me ayude a usarla al inicio
- `known_reference`: Verla funcionando con alguien que conozco (referencia o testimonio)
- `low_cost`: Que fuera gratis o muy económica al inicio
- `easy_to_use`: Que sea fácil de usar
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra `interestRequirementOther`.

### P12.1. Comentario adicional

Solo si `appInterest = no` o `appInterest = maybe`.

Campo interno:

```txt
interestNoReason
```

Tipo: abierta opcional.

### P13. WhatsApp vs app aparte

Campo interno:

```txt
whatsappPreference
```

Opciones:

- `yes`: Sí
- `no`: No
- `prefer_app`: Prefiero una app aparte

### P14. Función indispensable

Campo interno:

```txt
essentialFeatures
```

Tipo: selección múltiple.

Opciones:

- `medication_reminders`: Recordatorios de medicamentos
- `medical_calendar`: Calendario de citas médicas
- `prescription_history`: Registro/historial de recetas
- `scan_prescriptions`: Escanear recetas con la cámara
- `family_sharing`: Compartir información con otros familiares
- `emergency_contacts`: Contactos de emergencia
- `doctor_reports`: Reportes para el médico
- `other`: Otro

Regla:

- Debe elegir al menos una opción.
- Si elige `other`, se muestra `essentialFeaturesOther`.

### P15. Cómo se enteraría

Campo interno:

```txt
discoveryChannel
```

Opciones:

- `social_media`: Redes sociales
- `doctor_clinic`: Recomendación del médico o clínica
- `family_friend`: Recomendación de un familiar o amigo
- `pharmacy`: Farmacia
- `other`: Otro

Regla:

- Si elige `other`, se muestra `discoveryOther`.

## Bloque 5: Precio Van Westendorp

Este bloque solo aparece si `appInterest = yes`.

Los campos de precio:

- Aceptan solo números enteros.
- Se presentan con prefijo `Q`.
- Usan teclado numérico en móvil.
- Se guardan internamente en centavos.

### P16. Duración de la condición

Campo interno:

```txt
conditionDuration
```

Opciones:

- `temporary`: Temporal
- `long_term`: Largo plazo / crónico
- `not_sure`: No estoy seguro/a

### P17. Demasiado cara

Campo interno:

```txt
priceTooExpensive
```

### P18. Cara pero pagable

Campo interno:

```txt
priceExpensiveButPay
```

### P19. Muy accesible

Campo interno:

```txt
priceBargain
```

### P20. Demasiado barata

Campo interno:

```txt
priceTooCheap
```

## Bloque 6: Cierre

### P21. Experiencia adicional

Campo interno:

```txt
closingExperience
```

Tipo: abierta opcional.

Texto:

- Personal: `¿Hay algo de tu experiencia cuidándote que no cubrimos en esta encuesta y creas que deberíamos saber?`
- Tercero: `¿Hay algo de tu experiencia cuidando a alguien que no cubrimos en esta encuesta y creas que deberíamos saber?`
