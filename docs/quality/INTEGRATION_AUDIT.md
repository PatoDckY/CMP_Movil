# Auditoría de integración de flujos — CMP_Movil

Fecha: 2026-10-25. Issue: #90. Código móvil auditado: `develop` en `fe73b89`. Backend leído (solo lectura, copia local): `CMP_Site` en `1b3571b`.

Alcance vigente: el del cambio `CAMBIO_ALCANCE_CMP_20261018` (sin tracking de progreso por lección). Es una auditoría de integración con evidencia, no una funcionalidad nueva.

Método y límites:

- **Código**: lectura de navegación, view models, repositorios y del cliente HTTP.
- **Pruebas automatizadas**: Jest completo (`npx jest --ci`), `tsc --noEmit` y ESLint. Línea base antes de tocar nada: 40 suites / 437 pruebas en verde, 0 errores de tipos y 0 errores de ESLint (18 advertencias `no-void` preexistentes). Tras el cambio de este PR: 40 suites / 439 pruebas en verde.
- **Backend**: se leyó la ruta y la lógica de fechas de materiales y se ejecutó `node --test tests/materiales-drive.test.mjs` en `CMP_Site` (34 aprobadas, 1 omitida por diseño).
- **Producción (solo lectura, sin cuenta)**: `GET /api/cursos` responde 200 con el catálogo; `GET /api/cliente/mis-cursos`, `/api/cliente/mis-cursos/1/materiales` y `/api/cliente/notificaciones` responden 401 sin token.
- **No se hizo**: recorrido contra producción con una cuenta de prueba (registro, compra, reporte de pago). Crear cuentas y reportar pagos son escrituras y no se autorizaron. Tampoco se probó en dispositivo/emulador. Los recorridos de extremo a extremo se cubren con el backend aislado de las pruebas (`ProductJourneys.test.tsx`), no con el real.

## 1. Flujo registro/login → catálogo → compra → Mis cursos

**Resultado: cumple en código y con backend aislado; sin recorrido real en producción.**

- Navegación: `PublicNavigator` (Home, Catalog, CourseDetail, Login, PasswordRecovery, Register, LegalInformation) y `AuthenticatedNavigator` (Home, MyCourses, Catalog, CourseDetail, CreatePurchase, PurchaseHistory, PurchaseDetail, Notifications, Account, PersonalData, AccountDeletion, ChangePassword, LegalInformation, MyCourseDetail). Cada ruta de `types.ts` está registrada y tiene al menos un `navigate(...)` que llega a ella. No hay pantallas huérfanas.
- Continuidad de compra: el detalle de curso sin sesión envía a Login/Register con `purchaseCourseId`; tras autenticarse, `RootNavigator` abre `CreatePurchase` con ese curso (`AuthContinuation.test.tsx`).
- La inscripción aparece en Mis cursos solo después de la validación del pago: la compra queda pendiente en el historial y Mis cursos lo indica en su estado vacío (`MyCoursesScreen`).
- Evidencia automatizada: `ProductJourneys.test.tsx` recorre registro → login → catálogo → reserva pendiente → inscripción autorizada → perfil → derechos A17 → logout, y cubre ausencia de red y revocación de cuenta.

## 2. Materiales de Drive: autorización y fechas

**Resultado: cumple. La ventana es inclusiva en ambos extremos y la decide el servidor.**

- Fechas (`CMP_Site/src/lib/cursos/materiales.ts`): `hoy < fechaInicio` → `no_iniciado`; `hoy > fechaFin` → `finalizado`; en otro caso `disponible` (o `sin_materiales` si no hay enlace válido). Por tanto el primer y el último día entran. `hoy` sale de PostgreSQL en `America/Mexico_City`, no del dispositivo; la frontera UTC no cambia la vigencia.
- Pruebas del backend: `API fecha inclusiva` cubre 17 (no iniciado), 18, 19, 20 (disponible) y 21 (finalizado) de octubre para un curso 18–20, y la prueba de frontera UTC.
- Autorización (ruta `/cliente/mis-cursos/{id}/materiales`): exige sesión (401), limita a la inscripción del titular, del participante vinculado o del comprador (404 si no es suyo) y solo permite estados de inscripción vigentes (403). La inscripción solo existe tras validar la compra.
- Móvil: no guarda el enlace en estado ni en almacenamiento; consulta al servidor en cada pulsación (`useCourseMaterialsViewModel`), valida que la URL sea una carpeta HTTPS de `drive.google.com` y que inscripción y curso coincidan con los pedidos, y trata 401/403/404 con un mensaje de falta de autorización. Pruebas: `CourseMaterials.test.tsx` y `CourseMaterialsPanel.test.tsx`.
- Sin cambios en este criterio.

## 3. Cuenta, notificaciones, contraseña y privacidad

**Resultado: cumple.**

`AccountScreen` enlaza a: Mis datos personales (editar perfil), Cambiar contraseña, Centro de notificaciones (con contador de no leídas que se refresca al volver), Privacidad y términos (documentos legales), interruptores de derecho de oposición (Opt-Out, guardados en la cuenta) y Solicitar eliminación de cuenta (visible solo para el rol cliente). Todas las rutas están registradas. Cubierto por `AccountNavigation.test.tsx`, `InstitutionalScreens.test.tsx`, `ChangePasswordScreen.test.tsx`, `NotificationsScreen.test.tsx`, `useOptOutViewModel.test.tsx` y `AccountDeletion.test.tsx`. El cambio de contraseña cierra la sesión al terminar, como anuncia la pantalla.

## 4. Navegación, errores y cierre de sesión

**Resultado: cumple, con una corrección aplicada y dos observaciones.**

Errores:

- Todos los view models de los flujos principales (catálogo, detalle de curso, Mis cursos, detalle de mi curso, historial de compras, notificaciones, perfil, legal) muestran `err.message` con un texto de respaldo y un estado de error con reintento. El mecanismo es el mismo en todos.
- 500: el cliente HTTP sustituye el mensaje del servidor por uno genérico, así que no se expone el detalle interno.
- 401: el cliente intenta renovar el token una vez; si el refresh es rechazado limpia credenciales y emite `sessionEvents`, que lleva a la pantalla pública. Un fallo de red no borra credenciales.
- **Hallazgo corregido**: sin red, React Native lanza `TypeError: Network request failed` y todas las pantallas lo mostraban tal cual, en inglés. Se tradujo en un único punto, `HttpClient.sendRequest`, a "No fue posible conectarse con el servidor. Revisa tu conexión e inténtalo de nuevo." (`src/services/http/httpClient.ts`). Solo se convierte `TypeError`; los timeouts y los abortos conservan su mensaje. Pruebas nuevas en `httpClient.test.ts` (red y 500).
- Observación: los flujos de materiales y de eliminación de cuenta usan mensajes propios con la misma idea. No se unificaron.

Cierre de sesión:

- `logout` bloquea el acceso local primero, borra credenciales y revoca en el servidor; informa si la limpieza local o la revocación remota quedaron incompletas (`logout.test.tsx`, unas 30 pruebas, incluidas carreras con refresh, login y lectura de Keychain pendientes).
- No hay cachés ni variables de módulo con datos de usuario en `src/` (las únicas son el contador de sesión y el bloqueo de `tokenStorage`). Además, `RootNavigator` usa `key={user?.id}` en el contenedor y el navegador, así que al cambiar de cuenta se desmonta todo el árbol y los view models empiezan vacíos.
- No se probó manualmente iniciar con otra cuenta en dispositivo.

## 5. Sin funciones ni métricas de avance por lección

**Resultado: no se encontró tracking de progreso por lección, consistente con el cambio de alcance.**

- No hay lecciones, módulos ni "completar/reanudar" en `src/` (el contrato de backend tampoco existe; ver `BACKEND_CONTRACTS.md`). El detalle de Mis cursos muestra encabezado, materiales, avance del curso, sesiones y asistencia, y una prueba verifica que no aparezcan "lecciones" ni "módulos" (`MyCourseDetailScreen.test.tsx`).
- Lo que sí hay y no es por lección: porcentaje de **asistencia** y estado académico del curso en `MyCoursesScreen` (en alcance, calculado por el servidor), y la barra de **cupo** del detalle de curso (ocupación, no avance).
- **Decisión posterior (#104, 2026-10-25)**: el avance por sesión que calcula el servidor (`totalSessions`, `completedSessions`, `progressPercentage`) no es avance por lección y se conserva como avance **a nivel curso**. En lugar de quitar esos campos, se muestran en Mis cursos y en el detalle del curso con `CourseProgressBar`, y el interruptor de Opt-Out `shareProgress` se mantiene sin cambios porque vuelve a tener sentido. Esto sustituye la lectura anterior de este informe, que los consideraba candidatos a retirarse. La prueba de `MyCourseDetailScreen` que prohibía `%` y "Sesiones completadas" se actualizó.

## Qué se corrigió

- `src/services/http/httpClient.ts`: mensaje de red en español, en un solo punto (criterio 4).
- `__tests__/services/httpClient.test.ts`: dos pruebas nuevas.

## Pendiente para #104

1. Repetir los criterios 1 y 4 en un entorno de pruebas con escrituras autorizadas: compra completa, validación de pago por un administrador y cambio de cuenta tras cerrar sesión. Las pruebas manuales del equipo en dispositivo ya los dan por funcionando.
2. Unificar los mensajes propios de materiales y eliminación de cuenta con el texto común de red, si se quiere un único criterio.
