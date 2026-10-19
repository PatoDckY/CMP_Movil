# Contratos CMP_Site verificados

Inspección de código mediante GitHub, rama main, el 2026-10-17. No se hicieron llamadas a endpoints reales ni operaciones de base de datos. Una lectura del repositorio no certifica qué commit está desplegado en Vercel.

## Operaciones disponibles

| Módulo | Método y ruta (prefijo /api) | Contrato observado |
|---|---|---|
| Login | POST /auth/mobile/login | correo/contrasena; tokens Bearer, usuario o MFA; inactivos 403, bloqueo 423 |
| Sesión | GET /auth/check-session | auth() admite Bearer; ok/usuario; inválida 401 |
| Refresh | POST /auth/mobile/refresh | refreshToken; accessToken nuevo; rechazo definitivo invalida sesión |
| Logout | POST /auth/mobile/logout | Bearer, sin cuerpo; incrementa versión de tokens; no solo un borrado local |
| Registro | POST /auth/send-otp y POST /auth/register | Contratos móviles existentes; confirmación por correo; sin prueba real autorizada |
| Recuperación | POST /auth/password-reset/request | correo; respuesta genérica; entrega del correo y confirmación web pendientes de prueba real |
| Catálogo | GET /cursos y GET /cursos/{id} | Array y detalle CourseDto; consumo público |
| Reservas | GET/POST /compras-cursos | listado compras y creación compra/participantes; estado pendiente de pago |
| Detalle compra | GET /compras-cursos/{id} | detalle, pagos, métodos y resumen; pertenencia comprobada por servidor |
| Métodos | GET /metodos-pago-cursos | metodos |
| Reporte | POST /compras-cursos/{id}/pagos | campos del comprobante; registrar reporte no valida automáticamente pago |
| Inscripciones | GET /cliente/mis-cursos | resumen/cursos, progreso y asistencia |
| Detalle académico | GET /cliente/mis-cursos/{id} | success/curso; filtra ID y usuario/participante autorizado, 404 al no encontrar inscripción autorizada |
| Perfil | GET/PUT /profile | profile; rectifica nombre, apellidos, edad, sexo y teléfono; no correo, rol ni identificador |
| A17 | DELETE /account | Bearer de cliente, exactamente contrasena (1–200 caracteres) y confirmacion:true; 202 |

## A17: semántica y errores

La respuesta 202 contiene message, solicitudId positivo, estado pendiente o respondida y eliminacionCompletada:false.
Una solicitud móvil abierta existente también devuelve 202 con su folio y mensaje; NO es 409 y no expone un campo yaExistia.
No se convierte una solicitud web de baja lógica en una solicitud móvil de eliminación.

400: campos inválidos; 401: autenticación; 403: rol o contraseña incorrecta; 404: cuenta no disponible;
423: bloqueo temporal; 500: no pudo confirmarse la operación.
Una contraseña incorrecta puede escribir contadores de seguridad. Toda la validación realizada aquí usa mocks.

El móvil exige explícitamente HTTP 202 y valida la estructura antes de mostrar el folio.
Las credenciales solo se mantienen en memoria durante el envío; el campo se limpia al iniciar.
Tras error/timeout no se afirma que el servidor rechazó la operación: la entrega puede haber sido aceptada.
El reintento requiere volver a ingresar contraseña; el servidor reutiliza una solicitud móvil abierta.
La sesión NO se cierra al aceptar una solicitud.

## Contratos sin verificar / bloqueos

- Cambio de contraseña autenticado: búsqueda por contrasenaActual no produjo coincidencias; no hay ruta verificada. La ruta tentativa auth/change-password no existe en la lectura realizada. Se requiere especificar método, body, reautenticación y efecto sobre tokens.
- Reset por correo sí tiene flujo web y /auth/password-reset/confirm. No equivale a cambio autenticado: requiere el token del correo. El móvil conserva la solicitud de recuperación existente.
- Notificaciones: hay tablas y gestión administrativa, pero no se identificó endpoint móvil para listar, contar ni marcar leído. Se requiere filtro por destinatario, paginación, IDs, estado y contrato de actualización.
- Lecciones/módulos: búsqueda sin contrato verificable. La API disponible maneja inscripciones, sesiones, asistencia y progreso académico calculado en backend. Se requieren contratos de contenido autorizado, completar lección y reanudar antes de implementar esas operaciones.
- Documentos oficiales: routes.ts y Footer web referencian /privacidad y /terminos, pero no se verificaron páginas en src/app ni src/app/(public). No se crean enlaces a destinos sin verificar ni textos jurídicos inventados. La información móvil sigue marcada provisional.
- Registro de consentimiento versionado: el body actual de registro no acredita ID/versión de aviso ni fecha de aceptación. No se agrega un campo no soportado.

## Evidencia de archivos leídos

Los valores siguientes son SHA de blobs leídos, no hashes de despliegue.

| Archivo CMP_Site | SHA de evidencia |
|---|---|
| [`src/app/api/account/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/account/route.ts) | `ef75750cb5ca23f5f44e04f62294b0aa15fb0fbd` |
| [`src/app/api/profile/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/profile/route.ts) | `f541fd64a46860195cad7aa46290e57e420e8754` |
| [`src/app/api/cursos/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/cursos/route.ts) | `380fb06d30e3c4830f673a6a7b9622a3f46c922b` |
| [`src/app/api/cursos/[id]/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/cursos/%5Bid%5D/route.ts) | `8562083be433f549ec8e3cfca9c3bceb1b4aafa7` |
| [`src/app/api/compras-cursos/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/compras-cursos/route.ts) | `07123279eb5136418998c38d63941c1e14a5359d` |
| [`src/app/api/compras-cursos/[id]/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/compras-cursos/%5Bid%5D/route.ts) | `e73aa2352da8544ba4706381cb97cc43f613826b` |
| [`src/app/api/compras-cursos/[id]/pagos/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/compras-cursos/%5Bid%5D/pagos/route.ts) | `a7bb1983a7ac3c854d33ed2ca63e22089ba07b6b` |
| [`src/app/api/metodos-pago-cursos/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/metodos-pago-cursos/route.ts) | `13fcc8d855996e63a4cd102d77a0a0b202f920dc` |
| [`src/app/api/cliente/mis-cursos/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/cliente/mis-cursos/route.ts) | `5cb0a78f3ccba7b11157b332a944461807e63fba` |
| [`src/app/api/cliente/mis-cursos/[id]/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/cliente/mis-cursos/%5Bid%5D/route.ts) | `c36e6392403e5804b393dafaf096e71a848689d0` |
| [`src/app/api/auth/mobile/login/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/auth/mobile/login/route.ts) | `b90c22d1c34e23aaa173901a35087bffb1b78238` |
| [`src/app/api/auth/mobile/refresh/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/auth/mobile/refresh/route.ts) | `ea15e480ddf4ebdea2568ae9031aac1d0b3fbc0b` |
| [`src/app/api/auth/check-session/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/auth/check-session/route.ts) | `2a9c0011b57babd358432acd54036c963bc0f391` |
| [`src/app/api/auth/register/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/auth/register/route.ts) | `0ae5a2343c22b71f0854ee32dec8c6ff65ba724b` |
| [`src/app/api/auth/password-reset/request/route.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/app/api/auth/password-reset/request/route.ts) | `f107aaf1be69d55cf4d69b2f830ccdd68493f8ae` |

También se verificó POST /auth/mobile/logout en una lectura anterior de esta sesión: blob b040f187d230569240bd09a13dd3c122c032d482.

## Validaciones contrastadas durante la revisión integral

Lectura adicional de [`src/lib/validators/compras-cursos.ts`](https://github.com/CentroMedicoPichardo/CMP_Site/blob/main/src/lib/validators/compras-cursos.ts), blob `bde479a8445f94d2d9a74d6e5b322983e7eab14a`. El contrato admite hasta 20 participantes, ID existente o participante nuevo excluyentes, nombres hasta 100 caracteres, correo hasta 150, teléfono hasta 20 y opcionales nulos (incluido sexo); fecha válida no futura y observaciones hasta 1000. `src/models/purchaseValidation.ts` reúne las reglas móviles compartidas. El teléfono de participante no se restringe artificialmente a diez dígitos; el registro de usuario conserva su contrato propio. Esta lectura no ejecutó compras ni pagos.
