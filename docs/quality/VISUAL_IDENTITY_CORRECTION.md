# Corrección de identidad visual — CMP_Movil

Fecha: 2026-10-18. Rama: `fix/A17-sesion-movil`.

## Referencias verificadas en el código

Se inspeccionaron HomeScreen, CatalogScreen, CourseDetailScreen, LoginScreen, RegisterScreen, AuthBrand, CourseCard, SectionHeader y PrimaryButton, con sus estilos. La identidad real combina:

- `colors.primary` **#0A3D62**: encabezados, títulos, controles y botones azules.
- `colors.accent` **#FFC300**: monogramas, iconos, indicadores, botones de énfasis y detalles amarillos.
- `surface`, `background`, `primarySoft`, `accentSoft`, `text`, `textSecondary` y `border`: lectura y tarjetas claras, tomados del mismo `src/theme/colors.ts`.
- Tipografía nativa existente, títulos y acciones de peso 900, tarjetas de borde fino y radios 12–26; contenedores con margen de 20 y rellenos de 20–24. Las referencias usan superficies planas, por lo que no se agregaron sombras.

No se añadieron códigos HEX a los componentes ni se modificó la paleta. Se conservan cuerpos de lectura de 14–16 puntos y zonas táctiles cómodas del bloque anterior.

## Corrección aplicada

**Las tres pantallas** reutilizan InstitutionalHeader con superficie azul y radio 26 como el hero de Home/Login, marca CMP amarilla, título blanco de peso 900 y descripción `primarySoft`. AccountSection mantiene tarjetas blancas con encabezados azules y un indicador amarillo; AccountAction conserva navegación y etiquetas, con indicador amarillo y flecha azul. El estilo se centraliza en los componentes de cuenta existentes.

**Mi cuenta:** avatar azul con inicial amarilla; nombre y títulos más consistentes con catálogo/login; nota de sesión con acento amarillo. Gestión de cuenta continúa como última sección independiente, con separación de 48 puntos, divisor amarillo y botón con borde azul. No se muestran ID ni rol. Ninguna acción, ruta o validación se modificó.

**Privacidad y términos:** conserva las seis secciones y literalmente el contenido provisional, sin cambiar políticas ni añadir textos jurídicos. El aviso mantiene fondo `accentSoft`, con borde amarillo y título azul. El botón de regreso utiliza la variante azul existente de PrimaryButton.

**A17:** tarjeta informativa con acento amarillo, confirmación azul con marca amarilla como en registro, botón principal azul con flecha amarilla mediante `showArrow`, y recibo blanco con icono azul/amarillo. El recuadro de seguimiento utiliza el patrón del resumen de CourseDetail: fondo azul, folio amarillo y estado claro. La acción de regreso usa la variante `accent` ya disponible. No se incorporó verde ni un estado visual de eliminación completada; permanecen el folio real, el estado real y la aclaración de solicitud registrada.

Se mantienen contraseña actual, mostrar/ocultar, confirmación, errores, protección contra duplicados, teclado, SafeArea y sesión. No cambian ViewModels, Repository, Service, HTTP ni contratos.

## Archivos de presentación modificados en este bloque

1. `src/components/account/AccountPresentation.tsx`: presentación común del encabezado, sección y acción.
2. `src/components/account/AccountPresentation.styles.ts`: colores, títulos, radios e indicadores compartidos.
3. `src/screens/account/AccountScreen.styles.ts`: avatar, pesos, nota y divisor de gestión.
4. `src/screens/account/LegalInformationScreen.styles.ts`: aviso y título.
5. `src/screens/account/LegalInformationScreen.tsx`: únicamente variante visual del botón de regreso.
6. `src/screens/account/AccountDeletionScreen.styles.ts`: acentos, confirmación y recibo.
7. `src/screens/account/AccountDeletionScreen.tsx`: estilos de seguimiento y variantes visuales de botones.
8. `src/components/common/PrimaryButton.styles.ts`: peso 900 en el tamaño cómodo, usado actualmente por estas tres pantallas; conserva las dimensiones y variantes existentes.

Documentación: este informe, enlace del README, referencia desde el informe anterior y captura vigente en GIT_STATE.md. Todos los avances previos se conservan.

## Verificación técnica y funcional

| Comprobación | Resultado |
|---|---|
| Jest completo (`node node_modules/jest/bin/jest.js --runInBand --silent`) | 201/201 pruebas, 19/19 suites, sin fallos; 5.902 s |
| TypeScript (`node node_modules/typescript/bin/tsc --noEmit --incremental false`) | Código 0, sin errores |
| ESLint (`node node_modules/eslint/bin/eslint.js .`) | Código 0; sin errores, 10 advertencias `no-void` preexistentes |
| `git diff --check` | Código 0; sin errores de whitespace en diferencias |
| Android (`:app:assembleDebug --offline --no-daemon --console=plain`) | BUILD SUCCESSFUL en 51 s; 292 tareas, 38 ejecutadas y 254 up-to-date |
| Metro bundle Android dev | Código 0, bundle en TEMP y 24 assets |
| Integridad de capas funcionales | Comparación SHA-256 antes/después: contenido idéntico en services, repositories, models, session y viewmodels |

Se ejecutan las pruebas existentes, incluidos los 17 casos de InstitutionalScreens y los contratos/regresiones A17, navegación, perfil y logout. No se modificaron aserciones ni datos de prueba para acomodar estilos. No se añadieron tests que solo reproduzcan las constantes CSS/StyleSheet.

La correspondencia visual se verificó inspeccionando los componentes y estilos contra las referencias del proyecto; no hubo capturas ni revisión visual en Samsung. Los pares principales se calcularon con los tokens existentes: contraste amarillo/azul 7.03:1, blanco/azul 11.31:1 y `primarySoft`/azul 9.99:1. El amarillo se usa sobre azul o como fondo de texto azul; no como texto de lectura sobre blanco. Los detalles decorativos no sustituyen etiquetas ni estados semánticos.

Persisten las 10 advertencias preexistentes de ESLint en PersonalDataScreen, MyCourseDetailScreen, PurchaseDetailScreen y PurchaseHistoryScreen. Gradle conserva avisos de opciones y APIs antiguas y compatibilidad futura con Gradle 10. Metro informó caché no deserializable, recuperó el recorrido completo y terminó; conserva el aviso de ReactNativeFeatureFlags fuera de exports. Git advierte normalización LF→CRLF. No se cambiaron dependencias ni protecciones para silenciar esos avisos.

## Límites y estado de entrega

Pendientes: revisión visual y de fuente grande, teclado y TalkBack en Samsung, además de documentos legales aprobados y canal institucional verificado. No se afirma accesibilidad completa ni aceptación en dispositivo por pasar Jest o compilar. Las dimensiones flexibles, escalado de lectura, roles, etiquetas y áreas táctiles anteriores se conservan.

No se hicieron solicitudes a producción, cambios de backend/base de datos ni operaciones de integración Git. La rama se conserva sin commit, push, merge ni staging. El inventario y las salidas completas de Git están en [GIT_STATE.md](GIT_STATE.md), incluidos los archivos nuevos. El informe anterior conserva el detalle funcional del rediseño y sus límites.
