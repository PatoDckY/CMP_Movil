# Revisión de rendimiento y UX móvil (#96)

Alcance: lado móvil (React Native). Método: lectura de código de las pantallas, view models, repositorios y cliente HTTP, más la suite de Jest. No se midieron tiempos en dispositivo; los hallazgos son estructurales. La línea base de la API está en [PERFORMANCE_BASELINE_JMETER.md](PERFORMANCE_BASELINE_JMETER.md).

## Resultado por criterio

| # | Criterio | Resultado |
|---|----------|-----------|
| 1 | Tiempos de carga de pantallas principales | Cumple. Ninguna pantalla encadena llamadas paralelizables; había un refetch evitable (corregido). |
| 2 | Operaciones con retrasos innecesarios | Cumple con observaciones menores (ver pendientes). |
| 3 | Consultas/cargas optimizadas | Cumple. Una corrección aplicada, sin cambio de contrato con el backend. |
| 4 | Navegación fluida | Cumple. No hay trabajo síncrono pesado durante la navegación. |
| 5 | Indicadores de carga | Cumple. Toda operación lenta muestra spinner o texto de estado. |
| 6 | Optimizaciones no rompen nada | Cumple. Jest 42 suites / 445 pruebas en verde, `tsc` sin errores. |
| 7 | Sin problemas críticos en flujos principales | **Veredicto: sin problemas críticos de rendimiento.** |

## 1. Tiempos de carga

- Catálogo: una sola llamada (`GET /cursos`). Agrupado, categorías y modalidades se calculan con `useMemo` en `useCatalogViewModel`.
- Detalle de curso y de compra: una llamada cada uno. Los métodos de pago llegan dentro del detalle de compra (`detail.paymentMethods`), sin segunda petición.
- Información legal: ya usa `Promise.all` para aviso y términos (`useLegalInformationViewModel`).
- Login: una petición más el guardado de tokens en Keychain; no hay llamadas secuenciales adicionales.
- Todas las peticiones tienen timeout (10 s por defecto, 15 s en catálogo, detalle y refresh), por lo que ninguna pantalla puede quedar esperando indefinidamente.
- **Encontrado:** Mis cursos y el Historial de compras vuelven a pedir los datos cada vez que la pantalla recupera el foco (`useFocusEffect`) y, al hacerlo, reemplazaban la lista por un spinner a pantalla completa aunque ya hubiera datos (parpadeo y trabajo de render innecesario). **Corregido** (ver abajo).

## 2. Retrasos innecesarios

- Listas: el catálogo usa `SectionList` (virtualizada, y las categorías colapsadas entregan `data: []`); notificaciones usa `FlatList` con paginación (`isLoadingMore`).
- Mis cursos, Historial, sesiones del curso y participantes usan `.map` dentro de `ScrollView`. El volumen por usuario es bajo (decenas de elementos como máximo), por lo que no se justifica cambiarlos a `FlatList` en este issue.
- Imágenes: la única `<Image>` es el hero del detalle de curso, con `width/height` definidos y `resizeMode="cover"`; si no hay URL se usa un placeholder sin red.
- `React.memo` en `CourseCard`: no se aplicó. El `onPress` se crea inline en `renderItem`, así que la memoización no evitaría renders sin reestructurar el contrato del componente, y la lista ya está virtualizada. No se sobre-optimiza.

## 3. Correcciones aplicadas

- `useMyCoursesViewModel.loadMyCourses` y `usePurchaseHistoryViewModel.loadPurchases`: si ya hay datos en pantalla (`success` o `empty`) la revalidación al volver a enfocar se hace en segundo plano y conserva el contenido; el spinner a pantalla completa solo aparece en la primera carga o tras un error. Los errores de la revalidación siguen mostrándose igual que antes.
- Nuevas pruebas: [PerformanceRevalidation.test.tsx](../../__tests__/viewmodels/PerformanceRevalidation.test.tsx).
- No se modificó ningún endpoint, DTO ni contrato con el backend.

## 4. Navegación

No se encontró trabajo síncrono pesado en el montaje de las pantallas: las cargas son asíncronas y los cálculos de lista están memoizados. El cambio de la sección 3 reduce además el re-render completo al volver a las pantallas con foco.

## 5. Indicadores de carga

| Operación | Indicador |
|-----------|-----------|
| Restaurar sesión al abrir la app | `ActivityIndicator` (`RootNavigator`) |
| Login | Botón deshabilitado, campos no editables y texto "Iniciando sesión..." (sin spinner gráfico) |
| Catálogo y detalle de curso | `ActivityIndicator` con título |
| Mis cursos, detalle de inscripción, historial y detalle de compra | `ActivityIndicator` |
| Crear compra | Botón deshabilitado con texto "Registrando compra..." (sin spinner gráfico) |
| Reportar pago | `ActivityIndicator` en el botón |
| Materiales del curso | `ActivityIndicator` ("Consultando materiales") |
| Notificaciones, perfil, términos, recuperación y cambio de contraseña, baja de cuenta | `ActivityIndicator` |

Ninguna operación lenta deja una pantalla en blanco o congelada. En login y crear compra el estado es textual más bloqueo del formulario, no un spinner gráfico.

## Pendientes y recomendaciones (no bloqueantes)

1. Agregar un spinner gráfico al botón de login y al de crear compra (cambio visual, se deja para el equipo de UX).
2. Valorar `FlatList` para Historial y Mis cursos si el volumen por usuario crece.
3. Revisar el tamaño de `GET /cursos` (unos 124 KB, 2.2 s promedio en JMeter, ver PERFORMANCE_BASELINE_JMETER.md): compresión y paginación en el backend.
4. Medir en dispositivo real (Android de gama baja) el tiempo de primer render del catálogo; esta revisión es estática.
5. Pruebas de esfuerzo (sección 4.7 del documento académico): fuera del alcance de #96 por decisión del proyecto. No se ejecutan contra producción real sin un ambiente aislado; no se abre issue nuevo.
