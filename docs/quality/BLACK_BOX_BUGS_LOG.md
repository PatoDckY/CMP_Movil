# Registro de errores de caja negra — CMP_Movil

Issue relacionado: A68 (#100). Aquí se anotan los defectos encontrados al ejecutar [BLACK_BOX_TEST_MATRIX.md](BLACK_BOX_TEST_MATRIX.md) en dispositivo real, y el seguimiento de su corrección, sobre todo en Release.

## Cómo usar este registro

1. Cuando un caso de la matriz marque `FALLA`, agrega una fila con un ID `BUG-NN` consecutivo y el ID del caso (`BB-NN`).
2. Anota en **Build** dónde ocurre: `Debug`, `Release` o `Ambos`. Un fallo solo en Release suele indicar un problema de minificación o de JavaScript embebido.
3. Describe los pasos para reproducirlo y la diferencia entre lo esperado y lo observado.
4. Al corregirlo, llena **Corregido en commit** con el hash, y **Verificado en Release** tras repetir el caso en el build Release nuevo.
5. No borres filas: cambia el estado.

## Severidad

| Nivel | Criterio |
|---|---|
| Crítica | Cierra la app, impide iniciar sesión o comprar, o expone datos de otra persona. Bloquea la liberación. |
| Alta | Un flujo principal no se completa o muestra datos incorrectos, con rodeo posible. |
| Media | Error de validación, mensaje confuso o estado de carga/vacío incorrecto. |
| Baja | Detalle visual o de texto sin efecto en el flujo. |

## Estados

`Abierto` → `En corrección` → `Corregido` → `Verificado` (repetido en Release) · `No reproducible` · `Descartado` (con motivo en Observaciones).

## Defectos

| ID | Caso | Módulo | Build | Severidad | Pasos para reproducir | Esperado | Observado | Estado | Corregido en commit | Verificado en Release (fecha) | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BUG-01 | | | | | | | | | | | |
| BUG-02 | | | | | | | | | | | |
| BUG-03 | | | | | | | | | | | |
| BUG-04 | | | | | | | | | | | |
| BUG-05 | | | | | | | | | | | |

## Datos del dispositivo de prueba

| Dato | Valor |
|---|---|
| Modelo | |
| Versión de Android | |
| Versión de la app (`versionName`) | 1.0 |
| Entorno de API usado | |
| Fecha de la ronda | |

## Resumen de la ronda

| Concepto | Debug | Release |
|---|---|---|
| Casos ejecutados | | |
| Casos OK | | |
| Casos con FALLA | | |
| Casos N/A | | |
| Defectos críticos abiertos | | |

Un defecto crítico abierto debe resolverse y verificarse en Release antes de continuar con la liberación.
