# Firebase de Daury Wiki

## Configuración actual

- Proyecto activo: **Daury Wiki**, ID `daury-wiki-jorgemejia`.
- Cuenta de la CLI: `devjorgemejia@gmail.com`; alias `default` en `.firebaserc`.
- Aplicación web registrada: `1:79942836231:web:ac730dd4f2d50099d58aa2`.
- Firestore `(default)`, Standard Native, `us-central1`, plan Spark.
- Authentication: únicamente Google habilitado. Correo/contraseña y acceso anónimo deshabilitados.
- Dominios autorizados: `localhost`, `127.0.0.1` y los dos dominios Firebase del proyecto.
- Las seis variables públicas del SDK están en `.env.local`, excluido de Git; la plantilla está en `.env.example`.
- No se creó una cuenta de servicio ni se copiaron credenciales de la CLI a la aplicación.

El proyecto, la app web y la base ya existen. No es necesario crearlos de nuevo.
La CLI y las API administrativas permiten operar la configuración después del alta.
La activación inicial de Authentication y Google se completó desde la consola;
las reglas de acceso se prueban y despliegan desde la terminal.

## Acceso a la wiki

`/wiki/login` inicia el acceso con Google. El servidor verifica la firma, proyecto,
emisor y vencimiento del ID token con Firebase Admin, además de exigir correo
verificado, proveedor `google.com` y pertenencia exacta a esta lista:

- `valeryalarconra@gmail.com`
- `acariaaas.07@gmail.com`
- `daniel1ajedrez@gmail.com`
- `yury.alexander2005@gmail.com`
- `fatimacerezo2411@gmail.com`
- `devjorgemejia@gmail.com`

No se admiten alias adicionales. La comparación no distingue mayúsculas.
Una identidad Google ajena puede autenticarse ante Firebase, pero no obtiene
sesión de la wiki ni permiso de lectura o escritura en Firestore.
La lista está en `src/features/wiki/lib/access.ts` y `firestore.rules`; una prueba exige
que ambas coincidan. No hay registro abierto, roles ni administración de miembros.

La sesión del servidor usa una cookie de host HttpOnly, SameSite=Lax y Secure
en producción, con duración máxima de una hora y nunca mayor que la del token.
El SDK conserva la identidad en la sesión del navegador y renueva el token mientras
la wiki está abierta. Las Server Actions `createWikiSession` y `deleteWikiSession`
(`src/features/wiki/actions/session.ts`) exigen el mismo origen (comprobación CSRF de Next.js). La salida borra la cookie y cierra Firebase Auth.

Cada página protegida valida su sesión antes de entregar contenido, también en
solicitudes de React Server Components. Los datos de sesión no se almacenan en
una caché compartida. Firebase Admin verifica certificados públicos, sin permisos
administrativos de datos. No consulta revocaciones remotas en cada petición:
un token ya emitido puede seguir siendo válido hasta su vencimiento. Quitar un
correo requiere actualizar y publicar la lista del servidor y desplegar las reglas.
La app rechaza el uso de `FIREBASE_AUTH_EMULATOR_HOST` para evitar aceptar tokens
sin firma por una configuración accidental.

## Permisos de Firestore

Las mismas seis cuentas, con correo verificado y proveedor Google, pueden leer,
crear y editar documentos de `boards`, `tasks`, `calendars`, `events`, `folders`, `wikiPages` y `wikiContent`. El resto de
colecciones y las subcolecciones quedan denegadas. Una cuenta anónima, externa,
no verificada o autenticada con otro proveedor no tiene acceso.

El editor compartido está implementado: artículos en carpetas, varios tableros y
calendarios, tareas y eventos se consultan y guardan en Firebase. La arquitectura,
la migración y las pruebas están en [Espacios de trabajo](wiki-workspace.md).
Los archivos originales se conservan como fuente de migración.

## Comandos habituales

```bash
firebase projects:list
firebase apps:list --project daury-wiki-jorgemejia
firebase firestore:databases:list --project daury-wiki-jorgemejia
npm run check
npm test
npm run test:rules
npm run build
firebase deploy --only firestore:rules --project daury-wiki-jorgemejia
npm run dev -- --port 3100
```

`test:rules` inicia un emulador local en `127.0.0.1:18080` usando el proyecto
ficticio `demo-daury-wiki`, ejecuta las pruebas y lo cierra. Requiere Java 21 y
Firebase CLI. Las pruebas se niegan a ejecutarse contra producción.
Verifican lectura, consultas, creación, actualización y archivado recuperable para las seis
cuentas, así como el rechazo de las identidades y rutas no autorizadas.

Para desplegar la aplicación en otro entorno, configura allí las variables de
`.env.example` y agrega el dominio real en los dominios autorizados de Firebase.
El login local está en `http://localhost:3100/wiki/login`.
La implementación no publica el sitio ni modifica Firebase Hosting.

## Verificación y límites

- `npm run check`, `npm test` (61 pruebas), `npm run test:rules` (18 pruebas) y
  `npm run build`: código 0. Se verifican identidad del creador, conflictos y formularios.
- HTTP local: doce respuestas HTML/RSC de páginas protegidas solicitan login sin
  entregar su contenido; cookies y JWT falsificados rechazados; origen externo rechazado.
- `@grpc/grpc-js` fijado en `1.14.7` para corregir la dependencia transitiva vulnerable
  del SDK Firebase de Node. Auditoría de dependencias de producción: cero hallazgos.

Se comprobaron compilación, tipos, lint, pruebas de sesión y reglas con emulador.
Las reglas fueron desplegadas y la configuración de Google consultada mediante
la API administrativa. El servidor rechaza cookies y JWT falsificados.
La prueba interactiva con una cuenta Google real debe completarse en el navegador;
el acceso automatizado al navegador no estaba disponible en este entorno.

## Referencias

- [Verificar ID tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Acceso con Google](https://firebase.google.com/docs/auth/web/google-signin)
- [Authentication y reglas](https://firebase.google.com/docs/rules/rules-and-auth)
- [Pruebas de reglas](https://firebase.google.com/docs/rules/unit-tests)
