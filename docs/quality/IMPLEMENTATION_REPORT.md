# Informe de implementación y calidad — CMP_Movil

> Informe histórico del bloque de 142 pruebas/16 suites. La revisión posterior, correcciones,
> resultados actuales y pendientes se consolidan en [INTEGRAL_VALIDATION.md](INTEGRAL_VALIDATION.md).
> Para trazabilidad vigente y conteos Git, usar las matrices y el informe actual.

Fecha: 2026-10-17. Rama: fix/A17-sesion-movil. Base inspeccionada: origin/develop local cb946b113b73e689579e5a6ebb2e63e705bd3e6c.

## A. Resumen de implementación

Se conservaron íntegramente los avances de perfil y logout. Este bloque agrega el flujo completo móvil para registrar una solicitud A17, con todas sus capas MVVM, navegación, contraseña temporal, confirmación expresa, bloqueo de envíos repetidos, contrato DELETE/202, validación de folio y estados pendiente/respondida. No elimina datos, no desactiva al usuario y no cierra su sesión automáticamente.

Se conecta la invalidación definitiva de tokens con el contexto de sesión. Un refresh rechazado deja de mantener pantallas privadas visibles; un 403 de contraseña no se confunde con invalidación. Una caída de red durante el refresh conserva credenciales. Al volver a primer plano se revalida la cuenta. No hay vigilancia continua del estado del servidor mientras la aplicación permanece inactiva.

Se agregan timeouts de 15 segundos y exigencia de Bearer para perfil, inscripciones y compras. Logout conserva su límite de 10 segundos. Los errores 500 no exponen mensajes internos. No se cambió certificate pinning ni TLS.

Se evita duplicar login/OTP/registro, se valida teléfono numérico, se controla carga concurrente de perfil y catálogo, y se impide que un detalle antiguo reemplace el curso actual. Búsqueda y agrupación se extraen a una función pura de presentación. El detalle académico comprueba que el ID devuelto corresponde a la inscripción solicitada.

Se añade información de privacidad accesible pública y privadamente, marcada explícitamente provisional. No se finge la existencia de términos oficiales ni consentimiento versionado.

## B. Archivos por módulo

- A17: modelos AccountDeletion, contratos AccountRepository/AccountService, AccountDto, accountMapper, AccountRepositoryImpl, accountService, useAccountDeletionViewModel, AccountDeletionScreen y estilos; composición en dependencies; rutas y acceso en AccountScreen.
- Sesión/seguridad: SessionContext, sessionEvents, tokenStorage y httpClient; se mantienen LogoutError y la corrección anterior de repositorio/servicio Auth.
- Catálogo: ViewModels de listado/detalle, catalogFilters, CatalogScreen y courseService.
- Perfil: useProfileViewModel y profileService; se reutilizan pantalla, repositorio, DTO y mapper existentes.
- Compras y mis cursos: servicios con autenticación explícita/timeout; validación de ID de respuesta en MyCoursesRepositoryImpl.
- Formularios/UX: useLoginViewModel, useRegisterViewModel, PrimaryButton, HomeScreen y LegalInformationScreen.
- Pruebas: helpers y suites nuevas de cuenta, catálogo, compras, contratos, autorización, navegación y regresiones de autenticación; ampliación de logout. jest.config.js delimita suites *.test.*.
- Documentación: este informe, BACKEND_CONTRACTS, COMPLIANCE_MATRIX, TEST_MATRIX y SAFE_INTEGRATION.

La salida real de Git se entrega en la conversación final; incluye cambios del logout que ya estaban presentes al comenzar este bloque.

## C. Arquitectura, patrones y SOLID

Flujo A17: AccountDeletionScreen → useAccountDeletionViewModel → AccountRepository → AccountRepositoryImpl → AccountService → accountService → HttpClient → CMP_Site.

- MVVM/SRP: la pantalla representa entradas, errores y recibo; el hook administra consentimiento, validación, exclusión de envíos y estado. No hay HTTP en View ni ViewModel.
- Repository/DIP: el ViewModel recibe AccountRepository; la implementación recibe AccountService por constructor. Las pruebas inyectan dobles sin tocar infraestructura real.
- DTO/mapper: AccountDto representa el contrato español; accountMapper valida y convierte a un recibo de dominio con nombres internos y deletionCompleted:false.
- DI: src/config/dependencies.ts compone instancias. No se crean servicios dentro de pantallas.
- Factory: src/factories/RepositoryFactory.ts sigue construyendo AuthRepository.
- Singleton: HttpClient.getInstance() conserva una instancia compartida. No se convierte dominio ni presentación en singleton.
- Observer: React state/context actualiza las vistas; sessionEvents notifica invalidaciones sin importar React desde el almacenamiento.
- ISP: contratos de cuenta, perfil, cursos y compras separados; sin una interfaz monolítica de toda la API.
- OCP/LSP: consumo por interfaces permite sustituir servicios/repositorios, como demuestran las pruebas; no es una certificación formal de todos los módulos históricos.
- No se afirma un Proxy separado: la responsabilidad de agregar Bearer y renovar vive en HttpClient. No se agregó una envoltura artificial solo para enumerar patrones.

Persisten áreas históricas a mejorar gradualmente: pantallas extensas de compras, validaciones duplicadas y repositorio de recuperación acoplado a su servicio concreto. No se reescribieron módulos funcionales.

## D. Integración CMP_Site

Ver BACKEND_CONTRACTS.md para rutas, semántica, errores y SHA de archivos inspeccionados. Todo el contraste fue de lectura en GitHub. No se modificó backend, base de datos ni configuración sensible, ni se hicieron operaciones reales de autenticación, perfil, compra o A17.

No se implementaron APIs inventadas para cambio autenticado de contraseña, notificaciones ni progreso de lecciones. El backend académico comprobado ofrece sesiones/asistencia/progreso. La eliminación final de datos requiere un procedimiento posterior que este móvil no acredita.

## E. Verificaciones

- Jest: 142 pruebas en 16 suites al cierre de implementación; se reejecutan conjuntamente para la entrega.
- TypeScript: verificación sin emisión y sin errores.
- ESLint: sin errores nuevos; 10 advertencias no-void preexistentes en PersonalDataScreen, MyCourseDetailScreen, PurchaseDetailScreen y PurchaseHistoryScreen.
- git diff --check: requerido en validación final.
- Android: :app:assembleDebug --offline --no-daemon → BUILD SUCCESSFUL; 292 tareas, 57 ejecutadas y 235 actualizadas, 3m14s.
- JavaScript Android: bundle Metro --platform android --dev true generado en TEMP, con 24 assets.
- No se instaló ni ejecutó la app; no se ejecutaron E2E ni TalkBack ni pruebas de hardware.

El primer intento Android aislado falló al crear el lock en C:/.gradle. Con ejecución autorizada usando GRADLE_USER_HOME=C:/Users/chave/.gradle y el JBR de Android Studio, la compilación offline terminó. Es configuración del entorno, no un defecto del código corregido.

Advertencias nativas: opciones android.builtInKotlin/android.newDsl y APIs legacy de variantes de AGP, Gradle features obsoletas y adaptaciones de dependencias. Metro advierte por importación de ReactNativeFeatureFlags no exportada oficialmente y FORCE_COLOR/NO_COLOR. No se debilitaron protecciones ni se actualizaron dependencias para silenciarlas.

Fallos intermedios nuevos corregidos: tipado de un mock Response, narrowing del token opcional en un closure, factories de Jest que referenciaban variables externas, selección del checkbox en Test Renderer y mock de AppState que necesitaba devolver remove(). No se rebajaron aserciones de seguridad ni se ocultaron fallos existentes.

## F. Mobile-D y trazabilidad

- Exploración: comparación con origin/develop, lectura de arquitectura, inventario y búsqueda de contratos.
- Inicialización: preservación de la rama y cambios locales, uso de dependencias existentes, elección de mocks y matriz de riesgos.
- Producción: módulos A17 completos y correcciones de seguridad, perfil y catálogo en incrementos verificados.
- Estabilización: pruebas de errores, concurrencia, autorización y regresión del logout.
- Pruebas y cierre: validación conjunta, build/bundle locales y matrices. Cierre de código para revisión; NO aceptación académica o liberación.

Ver COMPLIANCE_MATRIX.md para las seis iteraciones y el listado A21–A77. Donde no hay descripción oficial se marca pendiente de trazabilidad, sin atribuir criterios inventados.
Ver TEST_MATRIX.md para PU, PI, PF, PS, ACC, US y COMP con evidencia y pendientes.

## G. Limitaciones y bloqueos

1. No se certifica comportamiento contra producción ni contra un backend de pruebas; se probó con mocks.
2. Una limpieza Keychain rechazada mantiene el acceso local bloqueado y reporta el error. No puede garantizarse borrado persistente ni ausencia de credenciales tras reiniciar si el sistema operativo rechazó el borrado.
3. Un timeout remoto no demuestra que el servidor no procesó la petición. Logout no garantiza revocación remota sin respuesta; A17 permite recuperar el folio abierto al reenviar conscientemente.
4. Contratos no verificados bloquean cambio autenticado de contraseña, notificaciones, lecciones y reanudación persistida. Recuperación por correo permanece disponible.
5. Información legal provisional, aceptación versionada de aviso sin contrato y tratamiento final de eliminación sin verificar bloquean declarar cumplimiento de publicación.
6. Validación Android real, accesibilidad, UX con personas, conectividad y aceptación académica están pendientes.
7. Release mantiene configuración histórica con firma debug/minificación deshabilitada; no se publicará como versión final.
8. No hay rúbrica ni planeación oficial desglosada para mapear los IDs A21–A77 con rigor.

## H. Git

No se cambió de rama ni se realizaron commits, push, merge o despliegues. SAFE_INTEGRATION.md documenta el procedimiento futuro, incluyendo preservar archivos sin seguimiento.

## I. Dictamen

El bloque de código viable queda listo para revisión integral con evidencia local automatizada y compilación debug. No está aprobado para producción, distribución ni aceptación académica final. Los bloqueos de contratos, documentos oficiales, eliminación final y pruebas en dispositivo permanecen explícitos.
