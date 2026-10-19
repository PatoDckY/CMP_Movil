# Rediseño institucional de cuenta, privacidad y solicitud A17

> La organización y funcionalidad de este bloque se conservan. El ajuste posterior de azul/amarillo,
> sus comprobaciones y archivos se describen en [VISUAL_IDENTITY_CORRECTION.md](VISUAL_IDENTITY_CORRECTION.md).

Fecha: 2026-10-18. Rama conservada: `fix/A17-sesion-movil`.

## Resultado y alcance

Se implementó el rediseño de las tres pantallas sobre los avances existentes. Mi cuenta organiza datos personales, formación, configuración/privacidad y gestión de cuenta; privacidad presenta lectura por secciones con aviso provisional visible; A17 incorpora formulario protegido y confirmación institucional con folio real. Se mantienen paleta, tipografía del sistema, contratos, seguridad y capas existentes. No se instalaron dependencias ni se modificaron CMP_Site, PostgreSQL, TLS o pinning. No hubo llamadas de escritura a producción, eliminación real, commit, push, merge ni cambio de rama.

Las comprobaciones automatizadas usan repositorios/HTTP/Keychain simulados como en el bloque anterior. No se presentan como validación visual en Samsung ni aceptación académica.

## Mi cuenta y datos visibles

- **Información personal:** nombre y correo legibles, avatar discreto y acceso a consulta/edición de datos. Se retiraron de la vista los renglones de ID y rol; se evita duplicar el nombre y correo en otra tarjeta.
- **Mi formación:** se conservan Mis cursos e Historial de compras.
- **Configuración y privacidad:** acceso a Privacidad y términos, explicación de seguridad y Cerrar sesión. Se conserva la comunicación diferenciada de fallos locales y remotos del logout.
- **Gestión de cuenta:** última sección de acciones, separada por divisor y 48 puntos de margen/padding superior. Explicación de revisión, botón neutro con borde y etiqueta «Solicitar eliminación de cuenta». Este botón abre A17; no realiza una solicitud. La confirmación expresa y la contraseña actual se exigen en la pantalla siguiente.

Las pruebas verifican ausencia de ID y rol interno en el texto visible de Mi cuenta, en la edición ordinaria y en privacidad. `user.id` y `user.role` permanecen en modelos y autorización; la acción A17 continúa restringida al rol autorizado. El folio del recibo A17 es un identificador de seguimiento requerido por el usuario y se conserva visible.

## Privacidad y términos

Encabezado «Centro Médico Pichardo» y título de sección; aviso destacado **Información pendiente de aprobación institucional**; tarjetas de Aviso de privacidad, Tratamiento y protección de datos personales, Derechos sobre tus datos, Uso de la aplicación, Términos y condiciones de uso y Solicitudes relacionadas con la cuenta. Tiene scroll vertical, texto de 16 puntos y 25 de interlínea, ancho máximo de lectura de 640 y regreso explícito a la pantalla anterior, tanto pública como privada.

Se buscaron documentos y referencias en el proyecto (`docs/`, pantallas, configuración y contratos documentados). Solo se encontró la información provisional y la evidencia previa de rutas legales sin documento aprobado verificado, descrita en `BACKEND_CONTRACTS.md`. No se añadieron enlaces a destinos no verificados, domicilios, correos, plazos, fundamentos normativos ni garantías nuevas. El texto describe funciones existentes y señala los documentos y canal oficial pendientes. No hay casillas de aceptación ni registro ficticio de consentimiento legal.

## Solicitud A17 y recibo

La cabecera identifica la institución y presenta «Solicitud de eliminación de cuenta». La explicación previa diferencia registro y eliminación, revisión de datos, posible conservación conforme a obligaciones aplicables sin atribuir plazos/fundamentos no verificados, y folio de seguimiento.

El formulario reutiliza PasswordField: etiqueta de contraseña actual, protección por defecto, mostrar/ocultar, máximo 200 caracteres, entradas deshabilitadas durante envío. El checkbox no está seleccionado inicialmente. `canSubmit` se deriva en el ViewModel de contraseña válida, confirmación, rol, ausencia de envío y ausencia de recibo; el botón consume ese estado. Se mantienen también todas las validaciones defensivas en submit y Repository. Hay errores anunciables, indicador de procesamiento y prevención de duplicados. La visibilidad vuelve a oculta al enviar y el campo se limpia mediante la lógica existente. `KeyboardAwareScrollView` usa `bottomOffset=32` y conserva toques de controles con teclado.

El contrato permanece **DELETE /api/account**, Bearer y exactamente `{contrasena, confirmacion:true}`. Solo HTTP 202 y recibo válido permiten confirmar. El recibo presenta «Solicitud registrada correctamente», mensaje real del backend (incluida solicitud existente), folio real seleccionable y estado real. Para pendiente explica la revisión; para respondida conserva ese estado y evita afirmar que sigue pendiente o que se completó la eliminación. Siempre aclara que no se ha completado y mantiene la sesión. «Volver a Mi cuenta» regresa mediante `popTo('Account')`.

No se persistieron ni registraron contraseñas. La memoria temporal necesaria para verificar la solicitud y la política de borrado al enviar permanecen sin cambios. Los errores de contraseña, sesión, red, servidor, timeout y recibos incompletos continúan cubiertos por las suites de contrato y regresión.

## Archivos de este bloque y arquitectura

| Archivos | Justificación |
|---|---|
| `src/screens/account/AccountScreen.tsx`, `AccountScreen.styles.ts` | Organización por secciones, eliminación de datos internos visibles y separación de gestión |
| `src/screens/account/LegalInformationScreen.tsx`, nuevo `LegalInformationScreen.styles.ts` | Lectura institucional, aviso provisional, tarjetas y acción de regreso |
| `src/screens/account/AccountDeletionScreen.tsx`, `AccountDeletionScreen.styles.ts` | Formulario, interacción de contraseña, teclado, errores y recibo |
| Nuevos `src/components/account/AccountPresentation.tsx` y `.styles.ts` | InstitutionalHeader, AccountSection y AccountAction reutilizables; solo presentación |
| `src/components/auth/PasswordField.tsx` y `.styles.ts` | Props tipadas de accesibilidad, estado editable, contraseña actual y tamaño cómodo, conservando valores predeterminados para otros usos |
| `src/components/common/PrimaryButton.tsx` y `.styles.ts` | Variante outline institucional y tamaño cómodo opcionales; valores predeterminados conservados |
| `src/viewmodels/account/useAccountDeletionViewModel.ts` | Única extensión funcional: estado derivado canSubmit; contrato, envío, limpieza y exclusión de duplicados conservados |
| Nueva `__tests__/account/InstitutionalScreens.test.tsx` | 17 casos de componentes reales de las tres pantallas |
| `__tests__/navigation/AccountNavigation.test.tsx` | Etiqueta actual y props de navegación tipadas; conserva aserciones de seguridad y funcionalidad |
| `README.md`, matrices, `GIT_STATE.md` y este informe | Resultados y trazabilidad actualizados; informes anteriores conservados como históricos |

MVVM permanece `Screen → ViewModel → Repository → Service → HTTP`: las pantallas no contienen fetch ni endpoints y no se cambiaron servicios/repositorios/DTO/mappers por este rediseño. Los componentes de cuenta tienen responsabilidad exclusiva de presentación; la habilitación del envío se deriva en el ViewModel y sus dependencias se siguen inyectando por contratos desde `dependencies.ts`. Se reutilizan Repository, DI, Factory de autenticación y Observer/Context existentes, sin agregar patrones artificiales ni navegación desde el ViewModel. La visibilidad de contraseña es estado local de presentación.

## Validaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| Jest completo: `node node_modules/jest/bin/jest.js --runInBand --silent` | **201/201 pruebas, 19/19 suites**, 0 fallos y 0 snapshots; 4.775 s. Base anterior: 184/18; 17 pruebas nuevas |
| TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Código 0, sin diagnósticos |
| ESLint completo: `node node_modules/eslint/bin/eslint.js .` | Código 0, 0 errores, 10 advertencias `no-void` preexistentes |
| `git diff --check` | Código 0; advertencias de normalización LF→CRLF, sin errores de whitespace en diferencias |
| Android debug offline: `android/gradlew.bat :app:assembleDebug --offline --no-daemon --console=plain` | **BUILD SUCCESSFUL**, 2m 33s; 292 tareas, 62 ejecutadas y 230 up-to-date. Caché Gradle local y JBR de Android Studio |
| Bundle Android dev con Metro | Código 0, bundle en TEMP y 24 assets; sin publicación |
| ADB | Detectado Samsung SM-G998U; no se instaló ni abrió la app en esta revisión |

Los 17 casos nuevos comprueban datos personales sin ID/rol, separación y navegación de acciones, mensajes de fallos del logout, edición ordinaria, las seis secciones legales y regreso, carácter provisional sin consentimiento, contraseña actual protegida y toggle, ambas condiciones obligatorias del botón, procesamiento, limpieza, duplicados, mensaje/folio/estado real, conservación de sesión, estado respondida, errores sanitizados y configuración de scroll/encabezados. Las suites existentes siguen comprobando Bearer, JSON exacto, 202, inválidos, timeout, autorización y seguridad del logout.

Advertencias conservadas: diez `no-void` en PersonalDataScreen (1), MyCourseDetailScreen (3), PurchaseDetailScreen (4) y PurchaseHistoryScreen (2). Metro recuperó un error al deserializar su caché mediante recorrido completo y finalizó correctamente; avisa además del import privado ReactNativeFeatureFlags. Gradle conserva avisos de opciones y APIs de variantes obsoletas y compatibilidad futura con Gradle 10. No se silenciaron con cambios de dependencias o configuración.

Fallos intermedios de pruebas: el nuevo helper de texto asumía hijos planos de Text y la selección de Pressable no coincidía con los wrappers del preset React Native; se corrigieron leyendo los nodos renderizados y los controles por rol/evento, manteniendo las aserciones. Se ajustó también el cast tipado del mock de KeyboardAwareScrollView. No fueron fallos del contrato productivo ni quedaron errores finales. ADB inicialmente falló al crear su directorio bajo aislamiento; el reintento autorizado confirmó el teléfono conectado.

## Accesibilidad y límites de verificación

Se reutilizan colores oficiales del proyecto, sin incorporar una identidad nueva: azul `primary`, blancos, fondos suaves y acento solo informativo. Texto principal 16, secundarios 14–15, encabezados 19–28; botones de mínimo 56 puntos y acciones de 64; contenido flexible y sin número máximo de líneas en los textos. Los textos de lectura conservan escalado de fuente. Los monogramas y flechas decorativos no se escalan y no son controles. Roles de botón/checkbox/encabezado, etiquetas, estados disabled/checked y regiones de anuncio en error/recibo están definidos.

Contraste calculado de los pares de texto usados: primary/blanco 11.31:1, primary/primarySoft 9.99:1, texto/blanco 17.93:1, texto/accentSoft 17.03:1, secundario/blanco 4.83:1 y secundario/background 4.58:1. Son cálculos de los tokens, no una evaluación visual ni certificación de accesibilidad completa. Los controles deshabilitados se distinguen con la opacidad existente y estado semántico.

SafeArea se mantiene en el contenedor existente de App, sin duplicar insets; las pantallas limitan ancho de lectura y usan desplazamiento vertical. Continúan pendientes TalkBack real, foco y anuncios tras cambio de recibo, escalado grande, teclado Samsung, tamaños/orientación y validación visual del diseño en teléfono. Se detectó el Samsung, pero la aplicación conserva URL de producción y no existe un entorno Android aislado configurado; no se ejecutaron flujos reales ni se atribuye una revisión visual que no se realizó. No se compilaron iOS ni release.

La documentación legal aprobada, canal institucional verificado y consentimiento versionado permanecen pendientes. Este rediseño no acredita eliminación final, cumplimiento jurídico, aprobación académica ni publicación. Se conservan los límites de seguridad y backend documentados en la validación anterior.

## Estado completo de Git

Rama: `fix/A17-sesion-movil`. 43 archivos rastreados modificados, 41 archivos nuevos sin seguimiento, 84 archivos acumulados y 0 staged.

El bloque comenzó con 40 modificados y 36 nuevos; se conservan todos. `git diff --stat` solo incluye archivos rastreados: los nuevos se enumeran individualmente más abajo, sin staging. `git diff --check`: código 0, sin errores; advertencias LF→CRLF documentadas.

### git status --short

```text
 M README.md
 M __tests__/repositories/AuthRepositoryImpl.test.ts
 M __tests__/services/httpClient.test.ts
 M docs/architecture/MVVM.md
 M jest.config.js
 M src/components/auth/FormField.tsx
 M src/components/auth/PasswordField.styles.ts
 M src/components/auth/PasswordField.tsx
 M src/components/common/PrimaryButton.styles.ts
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
 M src/screens/account/AccountScreen.styles.ts
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
?? src/components/account/
?? src/mappers/accountMapper.ts
?? src/models/AccountDeletion.ts
?? src/models/LogoutError.ts
?? src/models/purchaseValidation.ts
?? src/repositories/contracts/AccountRepository.ts
?? src/repositories/implementations/AccountRepositoryImpl.ts
?? src/screens/account/AccountDeletionScreen.styles.ts
?? src/screens/account/AccountDeletionScreen.tsx
?? src/screens/account/LegalInformationScreen.styles.ts
?? src/screens/account/LegalInformationScreen.tsx
?? src/services/contracts/AccountService.ts
?? src/services/dto/AccountDto.ts
?? src/services/implementations/accountService.ts
?? src/services/security/sessionEvents.ts
?? src/viewmodels/account/useAccountDeletionViewModel.ts
?? src/viewmodels/catalog/catalogFilters.ts
```

### git diff --stat

```text
 README.md                                          |   8 +
 __tests__/repositories/AuthRepositoryImpl.test.ts  |  19 +-
 __tests__/services/httpClient.test.ts              |  25 +-
 docs/architecture/MVVM.md                          |   8 +-
 jest.config.js                                     |   1 +
 src/components/auth/FormField.tsx                  |   3 +-
 src/components/auth/PasswordField.styles.ts        |  17 +-
 src/components/auth/PasswordField.tsx              |  65 +++-
 src/components/common/PrimaryButton.styles.ts      |  15 +-
 src/components/common/PrimaryButton.tsx            |  75 ++---
 src/config/dependencies.ts                         |   4 +
 src/mappers/profileMapper.ts                       |   8 +
 src/mappers/userMapper.ts                          |  10 +-
 src/navigation/AuthenticatedNavigator.tsx          |   5 +
 src/navigation/PublicNavigator.tsx                 |   4 +-
 src/navigation/RootNavigator.tsx                   |   5 +-
 src/navigation/types.ts                            |   3 +
 .../implementations/AuthRepositoryImpl.ts          |  85 ++++-
 .../implementations/MyCoursesRepositoryImpl.ts     |   3 +
 .../implementations/PurchaseRepositoryImpl.ts      |  12 +
 src/screens/account/AccountScreen.styles.ts        | 174 +++-------
 src/screens/account/AccountScreen.tsx              | 365 ++++++---------------
 src/screens/account/PersonalDataScreen.tsx         |   7 +-
 src/screens/catalog/CatalogScreen.tsx              |  70 +---
 src/screens/home/HomeScreen.tsx                    |   5 +-
 src/screens/purchases/CreatePurchaseScreen.tsx     | 117 +------
 src/screens/purchases/PurchaseDetailScreen.tsx     |  39 +--
 src/services/contracts/AuthService.ts              |   4 +-
 src/services/http/httpClient.ts                    | 130 +++++++-
 src/services/implementations/authService.ts        |  14 +-
 src/services/implementations/courseService.ts      |   9 +-
 src/services/implementations/myCourseService.ts    |   2 +
 src/services/implementations/profileService.ts     |   2 +
 src/services/implementations/purchaseService.ts    |   8 +
 src/services/security/tokenStorage.ts              | 169 +++++++---
 src/session/SessionContext.tsx                     |  78 ++++-
 src/viewmodels/account/useProfileViewModel.ts      |  11 +-
 src/viewmodels/auth/useLoginViewModel.ts           |   9 +-
 src/viewmodels/auth/useRegisterViewModel.ts        |  14 +-
 src/viewmodels/catalog/useCatalogViewModel.ts      |  18 +-
 src/viewmodels/catalog/useCourseDetailViewModel.ts |  23 +-
 .../purchases/usePurchaseDetailViewModel.ts        |  50 +--
 src/viewmodels/purchases/usePurchaseViewModel.ts   |  73 +----
 43 files changed, 870 insertions(+), 896 deletions(-)
```

### Archivos nuevos sin seguimiento: listado completo

```text
__tests__/academic/MyCourses.test.tsx
__tests__/account/AccountDeletion.test.tsx
__tests__/account/InstitutionalScreens.test.tsx
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
docs/quality/INSTITUTIONAL_REDESIGN.md
docs/quality/INTEGRAL_VALIDATION.md
docs/quality/SAFE_INTEGRATION.md
docs/quality/TEST_MATRIX.md
src/components/account/AccountPresentation.styles.ts
src/components/account/AccountPresentation.tsx
src/mappers/accountMapper.ts
src/models/AccountDeletion.ts
src/models/LogoutError.ts
src/models/purchaseValidation.ts
src/repositories/contracts/AccountRepository.ts
src/repositories/implementations/AccountRepositoryImpl.ts
src/screens/account/AccountDeletionScreen.styles.ts
src/screens/account/AccountDeletionScreen.tsx
src/screens/account/LegalInformationScreen.styles.ts
src/screens/account/LegalInformationScreen.tsx
src/services/contracts/AccountService.ts
src/services/dto/AccountDto.ts
src/services/implementations/accountService.ts
src/services/security/sessionEvents.ts
src/viewmodels/account/useAccountDeletionViewModel.ts
src/viewmodels/catalog/catalogFilters.ts
```


Los avances anteriores están incluidos en estas cifras; no se descartó ni preparó ningún archivo para commit. El listado separa el acumulado de la rama de los archivos de este bloque descritos arriba. El APK y el bundle son artefactos locales ignorados o en TEMP.
