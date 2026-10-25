# Auditoría de permisos, privacidad y tratamiento de datos — CMP_Movil

Fecha: 2026-10-24. Issue: #98 (A66). Código móvil auditado: `develop` en `c9c475f`. Backend leído (solo lectura): `CentroMedicoPichardo/CMP_Site`, rama `main` (`0c94f62`).

Alcance: revisión estática del código fuente móvil y del código de las rutas de API del backend. No se hicieron llamadas a endpoints con datos reales ni pruebas en dispositivo. El bundle compilado se cubrió en `JADX_OBFUSCATION_REPORT.md` (#129).

## 1. Permisos

Cita exacta de `android/app/src/main/AndroidManifest.xml` (único manifest de la app; no hay manifest `debug`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
...
android:allowBackup="false"
android:usesCleartextTraffic="${usesCleartextTraffic}"
```

- La app declara un solo permiso: `INTERNET`, necesario para consumir `cmp-site.vercel.app`.
- No hay cámara, ubicación, contactos, almacenamiento, micrófono ni notificaciones push. No se solicitan permisos en tiempo de ejecución (no hay `PermissionsAndroid` en `src/`).
- `allowBackup="false"`: los datos de la app no se incluyen en copias de seguridad.
- Manifest fusionado del APK release (verificado en el análisis JADX de #129): `usesCleartextTraffic="false"` y, además de `INTERNET`, dos permisos que aportan las librerías: `USE_BIOMETRIC` y `USE_FINGERPRINT` (de `react-native-keychain`/`androidx.biometric`) y un permiso propio de firma `com.cmp_movil.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` (androidx). El código de la app no usa biometría (`accessControl`/`biometr` sin coincidencias en `src/`), por lo que `USE_BIOMETRIC` y `USE_FINGERPRINT` no se ejercen. **Observación**: podrían eliminarse del manifest fusionado con `tools:node="remove"`; no se hizo en este PR (no es un hallazgo de exposición de datos).

## 2. Datos personales por flujo

Todas las llamadas salen por `src/services/http/httpClient.ts` a `https://cmp-site.vercel.app/api` (con certificate pinning). Los payloads se verificaron contra los DTO de `src/services/dto/` y `BACKEND_CONTRACTS.md`.

| Dato (Aviso §2) | Dónde se captura | Endpoint | Campos enviados | Uso documentado |
|---|---|---|---|---|
| Cuenta: nombre, apellidos, edad, sexo, teléfono, correo, contraseña (§2.1) | `RegisterScreen` | `POST /auth/send-otp`, `POST /auth/register` | OTP: `email`, `nombre`. Registro: `nombre`, `apellidoPaterno`, `apellidoMaterno`, `edad`, `sexo`, `telefono`, `correo`, `contrasena`, `codigoVerificacion` | Crear y verificar la cuenta |
| Credenciales | `LoginScreen` | `POST /auth/mobile/login`, `GET /auth/check-session`, `POST /auth/mobile/refresh`, `POST /auth/mobile/logout` | `correo`, `contrasena`; refresh: `refreshToken`; Bearer en el resto | Autenticación y sesión |
| Recuperación | `PasswordRecoveryScreen` | `POST /auth/password-reset/request` | `correo` | Restablecer contraseña |
| Perfil (§2.1, ARCO) | `PersonalDataScreen` | `GET/PUT /profile` | PUT: `nombre`, `apellidoPaterno`, `apellidoMaterno`, `edad`, `sexo`, `telefono` | Acceso y rectificación |
| Cambio de contraseña | `ChangePasswordScreen` | `PUT /profile/password` | `contrasenaActual`, `contrasenaNueva`, `confirmarContrasenaNueva` | Seguridad de la cuenta |
| Solicitud de eliminación (ARCO) | `AccountDeletionScreen` | `DELETE /account` | `contrasena`, `confirmacion: true` | Cancelación/baja |
| Participantes (§2.2) | `CreatePurchaseScreen` | `POST /compras-cursos` | `cursoId`, `cantidadCupos`, `participantes[]` (id existente o `nombre`, `apellidoPaterno`, `apellidoMaterno`, `fechaNacimiento`, `sexo`, `telefono`, `correo`), `observacionesUsuario` | Identificar al participante y su cupo |
| Compras y pagos (§2.3) | `PurchaseDetailScreen`, `PurchaseHistoryScreen` | `GET /compras-cursos`, `GET /compras-cursos/{id}`, `GET /metodos-pago-cursos`, `POST /compras-cursos/{id}/pagos` | Reporte: `idMetodoPago`, `monto`, `fechaPago`, `referencia`, `canalComprobante`, `rutaComprobante`, `nombreArchivoOriginal`, `tipoArchivo`, `comprobanteConfirmado`, `fechaEnvioWhatsapp`, `observaciones` | Validar el pago reportado |
| Actividad académica (§2.4) | `MyCoursesScreen`, `MyCourseDetailScreen`, `NotificationsScreen` | `GET /cliente/mis-cursos[/{id}[/materiales]]`, `GET /cliente/notificaciones`, `PATCH /cliente/notificaciones/{id}/leida` | Solo lectura, salvo marcar como leída (sin cuerpo) | Historial, avisos y avance |
| Preferencias Opt-Out (§2.5) | `AccountScreen` | `GET/PUT /profile/privacy-preferences` | `nonEssentialCommunications`, `analytics`, `shareProgress` | Respetar el consentimiento secundario |
| Documentos legales | `LegalInformationScreen`, `RegisterScreen` | `GET /legal/{tipo}` (público) | Ninguno | Mostrar aviso y términos |
| Catálogo | `CatalogScreen`, `CourseDetailScreen` | `GET /cursos[/{id}]` (público) | Ninguno | Consulta de cursos |

Verificaciones de coincidencia:

- No se encontraron campos adicionales "por si acaso": los cuerpos que arma cada servicio son exactamente los DTO de la tabla y coinciden con `BACKEND_CONTRACTS.md` (el PUT de perfil no envía correo, rol ni id; el PUT de Opt-Out envía solo las tres banderas).
- Los datos se usan en memoria para mostrar las pantallas correspondientes; no se reenvían a ningún otro destino. Hay dos salidas hacia el dispositivo/terceros iniciadas por el usuario: (a) `Clipboard.setString` en `PurchaseDetailScreen` (copiar datos de pago) y (b) abrir `https://wa.me/<número de pagos>?text=…` con un mensaje que contiene folio, título del curso y monto, para que el usuario envíe su comprobante por WhatsApp (canal previsto en el Aviso §2.3). No se envía nada automáticamente.
- La app **no sube imágenes de comprobante**: reporta `canalComprobante` (p. ej. `WhatsApp`) y metadatos. El Aviso §2.3 menciona un comprobante "imagen"; la app móvil recaba un subconjunto de lo descrito.
- La bandera `analytics` de Opt-Out solo se guarda y se lee (el backend tampoco la aplica en otros módulos según `BACKEND_CONTRACTS.md`); la app no tiene consumidores de analítica.

## 3. SDKs de terceros (analítica / tracking)

**No se identificaron SDKs de analítica ni de tracking de terceros.** Se revisaron `package.json`, `android/build.gradle`, `android/app/build.gradle` y `src/` buscando Firebase/Crashlytics, Sentry, Amplitude, Mixpanel, Segment, AppsFlyer, Bugsnag, Datadog, OneSignal y `google-services`; no hay coincidencias (no existe `google-services.json`). Las dependencias de runtime son: React Native, React Navigation, `react-native-keychain`, `react-native-ssl-public-key-pinning`, `react-native-markdown-display`, `@react-native-clipboard/clipboard`, `@react-native-community/datetimepicker`, `react-native-keyboard-controller`, `react-native-reanimated`, `react-native-worklets`, `react-native-screens` y `react-native-safe-area-context`; ninguna recolecta datos por sí misma ni los envía a terceros. Por tanto el Aviso §2.6 (fines analíticos) no describe ningún SDK en el cliente.

## 4. Exposición de información sensible (código fuente móvil)

| Revisión | Resultado |
|---|---|
| `console.log/warn/error/info/debug` en `src/` (incluye services, repositories y viewmodels) | **Cero ocurrencias** (`grep -rn "console\.\(log\|warn\|error\|info\|debug\)" src/`) |
| `Log.*` / `android.util.Log` en código nativo propio (`android/app/src`) | Sin coincidencias |
| Logging de red en `httpClient.ts` | No hay logs de headers ni bodies; tampoco condicionales `__DEV__` porque no hay logging que condicionar |
| Almacenamiento | Único almacenamiento persistente: `react-native-keychain` en `tokenStorage.ts` (servicio `cmp_mobile_auth`, tokens de acceso y refresh). Sin `AsyncStorage`, MMKV ni almacenamiento plano en `src/`. Contraseñas y datos de perfil solo viven en memoria durante la sesión; la contraseña de baja/cambio se limpia tras el envío |
| `FLAG_SECURE` | **No se usa** (sin coincidencias en `src/` ni `android/app/src`). **Observación**: perfil, comprobantes/pagos y eliminación de cuenta pueden capturarse en pantalla y aparecer en la vista de "recientes" de Android. No se considera bloqueante para este proyecto; queda como posible mejora |
| Secretos en el cliente | Ninguno (ver `JADX_OBFUSCATION_REPORT.md`) |
| Transporte | HTTPS con pinning de clave pública; `usesCleartextTraffic="false"` en release |

No se corrigió código móvil: no hubo logs ni almacenamiento inseguro que corregir.

## 5. Hallazgos del lado de CMP_Site (solo lectura)

Estado de todos los hallazgos de esta sección: **reportado, pendiente de corrección por el equipo del backend** (no corregible desde este repositorio).

1. **Código OTP de verificación escrito en logs del servidor (relevante).** `src/app/api/auth/send-otp/route.ts` hace `console.log("🔑 Código generado:", codigo)` y `console.log(\`📱 CÓDIGO: ${codigo}\`)`, junto al correo del destinatario (`🔐 CÓDIGO DE VERIFICACIÓN PARA: ${email}`), y registra `{ email, nombre }` en cada solicitud. Cualquiera con acceso a los logs de Vercel podría ver códigos vigentes. Además el mensaje de respuesta cuando falla el envío es "Código generado (revisa la consola, el email no se pudo enviar)".
2. **Correo del usuario en logs.** `src/lib/db-with-user.ts` registra `Estableciendo email de usuario…: ${userEmail}` y mensajes equivalentes en cada operación; `src/lib/email.ts` registra la dirección de destino de cada correo. Es dato personal en logs, de menor gravedad que el punto 1.
3. **Enumeración de cuentas (observación).** `POST /auth/send-otp` responde 409 "El correo ya está registrado", lo que permite saber si un correo tiene cuenta.

Revisiones sin hallazgo (backend):

- `GET /profile` y `PUT /profile` seleccionan solo `id`, nombre, apellidos, edad, sexo, teléfono y correo (`camposPerfil`); no devuelven hash de contraseña. Los filtros son por `session.user.id` y `activo`.
- `POST /auth/mobile/login` devuelve `usuario` con id, nombre, apellidos, nombre completo, correo y rol; sin hash. `POST /auth/register` elimina `contrasena` del usuario antes de responder (`const { contrasena: _, ...usuarioSinPass }`).
- `GET/POST /compras-cursos`, `GET /compras-cursos/{id}`, `GET /cliente/mis-cursos` y `GET /cliente/notificaciones` filtran por el `usuarioId` de la sesión (o por el participante vinculado al usuario).
- Los `console.error` revisados en `auth/*`, `profile/password`, `cloudinary/comprobantes` y `admin/compras-cursos/*/comprobante` registran el objeto de error, no el cuerpo de la solicitud con contraseñas.
- Limitación: se leyeron las rutas relevantes con búsquedas dirigidas (`git grep` y lectura de las funciones de selección), no una revisión línea por línea de las más de 30 carpetas de `src/app/api`.

## 6. Conclusión por criterio de aceptación (#98)

| Criterio | Resultado |
|---|---|
| Se identifican los permisos utilizados por la aplicación | **Cumplido.** `INTERNET` declarado; `USE_BIOMETRIC`/`USE_FINGERPRINT` fusionados por librerías y no ejercidos (§1) |
| No se solicitan permisos que no sean necesarios | **Cumplido**, con la observación de eliminar los dos permisos biométricos heredados (§1) |
| Los permisos se solicitan únicamente cuando corresponde | **Cumplido.** No hay permisos de tiempo de ejecución |
| La política de privacidad se encuentra disponible | **Cumplido.** `LegalInformationScreen` y resumen en el registro cargan el aviso y los términos vigentes desde el backend (#87/#141) |
| Los datos personales se utilizan únicamente en los flujos definidos | **Cumplido en el cliente.** La matriz de §2 no muestra usos fuera de los documentados ni SDKs de terceros (§3). Del lado backend no se halló uso indebido; sí logs con datos personales (§5) |
| La información sensible no se expone innecesariamente | **Cumplido en el cliente** (§4: sin logs, tokens solo en Keychain). **Parcial en el backend**: el OTP y el correo se escriben en logs del servidor (§5, puntos 1 y 2) |
| Los hallazgos relacionados con privacidad se corrigen o documentan | **Cumplido.** Documentados aquí; los del backend quedan reportados para el equipo de CMP_Site |
| Los mecanismos de consentimiento funcionan cuando son requeridos | **Cumplido** en el flujo móvil: el registro exige aceptar aviso y términos, con resumen y acceso al texto completo, y el Opt-Out sincroniza con el backend. La constancia de la versión aceptada la registra CMP_Site al registrar (alcance del backend); esta auditoría no la verificó en producción |

Resumen: en la app móvil no hay hallazgos que exijan corrección; las observaciones son opcionales (permisos biométricos heredados, `FLAG_SECURE`). El único hallazgo relevante está en CMP_Site (OTP en logs) y se entrega para su corrección.
