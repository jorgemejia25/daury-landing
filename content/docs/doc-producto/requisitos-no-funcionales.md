---
title: "Requisitos no funcionales"
description: "Rendimiento, seguridad, accesibilidad y otros requisitos no funcionales."
tags: ["requisitos"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

| ID | Categoría | Requerimiento | Criterio verificable |
|---|---|---|---|
| NFR-01 | Seguridad | El sistema debe proteger el acceso a la información mediante autenticación de usuarios. | No se debe permitir acceso a datos privados sin sesión válida. |
| NFR-02 | Privacidad | El sistema debe limitar la exposición de datos sensibles al mínimo necesario. | Los datos médicos y personales solo deben mostrarse a usuarios autorizados. |
| NFR-03 | Disponibilidad offline | El sistema debe seguir funcionando con conectividad intermitente o sin conexión. | Las funciones locales deben permanecer accesibles sin red. |
| NFR-04 | Sincronización | El sistema debe resolver y sincronizar cambios pendientes cuando vuelva la conexión. | Los cambios locales deben sincronizarse sin intervención manual. |
| NFR-05 | Rendimiento | El sistema debe responder de forma ágil en operaciones frecuentes. | Las vistas principales deben cargar en 2 segundos o menos en condiciones normales de uso. |
| NFR-06 | Usabilidad | El sistema debe ser fácil de usar para cuidadores con distintos niveles de experiencia digital. | Las tareas principales deben completarse en flujos de pocos pasos y con etiquetas claras. |
| NFR-07 | Accesibilidad | El sistema debe ofrecer soporte para voz y texto grande. | El usuario debe poder activar opciones de accesibilidad durante el onboarding. |
| NFR-08 | Confiabilidad | El sistema debe preservar la integridad de los datos ante fallos de red o cierre inesperado. | No se deben perder cambios confirmados por el usuario. |
| NFR-09 | Trazabilidad | El sistema debe registrar eventos relevantes del cuidado y de las alertas. | Debe ser posible consultar el historial de acciones y registros. |
| NFR-10 | Escalabilidad | El sistema debe soportar crecimiento en número de usuarios y miembros por círculo de cuidado. | El sistema debe mantener un desempeño estable al aumentar el volumen de miembros, actividades y registros. |
| NFR-11 | Mantenibilidad | El sistema debe permitir evolucionar reglas de recordatorios, alertas y sincronización sin rehacer el producto completo. | Los módulos clave deben estar desacoplados y ser modificables por separado. |
| NFR-12 | Compatibilidad | El sistema debe funcionar en los entornos objetivo definidos por el producto. | Las pantallas y flujos deben comportarse de forma consistente en los dispositivos soportados y en distintos tamaños de pantalla. |
