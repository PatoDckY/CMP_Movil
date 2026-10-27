# Validación integral, regresión y cierre técnico — CMP_Movil

> Evidencia histórica de la revisión del 2026-10-17 (184 pruebas/18 suites). El rediseño posterior,
> sus pruebas y el estado actual de Git constan en [INSTITUTIONAL_REDESIGN.md](INSTITUTIONAL_REDESIGN.md).

Fecha: 2026-10-17. Rama conservada: `fix/A17-sesion-movil`.

El bloque queda listo para preparar un commit y un Pull Request de revisión hacia `develop`, con los pendientes indicados en este informe. No acredita liberación, aceptación académica completa ni ejecución en dispositivo. No se hicieron commits, push, merge, cambios de rama, migraciones, modificaciones de CMP_Site ni solicitudes reales a su API. Se preservaron los avances locales previos.

## 1. Alcance y resultado comprobado

Se revisaron los cambios rastreados y los archivos nuevos: autenticación, almacenamiento, HTTP, contexto, navegación, A17, perfil, catálogo, compras, acceso académico, pruebas y documentación. La base anterior de 142 pruebas/16 suites queda ampliada a **184 pruebas aprobadas/18 suites**, sin fallos finales. TypeScript, ESLint y el build Android debug terminan con código 0. Las advertencias y los límites de esas comprobaciones se detallan abajo.

Las integraciones funcionales usan `__tests__/helpers/isolatedBackend.ts`: todas las llamadas fetch se interceptan, sin fallback a red; Keychain también se sustituye. `ProductJourneys.test.tsx` utiliza la composición real de dependencias, repositorios, servicios, cliente HTTP, contexto y ViewModels. Es integración entre capas con mocks, no E2E nativo ni prueba del servidor desplegado.

| Recorrido | Resultado real | Evidencia automatizada | Límite |
|---|---|---|---|
| Registro → OTP → login → sesión | Aprobado con datos ficticios; exclusión de envíos repetidos | `ProductJourneys.test.tsx`, suites de registro/login y `AuthConcurrency.test.tsx` | Entrega real de correo y MFA completo pendientes |
| Login → catálogo → búsqueda → detalle | Aprobado; carga, vacío, error/reintento e ID inválido cubiertos | `ProductJourneys.test.tsx`, `Catalog.test.tsx` | Renderizado y navegación Android pendientes |
| Detalle → reserva → confirmación → mis cursos | Reserva pendiente comprobada; no aparece como inscripción pagada | `ProductJourneys.test.tsx`, `Purchases.test.tsx`, `CoursePurchaseContracts.test.ts` | El test activa después una inscripción en el backend ficticio; el móvil no la crea ni valida un pago automáticamente |
| Mis cursos → detalle académico autorizado | ID de inscripción, sesiones y progreso comprobados; 401/403/404 e ID ajeno rechazados | `MyCourses.test.tsx`, recorrido integrado | Política real de pertenencia inspeccionada en código backend; falta ejecución en ambiente aislado real |
| Perfil → consulta → edición → actualización visual | El perfil guardado actualiza el nombre del contexto sin otra llamada de sesión | `Profile.test.tsx`, `AccountNavigation.test.tsx`, recorrido integrado | Persistencia real backend pendiente |
| Cuenta → A17 → folio pendiente | 202, contraseña actual, confirmación, recibo válido, sin logout | `AccountDeletion.test.tsx`, `AccountNavigation.test.tsx`, recorrido integrado | Eliminación final de datos no comprobada ni ejecutada |
| Logout → limpieza → público | Bloqueo inmediato; borrado verificado antes de revocación; reinicio simulado sin tokens | `logout.test.tsx`, `AccountNavigation.test.tsx` | Keychain real y transición nativa pendientes |
| Sesión expirada/revocada → bloqueo | Refresh rechazado retira usuario/tokens; red transitoria conserva sesión recuperable | `logout.test.tsx`, recorrido integrado | No hay notificaciones push de revocación; se detecta al consultar API o volver a primer plano |

## 2. Defectos reproducidos y correcciones

Las regresiones se agregaron antes de la corrección: siete casos de sesión fallaron inicialmente. También fallaron el reintento repetido de reporte aceptado y la escritura de Keychain que declaraba éxito sin persistir. Todos pasan al cierre; no se eliminaron sus aserciones.

| Hallazgo | Corrección y archivos | Evidencia |
|---|---|---|
| Revalidar al volver a primer plano activaba el loader inicial y desmontaba navegación/formularios | `SessionContext.restoreSession`: `hasRestored` limita ese loader al arranque | `logout.test.tsx`: revalidación conserva `isRestoring=false` |
| Una respuesta privada anterior podía entregarse después de guardar otra sesión sin logout intermedio | `tokenStorage.saveTokens` cambia generación al confirmar una nueva identidad; HTTP comprueba generación | `logout.test.tsx`: petición antigua rechazada tras guardar otra sesión |
| Un refresh anterior podía sobrescribir tokens de una nueva sesión | Escrituras serializadas y condicionadas por generación, comprobaciones antes/después de guardar | `logout.test.tsx`: refresh antiguo y dos logins concurrentes |
| El refresh compartido de una sesión antigua impedía renovar la nueva | `HttpClient.refreshAccessToken`: comparte promesa solo dentro de la misma generación y libera por identidad de operación | `logout.test.tsx`: nueva sesión renueva con refresh anterior aún pendiente |
| Tokens vacíos podían persistirse como credenciales | `isStoredTokens` rechaza ambos tokens vacíos o con espacios; identidad se mapea antes de guardar | `logout.test.tsx`, `ReviewValidation.test.ts` |
| El catch de parseo podía repetir un borrado fallido de datos corruptos | `getTokens` separa parseo y limpieza para no reintentar implícitamente | `logout.test.tsx`: una sola llamada de borrado |
| Si desaparecían credenciales nativas, una consulta privada fallaba sin retirar el contexto autenticado | HTTP invalida y limpia antes de devolver 401 sin token | `logout.test.tsx`: navegación bloqueada por desaparición local |
| Keychain podía devolver éxito de escritura sin conservar el par recibido | `persistTokens` relee y compara; ante incertidumbre bloquea y verifica limpieza; errores sanitizados | `logout.test.tsx`: guardado aparente rechazado |
| Timeout durante lectura nativa podía permitir enviar una mutación tardía | HTTP verifica también `signal.aborted` al continuar | `httpClient.test.ts`: ninguna llamada fetch después del plazo |
| Perfil actualizado podía mantener el nombre anterior, y refrescar sesión desmontaba la pantalla | `useProfileViewModel` publica perfil confirmado a `SessionContext.updateProfile`; `PersonalDataScreen` elimina GET adicional; navigator se conserva para el mismo ID y se reinicia al cambiarlo | `AccountNavigation.test.tsx`, `logout.test.tsx`, recorrido integrado |
| Después de un reporte aceptado y un fallo al refrescar detalle, reintentos sucesivos podían duplicarlo | `usePurchaseDetailViewModel` conserva confirmación de envío hasta una consulta manual exitosa; respuesta de otra ruta no reemplaza detalle actual | `Purchases.test.tsx`: múltiples reintentos bloqueados y nueva consulta habilita siguiente reporte |
| Validación de participantes/montos estaba duplicada en pantallas y ViewModels | Funciones de dominio `purchaseValidation.ts`, usadas por pantallas, ViewModels y repositorio; se alinean con validador backend leído | `ReviewValidation.test.ts`, `Purchases.test.tsx` |
| El formulario exigía sexo aunque el contrato lo permite nulo | Campo opcional y validación compartida | Caso de participante con opcionales nulos |
| Identidades/perfiles incompletos o compra de otro ID podían presentarse como válidos | Guardas de mappers y coincidencia de compra/pago en `PurchaseRepositoryImpl` | `ReviewValidation.test.ts`, `CoursePurchaseContracts.test.ts` |
| Campos genéricos y control de visibilidad de contraseña carecían de etiqueta accesible por defecto | `FormField`, `PasswordField`: etiquetas y rol de botón; se conserva override explícito | Revisión estática; TalkBack pendiente |

## 3. Logout, carreras y seguridad

`SessionContext.logout` invalida restauraciones pendientes, marca cierre local, retira `user` y termina el estado inicial de restauración antes de esperar infraestructura. `RootNavigator` deja de representar el árbol privado. Pulsaciones repetidas comparten la operación.

`AuthRepositoryImpl.performLogout` llama a `clearTokensForLogout`: se incrementa generación, se bloquean lecturas y se notifica `sessionEvents`; se captura el access token exclusivamente en memoria y se borra Keychain con lectura de comprobación. Solo después se solicita `POST /api/auth/mobile/logout` con ese Bearer, sin refresh y con límite de 10 segundos que cubre fetch y cuerpo. Una red caída o un servidor que nunca responde no conserva credenciales locales.

`LogoutError.phase='remote'` significa que la limpieza local funcionó pero la revocación no pudo confirmarse. `phase='local'` bloquea igualmente el acceso y comunica que no pudo completarse el borrado; no se anuncia éxito. El usuario puede reintentar el cierre. La aplicación no almacena tokens ni contraseñas en logs ni en almacenamiento de pruebas fuera de sus dobles en memoria.

Login, restore, refresh y HTTP comprueban generaciones. Un guardado previo ya iniciado queda serializado antes del borrado. Un login explícito posterior al cierre puede crear una generación nueva; operaciones viejas no sobrescriben ni entregan datos de ella. El árbol privado se remonta al cambiar el ID para descartar vistas de otra cuenta. El perfil confirmado solo actualiza el ID autenticado actual.

Limitación material: si el sistema nativo no borra Keychain, el bloqueo se garantiza en el proceso actual, pero las credenciales podrían seguir físicamente presentes al reiniciar. Sin persistencia fiable o revocación confirmada no se puede prometer su inexistencia; se informa el fallo y no se certifica logout exitoso. Una llamada nativa que no resuelve también puede mantener pendiente la limpieza, aunque las pantallas privadas ya estén bloqueadas. El límite de red no pretende cancelar una operación nativa de Keychain.

TLS y pinning permanecen sin cambios. No se abrieron archivos de credenciales ni se imprimieron secretos. Los errores de A17 y almacenamiento se sanitizan; los mensajes 5xx generales no muestran respuestas internas del servidor.

## 4. A17: contrato estricto

La pantalla etiqueta **contraseña actual**, exige confirmación expresa y limita la contraseña a 200 caracteres. Se mantiene temporalmente en memoria y el campo se vacía al iniciar el envío, también en error; no se guarda en Keychain, preferencias ni logs. El servicio usa exactamente `DELETE /api/account`, JSON `{contrasena, confirmacion:true}`, Bearer y 15 segundos de plazo.

Solo HTTP 202 y recibo válido (folio positivo, estado pendiente/respondida y `eliminacionCompletada:false`) generan confirmación. HTTP 200, estructura inválida o eliminación completada se rechazan. El texto aclara que sigue en proceso; ni se declara cuenta eliminada ni se llama logout. Se cubren contraseña incorrecta/403, falta de autorización, rol inválido, 400/404/423/500, timeout, solicitud existente, doble envío y reintentos. El servidor puede haber aceptado una solicitud antes de un timeout: se indica incertidumbre y se conserva la semántica de folio existente.

La revisión del contrato fue de lectura de CMP_Site; sus rutas y SHA están en [BACKEND_CONTRACTS.md](BACKEND_CONTRACTS.md). No prueba qué versión está desplegada ni la eliminación administrativa posterior.

## 5. Arquitectura y patrones: evidencia concreta

| Principio/patrón | Implementación comprobada | Observación |
|---|---|---|
| Capas/MVVM/SRP | `AccountDeletionScreen` → `useAccountDeletionViewModel.submit` → `AccountRepositoryImpl.requestDeletion` → `accountService.requestDeletion` → HTTP; patrón equivalente en perfil/cursos/compras | Views manejan presentación, entradas, pickers y apertura de WhatsApp; sin fetch ni endpoints en pantallas o ViewModels |
| Dominio y tipado | `purchaseValidation.validatePurchase`, `amountToCents`, mappers user/profile/account y DTO separados | Se extrajeron reglas compartidas de compras sin reescribir pantallas completas |
| Repository/DIP | `AccountRepository`, `ProfileRepository`, `PurchaseRepository`; implementaciones reciben Service por constructor; hooks reciben contratos | Los tests sustituyen contratos; el recorrido integrado usa implementaciones reales |
| DI | `src/config/dependencies.ts` compone instancias | No se crean clientes HTTP dentro de una pantalla |
| Factory | `src/factories/RepositoryFactory.ts`, `createAuthRepository` | Se conserva la fábrica existente; no se extiende artificialmente |
| Observer/Context | `sessionEvents.subscribe/invalidate`, `SessionProvider`, `useSession` | Infraestructura notifica invalidación sin importar React |
| Singleton | `HttpClient.getInstance` y export compartido | No se convierte cada dominio/ViewModel en singleton |
| ISP/OCP/LSP | Contratos por módulo; repositorios sustituibles usados por los tests | Evidencia de separación y sustitución, no certificación formal de todo el código histórico |

La responsabilidad de Bearer y refresh está en HTTP; no existe un Proxy separado. Persisten pantallas de compras extensas y acoplamiento histórico del repositorio de recuperación a un servicio concreto; no impiden estas pruebas pero limitan una afirmación de SOLID absoluto. No se agregaron patrones ni dependencias para cumplir una lista nominal.

## 6. Verificación técnica ejecutada

| Comando | Resultado final real |
|---|---|
| `node node_modules/jest/bin/jest.js --runInBand --silent` | 18/18 suites, 184/184 pruebas, 0 fallos, 0 snapshots; 5.56 s |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Código 0, sin diagnósticos |
| `node node_modules/eslint/bin/eslint.js .` | Código 0; 0 errores, 10 warnings `no-void` preexistentes |
| `git diff --check` | Resultado final incorporado en la sección Git |
| `android/gradlew.bat :app:assembleDebug --offline --no-daemon --console=plain` | BUILD SUCCESSFUL, 47 s; 292 tareas, 38 ejecutadas y 254 up-to-date |
| `react-native bundle --platform android --dev true --entry-file index.js --max-workers 2` | Código 0; bundle en TEMP y 24 assets |
| `adb devices -l` | Servidor ADB iniciado; lista vacía, sin dispositivos ni emuladores conectados |

El build se ejecutó con `GRADLE_USER_HOME=C:/Users/chave/.gradle` y el JBR de Android Studio, sin descargar dependencias. El APK debug queda en `android/app/build/outputs/apk/debug/app-debug.apk`; debug depende de Metro, por eso también se generó el bundle por separado. Los artefactos no se incorporan a Git.

Advertencias conservadas: ESLint `no-void` en PersonalDataScreen (1), MyCourseDetailScreen (3), PurchaseDetailScreen (4) y PurchaseHistoryScreen (2). Gradle avisa de `android.builtInKotlin`, `android.newDsl`, APIs antiguas de variantes y funciones incompatibles con Gradle 10. Metro advierte de `ReactNativeFeatureFlags` fuera de exports y variables `FORCE_COLOR`/`NO_COLOR`. Git avisa de normalización LF→CRLF en algunos archivos. Ninguna se silenció ni motivó cambios de dependencias o protecciones.

Fallos intermedios: las regresiones descritas en la sección 2 fallaron antes del arreglo; el cambio temporal de contrato de almacenamiento requirió adaptar el mock existente y se corrigió una advertencia nueva de sombreado. La ruta intentada de CLI Prettier correspondía a otra versión; se usó después la versión instalada, sin descargar paquetes. La consulta inicial ADB no podía crear su directorio bajo aislamiento; el reintento autorizado funcionó y confirmó la lista vacía. No quedan errores nuevos en las comprobaciones finales.

## 7. Android, accesibilidad y aceptación pendientes

No se instaló ni abrió la aplicación. No había dispositivo conectado y la configuración de ejecución apunta únicamente a producción, sin backend aislado instalado para Android. El interceptor Jest no configura un ambiente móvil de pruebas.

Quedan pendientes en dispositivo: arranque, navegación real, teclado y scroll, tamaños/orientación, renderizado de formularios/cargas/errores, ausencia de cierres inesperados, persistencia nativa y reinicio, retorno desde WhatsApp, TalkBack, foco, contraste y fuente grande. Las etiquetas accesibles y pruebas de componentes son evidencia parcial, no validación de esas propiedades nativas. No se ejecutó iOS ni build release.

## 8. Cumplimiento académico y contratos pendientes

Se incorporaron los grupos entregados en el encargo: A21–26 autenticación; A27–32 catálogo; A33–39 adquisición/acceso; A40–45 mis cursos/contenido; A46–51 progreso; A52–59 cuenta/perfil/notificaciones/políticas; A60–67 estabilización/compatibilidad; A68–77 pruebas/cierre. [COMPLIANCE_MATRIX.md](COMPLIANCE_MATRIX.md) relaciona cada ID con su grupo y evidencia disponible; [TEST_MATRIX.md](TEST_MATRIX.md) contiene PU, PI, PF, PS, ACC, US y COMP con requisito, archivo, caso, resultado, evidencia, estado y bloqueo.

Falta la descripción y criterio oficial individual de A21–A77, salvo la asociación A25 con recuperación identificada en código. Conocer los grupos permite trazabilidad de grupo, no asignar nombres individuales ni aprobar todas sus actividades. Los códigos B-* y de pruebas son locales. No hubo evaluador, rúbrica ni sesión de aceptación: no se declara aceptación académica.

Pendientes por contrato/contenido externo: MFA móvil completo; cambio autenticado de contraseña; notificaciones de cliente y leído/no leído; módulos/lecciones, completar y reanudar posición; políticas oficiales y consentimiento versionado; eliminación final de datos y proceso administrativo A17. Se conserva el avance consultable basado en sesiones y asistencia del servidor. La solicitud de recuperación por correo no reemplaza un cambio de contraseña autenticado.

Riesgos para liberación: firma debug y minificación deshabilitada en configuración release existente; confirmar receptor institucional de WhatsApp y datos bancarios antes de uso real; los textos legales siguen explícitamente provisionales. Una respuesta perdida tras crear reserva o reportar pago deja incertidumbre: las defensas de UI evitan duplicaciones conocidas en el proceso, pero no garantizan exactamente una operación entre reinicios o fallos de red sin idempotencia del backend. Consultar historial antes de reintentar. No se inventaron APIs para resolver estos bloqueos.

## 9. Estado completo de Git

Rama: `fix/A17-sesion-movil`. 40 archivos rastreados modificados, 36 archivos sin seguimiento (76 archivos en total), 0 archivos staged.

`git diff --stat` solo contabiliza archivos rastreados: 40 files changed, 644 insertions(+), 439 deletions(-). Los archivos nuevos NO están incluidos en esa estadística y se enumeran por separado. El conteo anterior de 29 modificados/31 nuevos correspondía al bloque previo; este es el estado actual, sin descartar avances.

`git diff --check`: código 0, sin errores de whitespace; Git conserva advertencias LF→CRLF. Ningún cambio staged.

### Salida de git status --short

```text
 M README.md
 M __tests__/repositories/AuthRepositoryImpl.test.ts
 M __tests__/services/httpClient.test.ts
 M docs/architecture/MVVM.md
 M jest.config.js
 M src/components/auth/FormField.tsx
 M src/components/auth/PasswordField.tsx
 M src/components/common/PrimaryButton.tsx
 M src/config/dependencies.ts
 M src/mappers/profileMapper.ts
 M src/mappers/userMapper.ts
 M src/navigation/AuthenticatedNavigator.tsx
 M src/navigation/PublicNavigator.tsx
 M src/navigation/RootNavigator.tsx
 M src/navigation/types.ts
 M src/repositories/implementations/AuthRepositoryImpl.ts
 M src/repositories/implementations/MyCoursesRepositoryImpl.ts
 M src/repositories/implementations/PurchaseRepositoryImpl.ts
 M src/screens/account/AccountScreen.tsx
 M src/screens/account/PersonalDataScreen.tsx
 M src/screens/catalog/CatalogScreen.tsx
 M src/screens/home/HomeScreen.tsx
 M src/screens/purchases/CreatePurchaseScreen.tsx
 M src/screens/purchases/PurchaseDetailScreen.tsx
 M src/services/contracts/AuthService.ts
 M src/services/http/httpClient.ts
 M src/services/implementations/authService.ts
 M src/services/implementations/courseService.ts
 M src/services/implementations/myCourseService.ts
 M src/services/implementations/profileService.ts
 M src/services/implementations/purchaseService.ts
 M src/services/security/tokenStorage.ts
 M src/session/SessionContext.tsx
 M src/viewmodels/account/useProfileViewModel.ts
 M src/viewmodels/auth/useLoginViewModel.ts
 M src/viewmodels/auth/useRegisterViewModel.ts
 M src/viewmodels/catalog/useCatalogViewModel.ts
 M src/viewmodels/catalog/useCourseDetailViewModel.ts
 M src/viewmodels/purchases/usePurchaseDetailViewModel.ts
 M src/viewmodels/purchases/usePurchaseViewModel.ts
?? __tests__/academic/
?? __tests__/account/
?? __tests__/helpers/
?? __tests__/navigation/
?? __tests__/product/
?? __tests__/quality/
?? __tests__/services/CoursePurchaseContracts.test.ts
?? __tests__/session/
?? __tests__/viewmodels/AuthConcurrency.test.tsx
?? __tests__/viewmodels/Catalog.test.tsx
?? __tests__/viewmodels/Purchases.test.tsx
?? docs/quality/
?? src/mappers/accountMapper.ts
?? src/models/AccountDeletion.ts
?? src/models/LogoutError.ts
?? src/models/purchaseValidation.ts
?? src/repositories/contracts/AccountRepository.ts
?? src/repositories/implementations/AccountRepositoryImpl.ts
?? src/screens/account/AccountDeletionScreen.styles.ts
?? src/screens/account/AccountDeletionScreen.tsx
?? src/screens/account/LegalInformationScreen.tsx
?? src/services/contracts/AccountService.ts
?? src/services/dto/AccountDto.ts
?? src/services/implementations/accountService.ts
?? src/services/security/sessionEvents.ts
?? src/viewmodels/account/useAccountDeletionViewModel.ts
?? src/viewmodels/catalog/catalogFilters.ts
```

### Salida de git diff --stat

```text
 README.md                                          |   7 +
 __tests__/repositories/AuthRepositoryImpl.test.ts  |  19 ++-
 __tests__/services/httpClient.test.ts              |  25 ++-
 docs/architecture/MVVM.md                          |   8 +-
 jest.config.js                                     |   1 +
 src/components/auth/FormField.tsx                  |   3 +-
 src/components/auth/PasswordField.tsx              |   5 +-
 src/components/common/PrimaryButton.tsx            |   5 +-
 src/config/dependencies.ts                         |   4 +
 src/mappers/profileMapper.ts                       |   8 +
 src/mappers/userMapper.ts                          |  10 +-
 src/navigation/AuthenticatedNavigator.tsx          |   5 +
 src/navigation/PublicNavigator.tsx                 |   4 +-
 src/navigation/RootNavigator.tsx                   |   5 +-
 src/navigation/types.ts                            |   3 +
 .../implementations/AuthRepositoryImpl.ts          |  85 +++++++++--
 .../implementations/MyCoursesRepositoryImpl.ts     |   3 +
 .../implementations/PurchaseRepositoryImpl.ts      |  12 ++
 src/screens/account/AccountScreen.tsx              |  19 ++-
 src/screens/account/PersonalDataScreen.tsx         |   7 +-
 src/screens/catalog/CatalogScreen.tsx              |  70 +--------
 src/screens/home/HomeScreen.tsx                    |   5 +-
 src/screens/purchases/CreatePurchaseScreen.tsx     | 117 ++------------
 src/screens/purchases/PurchaseDetailScreen.tsx     |  39 +----
 src/services/contracts/AuthService.ts              |   4 +-
 src/services/http/httpClient.ts                    | 130 +++++++++++++---
 src/services/implementations/authService.ts        |  14 +-
 src/services/implementations/courseService.ts      |   9 +-
 src/services/implementations/myCourseService.ts    |   2 +
 src/services/implementations/profileService.ts     |   2 +
 src/services/implementations/purchaseService.ts    |   8 +
 src/services/security/tokenStorage.ts              | 169 ++++++++++++++++-----
 src/session/SessionContext.tsx                     |  78 +++++++++-
 src/viewmodels/account/useProfileViewModel.ts      |  11 +-
 src/viewmodels/auth/useLoginViewModel.ts           |   9 +-
 src/viewmodels/auth/useRegisterViewModel.ts        |  14 +-
 src/viewmodels/catalog/useCatalogViewModel.ts      |  18 ++-
 src/viewmodels/catalog/useCourseDetailViewModel.ts |  23 ++-
 .../purchases/usePurchaseDetailViewModel.ts        |  50 ++----
 src/viewmodels/purchases/usePurchaseViewModel.ts   |  73 +--------
 40 files changed, 644 insertions(+), 439 deletions(-)
```

### Archivos sin seguimiento, listado individual completo

```text
__tests__/academic/MyCourses.test.tsx
__tests__/account/AccountDeletion.test.tsx
__tests__/account/Profile.test.tsx
__tests__/helpers/fixtures.ts
__tests__/helpers/isolatedBackend.ts
__tests__/helpers/renderHook.tsx
__tests__/navigation/AccountNavigation.test.tsx
__tests__/product/ProductJourneys.test.tsx
__tests__/quality/ReviewValidation.test.ts
__tests__/services/CoursePurchaseContracts.test.ts
__tests__/session/logout.test.tsx
__tests__/viewmodels/AuthConcurrency.test.tsx
__tests__/viewmodels/Catalog.test.tsx
__tests__/viewmodels/Purchases.test.tsx
docs/quality/BACKEND_CONTRACTS.md
docs/quality/COMPLIANCE_MATRIX.md
docs/quality/GIT_STATE.md
docs/quality/IMPLEMENTATION_REPORT.md
docs/quality/INTEGRAL_VALIDATION.md
docs/quality/SAFE_INTEGRATION.md
docs/quality/TEST_MATRIX.md
src/mappers/accountMapper.ts
src/models/AccountDeletion.ts
src/models/LogoutError.ts
src/models/purchaseValidation.ts
src/repositories/contracts/AccountRepository.ts
src/repositories/implementations/AccountRepositoryImpl.ts
src/screens/account/AccountDeletionScreen.styles.ts
src/screens/account/AccountDeletionScreen.tsx
src/screens/account/LegalInformationScreen.tsx
src/services/contracts/AccountService.ts
src/services/dto/AccountDto.ts
src/services/implementations/accountService.ts
src/services/security/sessionEvents.ts
src/viewmodels/account/useAccountDeletionViewModel.ts
src/viewmodels/catalog/catalogFilters.ts
```


## 10. Dictamen para revisión

El código y la regresión automatizada pueden prepararse para commit/PR hacia `develop` como entrega para revisión, declarando estos límites y adjuntando las matrices. Antes de crear el commit deberá revisarse el conjunto completo, incluidos los archivos sin seguimiento. La referencia local `origin/develop` usada previamente es `cb946b113b73e689579e5a6ebb2e63e705bd3e6c`; no se hizo fetch ni se puede prometer compatibilidad con cambios remotos posteriores. La aceptación de producto, publicación y aprobación académica permanecen condicionadas a los pendientes expuestos. No se realizó ninguna operación de integración.
