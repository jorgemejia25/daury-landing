---
title: "Stack tecnológico"
description: "Tecnologías de la app móvil, el backend y la infraestructura."
tags: ["stack"]
source: "daury/STACK.md"
---

> Migrado desde: daury/STACK.md. Conserva el contenido original; las cifras y fechas son las de ese documento.

## Overview

Daury es una plataforma orientada al apoyo cognitivo y la gestión de rutinas para usuarios con dificultades de memoria o aprendizaje, así como sus cuidadores.

El stack está diseñado bajo los siguientes principios:

- simplicidad y claridad arquitectónica
- tipado fuerte
- control explícito sobre la lógica y los datos
- escalabilidad progresiva
- separación estricta de responsabilidades

---

# Frontend (FE)

## Tecnología principal

- Kotlin Multiplatform (KMP)

## Enfoque

Se utiliza Kotlin Multiplatform para compartir la lógica de negocio entre plataformas, manteniendo flexibilidad en la capa de presentación.

### Código compartido

- modelos de dominio
- casos de uso
- estado de la aplicación
- lógica de sincronización
- capa de red

### UI

- inicialmente nativa por plataforma (Android / iOS)
- evaluación posterior de Compose Multiplatform para pantallas no críticas

## Arquitectura

Se adopta una arquitectura tipo Clean Architecture o MVVM.

### Capas

- `presentation`: UI y estado observable
- `domain`: reglas de negocio y casos de uso
- `data`: repositorios y fuentes de datos
- `network`: clientes HTTP y serialización

## Comunicación con backend

- REST como protocolo principal

---

# Backend (BE)

## Lenguaje

- Go

## Frameworks

- Echo: servidor HTTP y routing
- Fx (Uber): dependency injection y lifecycle management

---

## Arquitectura

### Estilo

- Modular Monolith

### Flujo de ejecución

HTTP Request → Echo Handler → Service (Use Case) → Repository → Database

### Capas

- `transport` (Echo handlers)
- `application` (casos de uso)
- `domain` (entidades y reglas)
- `infrastructure` (DB, cache, storage, servicios externos)

---

## Organización de módulos

El sistema se divide en módulos de dominio independientes:

- `auth` — autenticación: login, logout, refresh de tokens, validación de sesión
- `users` — cuenta y credenciales: email, contraseña, estado de la cuenta, plan
- `profiles` — perfil cognitivo: nombre, avatar, preferencias de accesibilidad, nivel de dificultad. Un cuidador puede gestionar múltiples perfiles independientes
- `caregivers` — relación entre cuidador y perfiles gestionados, permisos de acceso
- `routines` — definición y configuración de rutinas diarias
- `reminders` — recordatorios asociados a rutinas o eventos puntuales
- `activities` — actividades individuales dentro de una rutina
- `progress` — registro histórico de completitud y evolución
- `notifications` — envío y estado de notificaciones push/email
- `uploads` — gestión de archivos adjuntos: imágenes, audios
- `insights` — agregaciones y métricas de uso para cuidadores y usuarios

Cada módulo contiene:

- handlers
- servicios (use cases)
- repositorios
- definiciones de dominio

---

## Base de datos

### Tecnología

- PostgreSQL

### Acceso a datos

- pgx (driver de Postgres)
- sqlc (generación de código tipado desde SQL)

### Enfoque

- SQL como fuente de verdad
- queries explícitas
- tipado generado automáticamente
- repositorios como capa de acceso

### Estructura

- queries definidas en archivos `.sql`
- código generado por sqlc
- capa de repositorio para adaptación al dominio

---

## Transacciones

- manejo explícito mediante pgx
- funciones de alto nivel para ejecución transaccional
- consistencia en operaciones compuestas

---

## Cache y almacenamiento

- Redis (opcional):
  - cache
  - rate limiting
  - jobs livianos

- Object Storage (S3 compatible):
  - imágenes
  - audios
  - archivos adjuntos

---

## Autenticación

- JWT o tokens de sesión
- middleware de autenticación en Echo
- flujo nativo de registro por email y contraseña
- confirmación de cuenta por correo
- reenvío de confirmación y recuperación de acceso
- login con sesión inicializada y validación del subject verificado
- refresh y logout de sesión con invalidación de tokens
- resolución de identidad actual y acceso por bearer token

### Alcance del flujo implementado

La capa de autenticación cubre el ciclo completo de acceso del usuario en Daury:

- Registro con email y contraseña.
- Confirmación del registro y reenvío del correo de verificación.
- Login seguro con validación del proveedor y creación de la sesión autenticada.
- Recuperación de cuenta mediante token de confirmación.
- Refresh de token para sesiones vigentes.
- Logout con revocación del refresh token y cierre de sesión.
- Inicialización de sesión autenticada con bearer token.
- Resolución de la identidad del usuario actual usando claims verificados OIDC/JWT.

Este contrato ya está documentado en `backend/api/openapi.yaml` y debe mantenerse alineado con cualquier implementación posterior del backend.

---

## Observabilidad

- logging estructurado
- métricas (Prometheus u otro)
- tracing (OpenTelemetry)

---

## Jobs y tareas en segundo plano

- `go-co-op/gocron` v2 como scheduler interno
  - soporte de expresiones cron y duraciones
  - distributed locking via Redis para evitar ejecuciones duplicadas en múltiples instancias
  - hooks de ciclo de vida por job (on start, on complete, on error)
  - context support para cancelación y timeouts
- workers para:
  - recordatorios
  - notificaciones
  - procesamiento diferido

---

## API

### REST (principal)

Usado para:

- autenticación
- gestión de usuarios
- perfiles
- rutinas
- recordatorios
- operaciones transaccionales

---

# Principios clave

- evitar abstracciones innecesarias
- mantener separación clara entre capas
- no acoplar dominio a frameworks
- preferir explicitud sobre magia
- diseñar para evolución incremental
