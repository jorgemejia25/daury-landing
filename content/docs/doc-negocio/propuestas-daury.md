---
title: "Propuestas de Daury"
description: "Propuestas de planes y modelo de negocio con clínicas."
tags: ["propuestas", "clínicas"]
source: "Documentation/Daury_Proposals.docx"
---

> Migrado desde: Documentation/Daury_Proposals.docx. Conserva el contenido original; las cifras y fechas son las de ese documento.

**Propuesta: Daury Professional**

**Precio sugerido: pendiente de evaluar**

**¿A quién está dirigido?**

Médicos independientes, geriatras y profesionales de salud que necesitan dar seguimiento a sus pacientes fuera del consultorio.

**¿Qué problema resuelve?**

Actualmente, los médicos no siempre conocen cómo evoluciona un paciente entre consultas, si está siguiendo su tratamiento o si ha presentado síntomas.

**Daury Professional permitiría consultar esta información sin necesidad de integrarse con los sistemas de las clínicas.**

**Funcionalidades principales**

- **Portal médico:** acceso exclusivo para profesionales de salud.

- **Pacientes vinculados:** hasta 20 pacientes que autoricen compartir su información.

- **Seguimiento de medicamentos:** visualización de dosis registradas, omitidas y pendientes.

- **Evolución del paciente:** historial de síntomas, signos vitales y actividades registradas.

- **Dashboard:** gráficas de adherencia reportada y evolución del tratamiento.

- **Reportes PDF:** generación de resúmenes para las consultas médicas.

- **Alertas informativas:** identificación de patrones de incumplimiento o ausencia de registros.

**¿Cómo funcionaría?**

1.  El paciente utiliza Daury Free o Plus para registrar su tratamiento.

2.  Autoriza compartir su información con un médico.

3.  El médico accede al portal Professional.

4.  Consulta el historial y la evolución registrada entre consultas.

**Diferencia con Business (Actual)**

| **Professional**             | **Business (Actual)**   |
|------------------------------|-------------------------|
| Médicos independientes       | Clínicas y residencias  |
| Seguimiento de pacientes     | Gestión institucional   |
| Un profesional               | Varios profesionales    |
| Dashboard clínico individual | Dashboard institucional |
| $--                         | $116/mes               |

**Ventaja estratégica del plan Professional**

Daury Professional aprovecharía los datos que la aplicación ya registra, agregando principalmente una interfaz de consulta para médicos. Esto permitiría introducir una nueva fuente de ingresos sin desarrollar inicialmente integraciones con sistemas clínicos externos.

**Recomendación de Chatsito**

Lanzar Free y Plus como productos principales, validar Professional con médicos y mantener Business como una expansión institucional.

El primer MVP de Professional sería de solo lectura, con vinculación de pacientes, consulta de historial y reportes PDF. Las funciones avanzadas se incorporarían después de validar su demanda.

**Funcionalidades futuras de Daury Professional**

Una vez validada la demanda del plan Daury Professional, se podrán incorporar funcionalidades avanzadas que permitan a los médicos crear, editar y actualizar directamente los tratamientos, recetas e indicaciones de sus pacientes, facilitando el seguimiento médico sin depender de modificaciones manuales por parte del cuidador.

Para garantizar la seguridad e integridad de la información, se implementará un sistema de roles y permisos con alcances de acceso (scopes), de manera que cada profesional pueda modificar únicamente las indicaciones que haya emitido o sobre las que tenga autorización explícita.

Por ejemplo, si un paciente es atendido por varios especialistas, un médico no podrá modificar ni eliminar los medicamentos recetados por otro. Sin embargo, podrá consultar la información autorizada para mantener una visión integral del tratamiento.

Adicionalmente, se contemplan dos funcionalidades:

- **Validación de cambios por el paciente o cuidador:** cuando un médico actualice un tratamiento, el paciente o su cuidador recibirá una notificación con los cambios realizados y podrá confirmar su recepción antes de incorporarlos a su rutina, sin que esta confirmación sustituya la autorización médica.

- **Detección de posibles conflictos entre tratamientos:** cuando un profesional agregue o modifique un medicamento, Daury podrá identificar posibles duplicidades o interacciones con otros tratamientos registrados y mostrar advertencias para su revisión por un profesional de salud.

- **Trazabilidad e historial de modificaciones:** cada cambio quedará registrado con la identidad del profesional responsable, fecha, hora, tratamiento anterior y nueva indicación, permitiendo auditar las modificaciones realizadas.

- **Coordinación entre especialistas:** los médicos autorizados podrán consultar los tratamientos prescritos por otros profesionales, evitando modificaciones no autorizadas y facilitando la continuidad del cuidado.

Estas funcionalidades formarían parte de una segunda fase de Daury Professional, sujeta a validación técnica, clínica y legal, manteniendo como prioridad la seguridad del paciente y el control de acceso a su información médica.

**Propuesta: Daury Business**

**Precio sugerido: pendiente de evaluar y validar con instituciones.**

**¿A quién está dirigido?**

Clínicas, centros médicos especializados, residencias geriátricas y organizaciones de cuidado que necesitan dar seguimiento a múltiples pacientes y facilitar la colaboración entre sus profesionales de salud.

**¿Qué problema resuelve?**

Actualmente, muchas instituciones cuentan con sistemas para gestionar consultas, expedientes médicos, personal y procesos administrativos. Sin embargo, estos sistemas no necesariamente permiten conocer cómo evoluciona un paciente fuera de la institución, si está siguiendo correctamente su tratamiento o qué dificultades ha presentado entre consultas.

Daury Business permitiría centralizar el seguimiento de los pacientes de una institución sin necesidad de reemplazar ni integrarse inicialmente con sus sistemas clínicos existentes.

El objetivo no sería administrar la clínica, sino complementar sus herramientas actuales con información sobre la continuidad del cuidado.

**Funcionalidades principales**

- **Portal institucional:** acceso exclusivo para clínicas y organizaciones de salud, con un espacio centralizado para administrar el seguimiento de sus pacientes.

- **Gestión de profesionales:** incorporación de varios médicos y profesionales de salud bajo una misma institución.

- **Pacientes vinculados:** visualización de los pacientes que autoricen compartir su información con la institución o con determinados profesionales.

- **Seguimiento de medicamentos:** consulta de dosis registradas, omitidas, pendientes y adherencia reportada.

- **Evolución del paciente:** historial de síntomas, signos vitales, actividades y observaciones registradas.

- **Dashboard institucional:** indicadores generales de seguimiento, adherencia y actividad de los pacientes vinculados, respetando los permisos de acceso.

- **Dashboard por profesional:** cada médico podrá consultar exclusivamente la información de los pacientes que tenga autorizados.

- **Reportes individuales e institucionales:** generación de reportes PDF para consultas, seguimiento y análisis de información.

- **Alertas informativas:** identificación de patrones de incumplimiento, ausencia de registros o cambios relevantes que requieran revisión.

- **Roles y permisos:** administración de accesos según las responsabilidades de cada profesional dentro de la institución.

**¿Cómo funcionaría?**

1.  Una clínica adquiere una licencia institucional de Daury Business.

2.  La institución registra a sus profesionales de salud y configura sus permisos de acceso.

3.  Los pacientes utilizan Daury Free o Plus para registrar sus tratamientos, medicamentos y actividades.

4.  Cada paciente autoriza compartir su información con los profesionales correspondientes.

5.  Los médicos consultan el historial y la evolución registrada de sus pacientes desde el portal institucional.

6.  La institución puede consultar indicadores generales y reportes de seguimiento, según los permisos y autorizaciones establecidos.

Todo esto funcionaría inicialmente de manera independiente, sin necesidad de conectarse con el sistema administrativo o expediente clínico de la institución.

**Diferencia entre Professional y Business**

| **Professional** | **Business** |
|----|----|
| Médicos independientes | Clínicas y organizaciones de salud |
| Un profesional por suscripción | Varios profesionales por institución |
| Seguimiento individual de pacientes | Seguimiento de pacientes a nivel institucional |
| Dashboard por médico | Dashboard por médico e institucional |
| Gestión de pacientes vinculados | Administración de profesionales y pacientes vinculados |
| Reportes individuales | Reportes individuales e institucionales |
| Permisos de acceso individuales | Roles y permisos institucionales |
| Suscripción individual | Licencia institucional |
| Precio pendiente de evaluar | Precio pendiente de reevaluar |

**Ventaja estratégica del plan Business**

Daury Business aprovecharía las funcionalidades de seguimiento ya desarrolladas para Free, Plus y Professional, incorporando principalmente herramientas de administración institucional, múltiples profesionales, permisos y reportes centralizados.

Esto permitiría ingresar al mercado B2B sin convertir Daury en un sistema de gestión hospitalaria o competir directamente con los programas administrativos que las clínicas ya utilizan.

Su principal diferenciador sería ofrecer visibilidad sobre el seguimiento del paciente fuera de la clínica, facilitando la continuidad de la información entre consultas.

Adicionalmente, las instituciones podrían convertirse en canales de adquisición de nuevos usuarios mediante convenios y beneficios para sus pacientes.

**Recomendación de implementación**

Mantener Business como una expansión institucional, pero redefinirlo como una plataforma de seguimiento y no como un sistema de gestión clínica.

El desarrollo del plan se realizaría progresivamente:

**Primera fase: validación institucional**

Establecer alianzas con clínicas y profesionales de salud para determinar si existe interés real en consultar el seguimiento de los pacientes mediante Daury.

Se buscaría validar la disposición de pago, las funcionalidades más solicitadas y la aceptación de utilizar un portal independiente.

**Segunda fase: MVP de Daury Business**

Una vez validada la demanda, desarrollar una versión institucional que incluya:

- Portal institucional.

- Administración de profesionales.

- Vinculación de pacientes con autorización.

- Roles y permisos.

- Seguimiento de medicamentos e historial.

- Dashboard por profesional e institucional.

- Reportes PDF.

Esta versión sería principalmente de consulta, sin permitir inicialmente la modificación de tratamientos ni requerir integraciones externas.

**Tercera fase: funcionalidades avanzadas**

Incorporar capacidades adicionales según las necesidades identificadas durante los pilotos institucionales.

**Funcionalidades futuras de Daury Business**

Una vez validada la demanda y el uso institucional, se podrán incorporar funcionalidades avanzadas que permitan fortalecer la colaboración entre médicos, pacientes e instituciones.

**1. Gestión de tratamientos por profesionales autorizados**

Los médicos podrán crear, editar y actualizar directamente los tratamientos e indicaciones de sus pacientes.

Se implementará un sistema de roles y permisos con alcances de acceso (scopes), donde cada profesional podrá modificar únicamente las indicaciones de las que sea responsable o sobre las que tenga autorización explícita.

Por ejemplo, si un paciente es atendido por un cardiólogo y un neurólogo, ambos podrán consultar los tratamientos autorizados, pero ninguno podrá modificar las prescripciones del otro sin los permisos correspondientes.

**2. Validación de cambios por el paciente o cuidador**

Cuando un profesional actualice un tratamiento, el paciente o su cuidador recibirá una notificación con los cambios realizados y podrá confirmar su recepción antes de incorporarlos a su rutina.

Esta confirmación no sustituirá la indicación ni la autorización médica.

**3. Detección de posibles conflictos entre tratamientos**

Daury podrá identificar posibles duplicidades, interacciones o contraindicaciones entre medicamentos registrados por diferentes profesionales y generar advertencias para su revisión clínica.

Estas advertencias funcionarían como apoyo informativo y no reemplazarían el criterio médico.

**4. Trazabilidad e historial de modificaciones**

Todas las modificaciones quedarán registradas con la identidad del profesional responsable, fecha, hora, información anterior y nueva indicación.

Esto permitirá mantener un historial verificable de los cambios realizados.

**5. Coordinación entre profesionales**

Los médicos autorizados podrán consultar los tratamientos y registros relevantes de otros especialistas, facilitando una visión más completa del seguimiento del paciente sin comprometer la responsabilidad individual de cada profesional.

**6. Integración con sistemas clínicos existentes**

En una etapa posterior, se podrá evaluar la integración mediante APIs y estándares de interoperabilidad como HIPAA o HL7 FHIR.

Esto permitiría intercambiar información autorizada entre Daury y los sistemas clínicos compatibles, evitando duplicidad de registros y facilitando la continuidad de la información.

Estas integraciones serían opcionales y dependerían de las capacidades técnicas de cada institución, así como de los acuerdos de seguridad y tratamiento de datos correspondientes.

**7. Análisis institucional avanzado**

Las instituciones podrían consultar estadísticas agregadas sobre adherencia reportada, continuidad del seguimiento, pacientes sin registros recientes y evolución de los indicadores disponibles.

Esto permitiría identificar oportunidades de mejora en los programas de seguimiento, sin utilizar la información como diagnóstico automático ni como garantía de resultados clínicos.

**Consideraciones de seguridad**

Por manejar información de salud, Daury Business deberá contemplar:

- Consentimiento explícito y revocable para compartir información.

- Verificación de identidad de los profesionales.

- Roles y permisos diferenciados por institución, profesional y paciente.

- Separación de información entre instituciones.

- Cifrado y registro de accesos.

- Auditoría de modificaciones.

- Validación clínica y legal antes de incorporar funciones de prescripción o detección de interacciones.

**Conclusión plan Business**

Daury Business no buscaría reemplazar los sistemas que las clínicas ya utilizan, sino complementarlos mediante el seguimiento del paciente fuera del consultorio**.**

Su valor estaría en permitir que varios profesionales de una institución consulten, de forma autorizada y centralizada, la evolución registrada de sus pacientes entre consultas.

La estrategia recomendada es lanzar inicialmente Free y Plus, validar Professional con médicos independientes y utilizar esos resultados para determinar la viabilidad de Business.

De esta manera, Daury podría ampliar progresivamente su presencia en el mercado B2B, reutilizando las funcionalidades existentes y evitando inversiones prematuras en sistemas administrativos e integraciones complejas.

**Modelo de negocio y alianzas institucionales**

Como parte de la estrategia de crecimiento y sostenibilidad financiera de Daury, se propone implementar un modelo comercial B2B (Business to Business) y B2B2C (Business to Business to Consumer), mediante el establecimiento de alianzas estratégicas con clínicas, consultorios médicos, centros especializados, residencias geriátricas y otras instituciones de salud.

El objetivo de este modelo es desarrollar dos oportunidades comerciales complementarias: ofrecer herramientas de seguimiento a instituciones de salud y facilitar que más pacientes accedan a Daury mediante convenios institucionales.

A diferencia de un sistema de gestión hospitalaria, Daury no pretende reemplazar las plataformas que las instituciones utilizan para administrar expedientes clínicos, empleados, facturación o procesos internos. Su propuesta consiste en complementar estos sistemas mediante el seguimiento de los tratamientos y la evolución reportada por los pacientes fuera del entorno clínico.

Para lograrlo, se plantean tres modalidades comerciales que pueden implementarse de manera independiente o combinarse según las necesidades de cada institución.

**1. Licencia institucional (B2B)**

Esta modalidad está dirigida a instituciones que desean incorporar Daury como una herramienta de seguimiento para sus profesionales de salud.

La clínica contrataría una suscripción institucional de Daury Business, mediante la cual tendría acceso a un portal centralizado para consultar el seguimiento de los pacientes que hayan autorizado compartir su información.

**¿Cómo funcionaría?**

1.  La clínica contrata una licencia de Daury Business.

2.  Se habilita un espacio institucional donde puede registrar a sus profesionales de salud.

3.  Cada profesional dispone de una cuenta con permisos de acceso específicos.

4.  Los pacientes vinculan sus cuentas de Daury con los médicos correspondientes, mediante autorización.

5.  Los profesionales consultan los tratamientos registrados, la adherencia reportada, los síntomas y la evolución de los pacientes entre consultas.

6.  La institución puede visualizar indicadores generales y generar reportes, respetando los permisos y autorizaciones establecidos.

**Modelo de ingresos**

La institución pagaría una suscripción mensual o anual, cuyo precio podría determinarse considerando:

- Número de profesionales habilitados.

- Cantidad de pacientes activos vinculados.

- Funcionalidades institucionales contratadas.

- Necesidades de soporte y configuración.

- Volumen de registros y servicios utilizados.

Se podría establecer una tarifa base que incluya una cantidad determinada de profesionales y pacientes, con cargos adicionales por capacidad extra.

**Beneficios para las instituciones**

- Acceso organizado al seguimiento de pacientes entre consultas.

- Mayor disponibilidad de información sobre tratamientos y síntomas reportados.

- Consulta centralizada para varios profesionales.

- Generación de reportes que apoyen la preparación de consultas.

- Complemento a sus sistemas clínicos existentes, sin necesidad de sustituirlos.

**Beneficios para Daury**

- Ingresos recurrentes mediante contratos institucionales.

- Mayor ingreso potencial por cliente en comparación con una suscripción individual.

- Posibilidad de establecer relaciones comerciales de largo plazo.

- Crecimiento mediante instituciones que atienden múltiples pacientes.

Esta modalidad se considera la principal propuesta comercial de Daury Business, aunque su precio y demanda deberán validarse mediante pilotos institucionales.

**2. Suscripciones patrocinadas (B2B2C)**

Esta modalidad busca que las clínicas y organizaciones de salud puedan ofrecer Daury Plus como un beneficio adicional a sus pacientes.

En lugar de que cada paciente pague individualmente su suscripción, la institución adquiere un paquete de licencias a un precio negociado y cubre total o parcialmente su costo.

Esto permitiría que más personas utilicen las funcionalidades de coordinación familiar de Daury, especialmente aquellas que requieren seguimiento prolongado o que tienen dificultades para pagar una suscripción.

**¿Cómo funcionaría?**

1.  Una clínica establece un convenio con Daury para adquirir un paquete de suscripciones Plus.

2.  Daury ofrece una tarifa institucional según la cantidad de licencias contratadas.

3.  La clínica selecciona a los pacientes que podrán recibir el beneficio, bajo criterios previamente definidos.

4.  Los pacientes activan su suscripción Plus mediante un código, enlace o invitación institucional.

5.  Los pacientes utilizan las funcionalidades de Daury Plus sin necesidad de contratar directamente el servicio, o pagando únicamente una parte del costo.

6.  La institución puede renovar, ampliar o finalizar el paquete de licencias según las condiciones del convenio.

**Ejemplo hipotético**

Una clínica especializada en enfermedades crónicas desea ofrecer Daury Plus a 100 pacientes que requieren seguimiento continuo.

El precio regular de Daury Plus es de $7.99 mensuales. Sin embargo, mediante un convenio institucional, Daury podría ofrecer una tarifa negociada de $5.99 por licencia al mes.

| **Concepto**                     | **Valor** |
|----------------------------------|-----------|
| Licencias contratadas            | 100       |
| Precio regular por licencia      | $7.99    |
| Precio institucional propuesto   | $5.99    |
| Ingreso mensual bruto para Daury | $599     |
| Ingreso anual bruto equivalente  | $7,188   |

*Los valores son ilustrativos. No representan precios institucionales aprobados ni ingresos garantizados. El ejemplo supone que las 100 licencias permanecen contratadas durante los 12 meses.*

La clínica podría cubrir la totalidad de este costo o subsidiar únicamente una parte, permitiendo que sus pacientes paguen una tarifa reducida.

**Beneficios para las instituciones**

- Ofrecer servicios adicionales sin desarrollar una aplicación propia.

- Diferenciar su propuesta de atención.

- Facilitar a sus pacientes herramientas de organización y coordinación familiar.

- Promover la continuidad del seguimiento entre consultas.

**Beneficios para los pacientes**

- Acceso gratuito o subsidiado a funcionalidades Premium.

- Herramientas de coordinación con familiares y cuidadores.

- Mayor facilidad para organizar tratamientos, citas y registros.

- Menor barrera económica para utilizar la plataforma.

**Beneficios para Daury**

- Ingresos por volumen mediante una sola relación comercial.

- Adquisición de usuarios con el respaldo de instituciones aliadas.

- Mayor alcance en segmentos que podrían tener dificultades para pagar individualmente.

- Posibilidad de convertir suscripciones patrocinadas en suscripciones individuales cuando finalice el convenio.

Es importante destacar que una clínica no necesitaría contratar Daury Business para adquirir suscripciones patrocinadas. Ambas modalidades serían independientes y podrían complementarse.

Asimismo, el patrocinio no otorgaría automáticamente a la institución acceso a los datos médicos de los pacientes. Este acceso requeriría una autorización específica y revocable.

**3. Alianzas comerciales y descuentos exclusivos (B2B2C)**

Esta modalidad permitiría establecer convenios con instituciones que desean recomendar Daury a sus pacientes, sin necesidad de adquirir licencias institucionales o financiar suscripciones.

Su objetivo principal sería ampliar la base de usuarios, disminuir los costos de adquisición y generar oportunidades de conversión hacia Daury Plus.

Las clínicas funcionarían como aliados estratégicos y canales de distribución de la aplicación.

**¿Cómo funcionaría?**

1.  Daury establece un convenio comercial con una clínica o consultorio.

2.  Se genera un código promocional o enlace exclusivo para los pacientes de la institución.

3.  La clínica recomienda Daury como una herramienta complementaria para organizar el cuidado y los tratamientos.

4.  Los pacientes pueden registrarse gratuitamente y, si lo desean, acceder a Daury Plus mediante el beneficio promocional.

5.  Daury registra las activaciones asociadas al convenio y analiza su conversión hacia planes de pago.

6.  Ambas partes evalúan los resultados para determinar si conviene mantener o ampliar la alianza.

**Ejemplo hipotético**

Una clínica ofrece a sus pacientes un descuento del 25 % en Daury Plus durante los primeros tres meses.

| **Concepto**                  | **Valor**  |
|-------------------------------|------------|
| Precio regular de Plus        | $7.99/mes |
| Descuento promocional         | 25 %       |
| Precio promocional aproximado | $5.99/mes |
| Duración del beneficio        | 3 meses    |
| Precio posterior              | $7.99/mes |

El paciente tendría la oportunidad de conocer las funcionalidades Premium a un precio reducido y decidir si desea mantener la suscripción una vez finalizada la promoción.

El descuento sería financiado por Daury en este ejemplo, por lo que su aplicación dependería del margen disponible y del costo de adquisición de usuarios.

**Beneficios para las instituciones**

- Ofrecer un beneficio adicional a sus pacientes sin realizar una inversión inicial.

- Fortalecer su propuesta de servicios complementarios.

- Recomendar una herramienta de organización del cuidado sin administrar directamente las suscripciones.

**Beneficios para Daury**

- Adquisición de usuarios mediante recomendaciones institucionales.

- Mayor visibilidad y exposición de la aplicación.

- Reducción potencial del costo de adquisición frente a campañas publicitarias tradicionales.

- Incremento potencial de suscripciones Plus.

- Obtención de información comercial sobre conversión y retención de usuarios.

Este modelo no garantiza ingresos inmediatos, ya que dependerá de la cantidad de pacientes que activen el beneficio y posteriormente mantengan una suscripción de pago.

Por esa razón, las alianzas deberían evaluarse utilizando indicadores como registros generados, activaciones, conversiones a Plus, costo de adquisición, retención y margen por suscriptor.

**4. Combinación de modalidades comerciales**

Las tres modalidades no serían excluyentes. Una institución podría contratar más de un servicio dependiendo de sus necesidades y capacidad de inversión.

Por ejemplo, una clínica podría:

- Contratar Daury Business para que sus médicos consulten los registros autorizados de sus pacientes.

- Adquirir un paquete de suscripciones Plus para ofrecerlas gratuitamente a pacientes seleccionados.

- Mantener un código promocional para aquellos pacientes que no estén incluidos en el paquete de licencias patrocinadas.

Esta flexibilidad permitiría ofrecer soluciones comerciales adaptadas a diferentes tipos de instituciones.

| **Modalidad** | **Cliente que paga** | **Principal fuente de valor para Daury** |
|----|----|----|
| Licencia institucional | Clínica o institución | Suscripción recurrente B2B |
| Suscripciones patrocinadas | Clínica, institución o paciente mediante copago | Venta de licencias Plus por volumen |
| Alianzas comerciales | Paciente que contrata Plus | Adquisición y conversión de usuarios |

También sería posible ofrecer convenios combinados con descuentos por volumen, siempre que las condiciones permitan mantener márgenes rentables.

**5. Estrategia de implementación y validación**

Debido a que Daury se encuentra en una etapa de validación comercial, se recomienda implementar este modelo de manera progresiva, evitando comprometer recursos en funcionalidades institucionales cuya demanda todavía no se ha confirmado.

**Fase 1. Alianzas de adquisición**

Establecer convenios piloto con clínicas y consultorios para recomendar Daury Free y ofrecer promociones de Plus.

El objetivo será evaluar la aceptación de los pacientes, las tasas de activación y el porcentaje que decide contratar una suscripción.

**Fase 2. Suscripciones patrocinadas**

Ofrecer paquetes reducidos de licencias Plus a instituciones interesadas en beneficiar a sus pacientes.

Se buscará validar la disposición de pago institucional, los costos por licencia y la posibilidad de establecer contratos recurrentes.

**Fase 3. Pilotos de seguimiento profesional**

Evaluar Daury Professional con médicos independientes y equipos médicos pequeños, utilizando un portal de consulta de información autorizada.

El objetivo será determinar si el seguimiento de pacientes fuera del consultorio genera valor suficiente para justificar una suscripción.

**Fase 4. Daury Business**

Una vez confirmada la demanda institucional, ofrecer licencias para clínicas que necesiten incorporar múltiples profesionales y administrar el seguimiento de pacientes desde una plataforma centralizada.

En esta etapa se definirán los precios según el número de profesionales, pacientes activos, costos de operación y funcionalidades requeridas.

**6. Sostenibilidad financiera del modelo**

La combinación de suscripciones individuales, licencias institucionales y convenios comerciales permitiría diversificar las fuentes de ingresos de Daury.

Sin embargo, cada modalidad deberá analizarse considerando tanto los ingresos generados como los costos asociados.

Entre los principales factores financieros se encuentran:

- Infraestructura en la nube y almacenamiento de información.

- Procesamiento de recetas mediante inteligencia artificial.

- Notificaciones y servicios externos.

- Comisiones por procesamiento de pagos y distribución.

- Soporte técnico a usuarios e instituciones.

- Costos de adquisición y mantenimiento de clientes.

- Descuentos, subsidios y condiciones comerciales negociadas.

Para determinar la rentabilidad de cada convenio se deberá calcular su margen de contribución, considerando los ingresos netos menos los costos variables y los gastos directamente atribuibles a su operación.

Adicionalmente, las proyecciones deberán distinguir entre usuarios gratuitos, suscriptores Plus, suscripciones patrocinadas, profesionales independientes e instituciones Business, evitando contabilizar dos veces los ingresos o usuarios vinculados a una misma alianza.

**7. Consideraciones de privacidad y responsabilidad**

Los convenios comerciales no deberán comprometer la confidencialidad de la información médica ni condicionar la atención clínica al uso de Daury.

La contratación de una licencia institucional, el patrocinio de una suscripción o la aplicación de un descuento no otorgarán por sí mismos acceso a los registros del paciente.

Se deberá implementar un mecanismo de consentimiento explícito, específico y revocable, junto con controles de acceso que limiten la información disponible para cada profesional e institución.

Los contratos también deberán definir las responsabilidades de Daury y de la institución respecto al uso de la plataforma, la protección de los datos, el soporte y las condiciones comerciales. Estas disposiciones estarán sujetas a revisión legal y clínica antes de su implementación.

**Conclusión**

El modelo B2B y B2B2C permitiría ampliar las oportunidades comerciales de Daury sin depender exclusivamente de las suscripciones individuales ni
