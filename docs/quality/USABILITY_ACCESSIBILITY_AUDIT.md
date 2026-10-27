# Auditoría de usabilidad y accesibilidad — CMP_Movil (#103)

Fecha: 2026-10-26. Código auditado: `develop` en `d6a2a3b`.

## Alcance y límites (leer primero)

**Esta pasada fue de código y cálculo, no de dispositivo.** No había ningún dispositivo ni emulador conectado (`adb devices` vacío), así que:

- **TalkBack no se ejecutó.** Lo que se revisó son las propiedades de accesibilidad en el código (`accessibilityRole`, `accessibilityLabel`, estados). Eso no demuestra que el flujo sea usable con TalkBack. `COMPLIANCE_MATRIX.md` ya lo marcaba como pendiente y **sigue pendiente**.
- **Orientación, teclado tapando campos y tiempos de carga reales no se probaron en pantalla.** Sobre ellos solo hay evidencia de configuración y código (sección 7).
- Contraste y tamaños se calcularon a partir de `src/theme/colors.ts` y los estilos, no se midieron sobre capturas.

Pantallas cubiertas: inicio, login, registro, recuperación, catálogo, detalle de curso, compra, detalle de compra y reporte de pago, historial, Mis cursos, detalle de Mis cursos, cuenta, datos personales, cambio de contraseña, notificaciones, información legal y eliminación de cuenta.

## Resumen

| # | Criterio | Resultado |
|---|---|---|
| 1 | Navegación principal comprensible | **Cumple** (código); sin prueba en dispositivo |
| 2 | Textos y mensajes legibles | **Parcial**: contraste correcto, tamaños de fuente pequeños (hallazgo U1) |
| 3 | Controles principales identificables | **Cumple**, con roles faltantes corregidos |
| 4 | Formularios con retroalimentación clara | **Parcial**: validación presente en todos, estilo inconsistente (U3) |
| 5 | Mensajes de error adecuados | **Cumple** |
| 6 | Tamaño de elementos interactivos | **Cumple** tras ajustar áreas táctiles; sin medición en dispositivo |
| 7 | Comportamiento de pantallas principales | **Pendiente de prueba en dispositivo** |
| 8 | Problemas relevantes documentados | **Cumplido** (sección Hallazgos) |
| — | TalkBack | **Pendiente**: propiedades revisadas y corregidas en código; sin pasada real |

## 1. Navegación principal comprensible

- Dos navegadores de pila nativa (`PublicNavigator`, `AuthenticatedNavigator`), con encabezado y botón de regreso del sistema en cada pantalla; los flujos de compra y de cuenta son pilas lineales, sin pantallas huérfanas (#90).
- La compra no es un asistente de varios pasos: se reserva en una pantalla (`CreatePurchase`) y el pago se reporta en el detalle de la compra (`PurchaseDetail`). Al no haber pasos numerados, no hay indicador de progreso que faltar; el estado de la compra (pendiente, pago reportado, etc.) se muestra en el detalle.
- Las pantallas de login y registro ofrecen "Regresar al inicio"; el detalle de curso sin sesión envía a login y vuelve a la compra (`AuthContinuation.test.tsx`).
- Sin hallazgos. Pendiente de confirmar en dispositivo.

## 2. Textos y mensajes legibles

**Contraste** (WCAG AA texto normal: 4,5:1), calculado con la fórmula de luminancia relativa:

| Combinación | Razón | Resultado |
|---|---|---|
| `text` sobre fondo / superficie | 16,99 / 17,93 | Cumple |
| `textSecondary` sobre fondo / superficie | 4,58 / 4,83 | Cumple (justo) |
| `textSecondary` sobre `primarySoft` | **4,27** | No cumple (U2) |
| `textSecondary` sobre `accentSoft` | 4,59 | Cumple (justo) |
| Blanco sobre `primary` | 11,31 | Cumple |
| `primary` sobre `accent` (botón amarillo) | 7,03 | Cumple |
| `error` sobre blanco / fondo | 4,83 / 4,58 | Cumple |
| `success` | 2,28 | Solo se usa como fondo de indicadores, no como texto |
| Borde de campos (`border`) sobre blanco | 1,24 | Por debajo de 3:1 para componentes de interfaz (U2) |

**Tamaño de fuente (U1)**: de 455 declaraciones `fontSize` en `src/`, **150 son menores de 12 sp y 59 menores de 10 sp** (8–9 sp en textos de apoyo de botones, pies de página, encabezados de sección, etiquetas de detalle y tarjetas). La etiqueta de los botones primarios es de 12 sp y la de los campos de formulario de 11 sp. La app respeta el tamaño de fuente del sistema (solo los distintivos decorativos de `AccountPresentation` usan `allowFontScaling={false}`), lo que ayuda a quien lo aumenta, pero en el tamaño predeterminado el texto es pequeño para lectura cómoda (referencia: 12 sp mínimo, 14 sp para cuerpo).

**Texto cortado**: solo hay 4 usos de `numberOfLines` (título e información de `CourseCard`, resumen legal y una línea en la compra); no se encontró truncado que pierda sentido.

## 3. Controles principales identificables

- Los botones primarios usan `PrimaryButton` (fondo sólido o contorno, flecha), con estado deshabilitado distinguible.
- **Corregido**: 16 `Pressable` no tenían `accessibilityRole`, por lo que TalkBack no los anunciaba como botones. Se añadió `accessibilityRole="button"` (Home, Dashboard, Registro, Catálogo, tarjetas de curso y categoría, acciones del panel, botón "Acceder", añadir participante). `GenderButton` pasó a `radio` con `accessibilityState.selected`, y `CategoryCard` expone `expanded`/`disabled`.
- Los controles solo-icono (mostrar contraseña, limpiar búsqueda) ya tenían rol y etiqueta.

## 4. Formularios con retroalimentación clara

- Todos los formularios tienen validación y mensaje: registro (por campo, edad, contraseña, términos), login, recuperación, cambio de contraseña, datos personales, baja de cuenta, reserva y reporte de pago. Los campos deshabilitan la edición mientras se envía.
- **U3 (inconsistencia)**: login y registro muestran los errores en un `Alert` nativo; recuperación, cambio de contraseña, baja de cuenta y datos personales los muestran en línea. Funciona, pero la experiencia no es uniforme.
- **Corregido**: los campos de observaciones de la compra y de monto, referencia y observaciones del reporte de pago no tenían `accessibilityLabel` (el texto de arriba no se asocia al campo en React Native), así que TalkBack solo leería el marcador de posición. Ya tienen etiqueta.
- **Corregido**: en login, la tecla "siguiente" del correo no movía el foco a la contraseña; ahora lo hace, y se declaró el autocompletado (`autoComplete`/`textContentType`) para gestores de contraseñas.

## 5. Mensajes de error

- Redactados en español, dicen qué falló y, en general, ofrecen reintento ("No fue posible cargar tus cursos" con botón "Reintentar"). Red: "No fue posible conectarse con el servidor. Revisa tu conexión…" (#90). 5xx: texto genérico sin detalles internos.
- Cruce con #94: los mensajes de autenticación son claros para el usuario y no incluyen trazas; la filtración de existencia de cuenta (H1) es del backend, no del texto del móvil.
- **Corregido**: los textos de error en línea no se anunciaban a los lectores de pantalla; se añadió `accessibilityRole="alert"` en cambio de contraseña, baja de cuenta, datos personales, recuperación, detalle de curso, Mis cursos y su detalle (Notificaciones y filtros del catálogo ya lo tenían).

## 6. Tamaño de elementos interactivos

Referencia: 44 × 44 dp. La mayoría de controles ya la cumplen: botones primarios `minHeight` 50–56, filtros 48, género 46, reintentos de Mis cursos e historial 44, interruptores nativos y fila completa de términos (casilla de 24 dp dentro de un `Pressable` que ocupa toda la fila).

Por debajo de 44 y **corregidos con `hitSlop`**: botón "×" de la búsqueda (32 × 32), botón "Mi cuenta" del panel (relleno vertical 9), reintento de Notificaciones (relleno 10), reintento del catálogo (relleno 12) y los enlaces de texto "Crear cuenta" (Home) y "Limpiar búsqueda y filtros". El botón "Acceder" del encabezado ya tenía `hitSlop`. No se midió el área efectiva en dispositivo.

## 7. Comportamiento de las pantallas principales

Evidencia de código, **sin prueba en dispositivo**:

- **Teclado**: `windowSoftInputMode="adjustResize"` y `KeyboardProvider` global; login, registro, recuperación, cambio de contraseña, datos personales, baja, compra y reporte de pago usan `KeyboardAwareScrollView`/`keyboardShouldPersistTaps`.
- **Orientación**: no hay bloqueo en el manifiesto y `configChanges` incluye `orientation|screenSize`, así que la actividad no se recrea al rotar; todas las pantallas usan contenedores desplazables. No se verificó el aspecto en horizontal.
- **Carga**: catálogo, detalle, Mis cursos, notificaciones, historial, detalle de compra y formularios de cuenta usan `ActivityIndicator`; login y registro muestran el estado de carga en el propio botón ("Iniciando sesión…") y deshabilitan campos.

## Hallazgos pendientes de decisión

| ID | Hallazgo | Severidad | Por qué no se tocó |
|---|---|---|---|
| U1 | 150 de 455 tamaños de fuente < 12 sp (59 < 10 sp); etiquetas de botón 12 sp y de campo 11 sp | **Media** | Subirlos altera la maquetación de casi todas las pantallas: es un rediseño tipográfico |
| U2 | `textSecondary` sobre `primarySoft` 4,27:1 (< 4,5); borde de campos 1,24:1 | **Baja** | Cambiar el color global afecta toda la paleta; conviene decidirlo junto con U1 |
| U3 | Errores de login y registro en `Alert`, el resto en línea | **Baja** | Cambio de patrón de interfaz |
| U4 | Pasada con TalkBack real, orientación, teclado y carga en dispositivo | **Media** (riesgo de accesibilidad sin verificar) | Requiere dispositivo físico |

## Corregido en este PR

Solo cambios de bajo riesgo en UI, sin cambiar el aspecto:

- `accessibilityRole` (botón, radio) y estados en 16 controles; `hitSlop` en 6 controles pequeños.
- `accessibilityLabel` en 4 campos de texto; `accessibilityRole="alert"` en 8 mensajes de error.
- Login: foco a la contraseña con "siguiente" y autocompletado declarado.

Verificación: `tsc` sin errores, ESLint 0 errores (16 advertencias `no-void` preexistentes), Jest 41 suites / 443 pruebas en verde.

## Procedimiento pendiente en dispositivo

1. Activar TalkBack (Ajustes → Accesibilidad) y recorrer login → catálogo → detalle de curso → Mis cursos; confirmar orden de lectura, que cada control se anuncie con rol y nombre, y que los errores se lean.
2. Con tamaño de fuente y de pantalla al máximo: confirmar que no se corta texto en las pantallas principales (U1).
3. Rotar a horizontal en login, registro y compra; abrir el teclado en los campos inferiores del registro y del reporte de pago.
4. Medir el tiempo y el indicador de carga en login, catálogo y reserva con red lenta.
