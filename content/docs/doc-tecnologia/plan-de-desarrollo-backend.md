---
title: "Plan de desarrollo del backend"
description: "Plan detallado de desarrollo del backend."
tags: ["backend"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

## Dirección arquitectónica

Daury se construye como un monolito modular en Go 1.25 con dos binarios (`api` y `worker`), PostgreSQL como fuente de verdad y `care_space_id` como frontera de autorización. La sincronización es offline-first, los hechos clínicos son append-only y cualquier extracción OCR o salida de IA permanece como borrador hasta confirmación humana explícita.

El trabajo se divide por **módulo + slice horizontal**. Esta unidad reemplaza el modelo anterior de slices verticales. Un PR ordinario modifica un solo módulo y un solo slice; una inicialización que recorra varios slices debe estar autorizada explícitamente y conservar un único módulo.

## Slices horizontales H0-H6

| Slice | Propósito | Artefactos típicos | Criterio de salida |
|---|---|---|---|
| **H0 — Contrato** | Fijar la interfaz observable antes de la implementación | OpenAPI/eventos, formatos, errores, comandos, esquema SQL esperado | Contrato revisable, compatible y con ejemplos sintéticos |
| **H1 — Dominio** | Modelar reglas e invariantes sin infraestructura | Entidades, value objects, errores, reglas append-only | Reglas puras cubiertas con pruebas unitarias |
| **H2 — Aplicación y puertos** | Orquestar casos de uso y declarar dependencias consumidas | Servicios de aplicación, comandos, interfaces, límites transaccionales | Flujos y fallos de puertos probados sin adaptadores reales |
| **H3 — Persistencia** | Implementar almacenamiento autoritativo | Migraciones, sqlc, repositorios pgx, constraints | Migración limpia y repositorios verificados en PostgreSQL real |
| **H4 — Entrada HTTP** | Traducir HTTP al contrato de aplicación | Echo, validación, middleware, mapeo de errores | Contrato HTTP y fallos probados de extremo a handler |
| **H5 — Integraciones** | Conectar fronteras externas o asíncronas | Workers, colas, ficheros, push, OCR, adaptadores locales | Contratos, timeout, reintento e idempotencia demostrados |
| **H6 — Hardening** | Preparar operación y cambio seguro | Lifecycle, observabilidad, privacidad, seguridad, carga, CI | Gate de calidad, shutdown y riesgos operativos verificados |

La dirección de dependencias es estable: H4 y H5 llaman H2; H2 coordina H1 mediante puertos; H3 implementa puertos de H2. Las interfaces se declaran donde se consumen. `internal/platform` contiene infraestructura transversal concreta y no lógica de negocio. Ningún módulo importa internals de otro módulo.

## Orden de módulos

El orden previsto evita construir integraciones antes de sus contratos y reglas:

1. `platform`: configuración, logging, PostgreSQL, lifecycle, HTTP base y CI.
2. `identity`: verificación OIDC/JWT e identidad local por `sub`.
3. `care`: espacios, miembros, roles y frontera `care_space_id`.
4. `audit`: evidencia confiable de accesos y acciones sensibles.
5. `activities`: actividades y eventos append-only.
6. `sync`: idempotencia, `change_log`, cursores, tombstones y conflictos.
7. `medical`: medicación manual, pautas y hechos clínicos.
8. `media`: metadatos y ciclo de vida de ficheros.
9. `extraction`: trabajos y borradores OCR con confirmación humana.
10. `notifications`: recordatorios y entrega push.
11. `sharing`: enlaces mínimos, caducables y revocables.
12. `reports`: generación asíncrona de informes.
13. `insights`: agregados y alertas explicables, nunca diagnósticos.

El orden puede cambiar mediante una decisión explícita, pero no se crean módulos vacíos por adelantado.

## Contrato de cada ticket y PR

Antes de editar, el plan debe declarar:

- módulo y slice;
- dependencias ya disponibles;
- rutas permitidas y rutas excluidas;
- FR, NFR, caso de uso, ADR, contrato o SLO trazado;
- contratos HTTP/evento/datos afectados;
- migración, autorización, privacidad, idempotencia y observabilidad aplicables;
- pruebas mínimas y escenario observable;
- criterio de salida.

Si una transacción o contrato cruza módulos, el plan identifica al dueño y divide el trabajo. Los cambios de migraciones y permisos IAM requieren revisión humana adicional.

## Desarrollo local sin dependencia de AWS

El ciclo diario no depende de una cuenta, credenciales ni servicios AWS reales. La API y el worker se ejecutan como procesos Go; Docker Compose inicia solo las dependencias necesarias. Cada proveedor se esconde detrás de un puerto pequeño y ofrece un adaptador local determinista. Los tests locales usan exclusivamente datos sintéticos.

Perfiles Docker futuros:

| Perfil | Dependencias locales | Cuándo se incorpora |
|---|---|---|
| `core` | PostgreSQL 17 | Desde `platform` H3 |
| `identity` | Cognito Local de terceros para email nativo | Durante el desarrollo del adapter Cognito sin cuenta AWS |
| `identity-oidc` | Keycloak | Solo para futuros experimentos de OIDC alojado y proveedores sociales |
| `media` | MinIO | Al implementar ficheros |
| `async` | ElasticMQ | Al implementar outbox/consumidores |
| `providers` | WireMock y fake push | Al integrar OCR, enlaces externos o notificaciones |
| `observability` | Stack local de métricas, trazas y logs | En H6 de los módulos que lo necesiten |
| `aws-compat` | LocalStack | Solo para compatibilidad con APIs AWS |

LocalStack no sustituye pruebas de negocio ni forma parte del perfil base. AWS real queda fuera del ciclo diario y se usa únicamente como **gate de compatibilidad antes de producción**, con datos sintéticos, permisos mínimos y aprobación humana. Redis no se incorpora hasta que exista un caso medido y nunca participa en la corrección.

El emulador Cognito local no es un producto AWS ni una prueba de paridad total. Su función es ejercitar registro, confirmación, login por email, recuperación, refresh, revocación y validación JWKS mediante el mismo puerto de aplicación y el mismo AWS SDK usados por el adapter real. Antes de producción se ejecutan pruebas de contrato contra un user pool AWS desechable; Google y Apple conservan el flujo de navegador del proveedor y no reutilizan los endpoints de contraseña.

## Contrato de comandos locales

El backend expone una interfaz estable mediante `backend/Makefile`:

```bash
make bootstrap
make dev-up
make dev-down
make migrate-up
make migrate-down
make generate
make run-api
make run-worker
make test-unit
make test-integration
make test
make lint
make vuln
make build
make check
```

`make check` cubre formato, `go vet`, lint, pruebas, race detector, vulnerabilidades, ambos binarios y generación reproducible. Los comandos destructivos de datos no forman parte del gate.

## Ciclo de trabajo

1. `$daury-plan` define módulo, slice, contratos, rutas, riesgos y salida.
2. Antes de editar Go se ejecuta `$use-modern-go` para el archivo o Go 1.25 y se aplica la lista completa.
3. Se implementa únicamente el corte autorizado.
4. `$daury-test` selecciona pruebas por H0-H6 y ejecuta primero la frontera más pequeña.
5. `make check` valida el repositorio; los cambios SQL también prueban migración y generación reproducible.
6. `$daury-review` revisa diff, alcance, dirección de dependencias e invariantes sin corregir por defecto.
7. Una persona revisa migraciones, IAM, decisiones legales/producto y aceptación antes de mezclar o desplegar.

## Invariantes permanentes

- No se usan datos reales de salud, tokens, secretos ni payloads de producción en prompts, fixtures, logs o snapshots.
- Toda operación tenant-aware exige `care_space_id`; conocer un identificador no concede acceso y los recursos ajenos responden 404.
- PostgreSQL es autoritativo. Redis es opcional y desechable.
- Las escrituras reintentables son idempotentes; misma clave con distinto cuerpo falla.
- Offline usa UUID v7 del cliente, `occurred_at` separado de `recorded_at`, cursores monótonos, tombstones y conflictos visibles.
- Los hechos clínicos son append-only; una corrección referencia el evento anterior.
- Outbox y cambio de dominio se confirman en la misma transacción cuando existe publicación asíncrona.
- OCR e IA solo producen borradores; ninguna confianza, reintento o timeout evita la confirmación humana.
- El worker reutiliza servicios de aplicación y no llama la API de Daury para persistir resultados.
