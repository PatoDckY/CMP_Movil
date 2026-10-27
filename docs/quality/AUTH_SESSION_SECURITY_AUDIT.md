# Auditoría de autenticación, sesión y seguridad — CMP_Movil (#94)

Fecha: 2026-10-26. Código móvil auditado: `develop` en `5504682`. Backend leído (solo lectura, copia local de `CMP_Site` en `1b3571b`). Es una auditoría de código con evidencia reutilizada; no se ejecutó ninguna prueba nueva contra producción.

Evidencia reutilizada:

- **#92** — [`INTEGRATION_TESTS_POSTMAN.md`](INTEGRATION_TESTS_POSTMAN.md): corrida real del 2026-10-26 contra producción (30 solicitudes, 69 aserciones, 0 fallos), carpetas 2, 5 y 6.
- **#98** — [`PRIVACY_DATA_AUDIT.md`](PRIVACY_DATA_AUDIT.md): almacenamiento y logs.
- **#129** — [`JADX_OBFUSCATION_REPORT.md`](JADX_OBFUSCATION_REPORT.md): binario release.
- **#90** — [`INTEGRATION_AUDIT.md`](INTEGRATION_AUDIT.md): navegación y cambio de cuenta.
- Pruebas Jest existentes (41 suites / 443 pruebas en verde tras este cambio), en particular `__tests__/session/logout.test.tsx`, `AuthRepositoryImpl.test.ts`, `httpClient.test.ts` y `AuthConcurrency.test.tsx`.

## Resumen

| # | Criterio | Resultado |
|---|---|---|
| 1 | Inicio y cierre de sesión | **Cumple** |
| 2 | Persistencia y expiración de sesión | **Cumple** |
| 3 | Rutas protegidas requieren sesión válida | **Cumple** |
| 4 | Autorización de recursos restringidos (UI) | **Cumple** |
| 5 | Aislamiento entre usuarios | **Cumple** en lo cubierto por #92; brecha menor documentada |
| 6 | Almacenamiento seguro | **Cumple** |
| 7 | Variables sensibles no expuestas | **Cumple**, con una observación de baja severidad |
| 8 | Errores de autenticación no revelan información | **No cumple del lado backend** (enumeración de cuentas); sin defecto en el móvil |
| 9 | Hallazgos críticos atendidos | **Cumple**: sin hallazgos críticos; 1 corregido, 2 pendientes de tu decisión |

## 1. Inicio y cierre de sesión

- **Login**: `AuthRepositoryImpl.login` normaliza el correo, llama a `POST /auth/mobile/login` y solo después guarda los tokens con `tokenStorage.saveTokens`, que relee el Keychain y confirma que lo guardado coincide. Si la confirmación falla, retira las credenciales y bloquea la sesión (`persistTokens`).
- **Logout**: `SessionContext.logout` cierra la sesión local primero (usuario en `null`, el árbol de navegación se desmonta) y luego `AuthRepositoryImpl.performLogout` llama a `tokenStorage.clearTokensForLogout`. Este invoca `Keychain.resetGenericPassword` y **vuelve a leer** el Keychain: si el borrado no devuelve éxito o aún hay credenciales, lanza error. No se limpia solo el estado de React. Después se revoca el token en el servidor con el Bearer capturado.
- **Revocación en el servidor**: en la corrida real de #92, carpeta 6, `POST /auth/mobile/logout` respondió 200 para A y B, y el token de A ya revocado dio 401 en `check-session`.
- **Pruebas**: `logout.test.tsx` cubre el borrado antes de revocar, que no se restaure al reiniciar, y carreras con refresh, login y lecturas pendientes del Keychain.

## 2. Persistencia y expiración de sesión

- **Dónde vive el JWT**: solo en Keychain (`react-native-keychain` 10.0.0, servicio `cmp_mobile_auth`), serializado en un único registro `{accessToken, refreshToken}`. No hay `AsyncStorage` ni MMKV en `src/` (también confirmado en #98). En Android la librería usa por defecto cifrado AES-GCM con clave del Android Keystore (`KeystoreAESGCM_NoAuth`).
- **Refresh en 401** (`httpClient.ts`): ante un 401 en una ruta que no sea login ni refresh, hace un único refresh compartido (`refreshPromise`) y reintenta la petición original una vez. El refresh y el reintento se descartan si la versión de sesión cambió (`assertCurrentSession`).
- **Refresh token inválido o expirado**: `performRefresh` borra las credenciales cuando el servidor responde 401 o 403; `sessionEvents.invalidate()` lleva a la pantalla pública. Un fallo de red no borra el refresh token. Evidencia real en #92, carpeta 6: refresh con token inválido → 401, token basura → 401, JWT con `exp=1` → 401.
- **Arranque**: `restoreSession` valida con `GET /auth/check-session`; un fallo transitorio no cierra la sesión, un 401 sí.

## 3. Rutas protegidas requieren sesión válida

- `RootNavigator` renderiza `AuthenticatedNavigator` únicamente si `user !== null`; en cualquier otro caso `PublicNavigator`. Mientras restaura la sesión muestra un indicador de carga, sin navegador.
- `PublicNavigator` solo registra Home, Catalog, CourseDetail, Login, PasswordRecovery, Register y LegalInformation (datos públicos). Todo lo de cuenta, compras, Mis cursos y notificaciones solo existe en `AuthenticatedNavigator`.
- Un 401 con credenciales ya renovadas borra el Keychain y emite `sessionEvents`, lo que desmonta el navegador autenticado.
- Del lado API, #92 (carpeta 6): `/cliente/mis-cursos`, `/cliente/mis-cursos/{id}/materiales` y `/auth/check-session` responden 401 sin token, con token basura y con JWT expirado.

## 4. Autorización de recursos restringidos (UI)

No se encontró una ventana en la que la UI muestre datos de otro usuario antes del rechazo del backend:

- Los navegadores se remontan con `key={user?.id}` (`RootNavigator`), así que los view models de una cuenta no sobreviven al cambio de cuenta ni al cierre de sesión (ver #90). No hay cachés ni variables de módulo con datos de usuario en `src/`.
- Los datos se piden por pantalla y se guardan solo en el estado del view model; las rutas del cliente no aceptan identificadores de usuario, el servidor deriva el usuario del Bearer.
- Materiales de Drive (`useCourseMaterialsViewModel`): consulta al servidor en cada pulsación, no guarda la URL en estado ni en almacenamiento, exige que curso e inscripción devueltos coincidan con los pedidos, descarta respuestas de una sesión o cuenta anterior (`scope.version()`) y ante 401/403/404 muestra un mensaje de falta de autorización sin datos.
- Mientras `isRestoring`, no se pinta contenido de cuenta.

## 5. Aislamiento entre usuarios

- Cubierto con evidencia real en #92 (carpeta 5): B no ve la inscripción de A en su lista; detalle y materiales de A con token de B → 404 sin filtrar el enlace de Drive; A conserva su inscripción tras usar B. Las comprobaciones sobre compras de A (`/compras-cursos/{id}`) quedaron omitidas en esa corrida junto con la carpeta 3.
- No se repitió. **Brecha menor**: perfil, notificaciones (incluido `PATCH …/leida` de una notificación ajena) y detalle de compra no tienen prueba real de aislamiento. `BACKEND_CONTRACTS.md` documenta que el servidor las limita al usuario del Bearer (404 si la notificación no es propia). Probarlo en vivo requiere escribir o crear una compra en producción; no se hizo sin autorización.

## 6. Almacenamiento seguro

| Dato | Dónde vive |
|---|---|
| Access y refresh token | Keychain (Android Keystore) |
| Contraseñas (login, registro, cambio, baja) | Solo memoria del formulario durante el envío; la de baja se limpia al iniciar (`useAccountDeletionViewModel`) |
| Perfil, compras, cursos, notificaciones | Solo memoria (estado de view models) |
| `AsyncStorage` / MMKV / archivos | Ninguno |
| Logs | `console.*` en `src/`: cero (#98). Ver hallazgo H3 sobre `App.tsx` |
| Copias de seguridad | `android:allowBackup="false"` |

## 7. Variables sensibles no expuestas

Revisión del código fuente (no solo del binario):

- `src/`, `App.tsx`, `index.js`: sin API keys, tokens, contraseñas ni URLs de administración. La única URL de backend es `https://cmp-site.vercel.app/api` (`apiConfig.ts`). Los hashes de certificate pinning (`sslPinning.ts`) son claves públicas.
- `PAYMENT_WHATSAPP` (`PurchaseDetailScreen.tsx`) es un número comercial de contacto de pagos, dato público, no un secreto.
- Firma de release: `android/app/build.gradle` lee almacén, alias y contraseñas de variables de entorno/propiedades, no hay valores fijos (solo `debug.keystore` estándar de React Native con `android`). `.gitignore` excluye `*.jks`, `*.keystore` (salvo el de debug), `.env*`, `keystore.properties` y similares; `git ls-files` no lista ningún material de firma ni `.env`.
- Binario release: sin hallazgos sensibles en #129 (ProGuard activo: `enableProguardInReleaseBuilds = true`).
- Observación: `INTEGRATION_TESTS_POSTMAN.md` (#92) publica, por decisión del equipo, la contraseña de las cuentas de prueba en un repositorio público (ver H6).

## 8. Errores de autenticación no revelan información sensible

Mensajes que ve el usuario (el móvil muestra tal cual el `message` del backend para respuestas no 5xx; los 5xx se sustituyen por un texto genérico y los fallos de red por un mensaje en español, sin trazas):

| Flujo | Mensaje y evaluación |
|---|---|
| Login, correo inexistente | `Credenciales incorrectas` (401) |
| Login, correo existente con contraseña errónea | `Credenciales incorrectas. Te quedan N intentos` (401) — **distinto del anterior: revela que la cuenta existe** |
| Login, cuenta desactivada | `Usuario desactivado. Contacta al administrador` (403), devuelto **antes** de validar la contraseña — revela una cuenta existente y desactivada sin credenciales |
| Login, cuenta bloqueada | `Cuenta bloqueada. Intenta nuevamente en N minutos` (423), también antes de validar la contraseña |
| Registro, `send-otp` con correo existente | `El correo ya está registrado` (409) — enumeración inherente al registro con OTP. Verificado en producción en #92 con la cuenta A |
| Recuperación de contraseña | Respuesta genérica; sin enumeración |
| 5xx | El cliente HTTP lo reemplaza por un mensaje genérico; no se exponen detalles internos |

Ningún mensaje incluye trazas ni detalles técnicos. Las filtraciones son del **contrato del backend**: el móvil solo las muestra, así que enmascararlas en la app no las elimina (quien enumere cuentas llama a la API directamente). Por eso no se tocó el contrato ni el texto del móvil.

## 9. Hallazgos y severidad

| ID | Hallazgo | Severidad | Dónde | Estado |
|---|---|---|---|---|
| H1 | Enumeración de cuentas en el login: mensaje distinto con/sin cuenta (`Te quedan N intentos`), y 403 `desactivado` y 423 `bloqueada` antes de validar la contraseña | **Media** | Backend (`auth/mobile/login`) | **Pendiente de tu decisión**: unificar el mensaje de credenciales incorrectas y devolver desactivada/bloqueada solo tras validar la contraseña. No se tocó |
| H2 | `send-otp` revela si un correo ya está registrado (409) | **Baja** (típico del registro con OTP) | Backend (`auth/send-otp`) | **Pendiente de tu decisión**: mitigable con límite de intentos por IP/correo; cambiar el mensaje afectaría la experiencia de registro |
| H3 | `console.error` con el objeto de error cuando falla el certificate pinning, en `App.tsx` (fuera de `src/`, por eso #98 reportó cero ocurrencias) | **Baja** | Móvil | **Corregido**: se quitó el log; la pantalla de bloqueo ya informa el fallo. Pruebas, `tsc` y ESLint en verde |
| H4 | Tokens guardados sin opciones explícitas de Keychain (`accessible`/nivel de seguridad); el valor por defecto es seguro en Android (AES-GCM con Keystore), sin exigir biometría | **Informativa** | Móvil | Sin acción; se podría fijar explícitamente si se publica en iOS |
| H5 | Pines de certificado fijos en el código (dos hashes públicos); al rotar el certificado de Vercel sin actualizar los pines la app queda bloqueada (falla cerrada, no insegura) | **Informativa** | Móvil | Sin acción; operar la rotación con una versión previa |
| H6 | Contraseña de las cuentas de prueba publicada en `INTEGRATION_TESTS_POSTMAN.md` en un repositorio público; son cuentas ficticias en producción, A con acceso al material de Drive del curso 2502 | **Baja** | Documentación | Aceptado por el equipo; rotar si cambia el riesgo |
| H7 | Aislamiento sin prueba real en perfil, notificaciones y detalle de compra | **Baja** | Pruebas | Pendiente: exige escrituras en producción o un entorno aislado |

Sin hallazgos críticos ni altos. H1 es el único de severidad media y es del backend; no se corrigió ni se reabrió #104. Se recomienda un issue nuevo en CMP_Site para H1 (y H2 como mejora).

## Cambios incluidos en este PR

- `App.tsx`: se elimina el `console.error` del fallo de certificate pinning (H3).
- Este documento.
