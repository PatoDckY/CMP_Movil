# Línea base de rendimiento de la API con Apache JMeter (#96)

Sección 4.6 del documento académico. Plan: [tests/jmeter/cmp-baseline.jmx](../../tests/jmeter/cmp-baseline.jmx).

## Qué mide

Tiempos de respuesta, tasa de error y throughput de los endpoints públicos que la app consume al abrirse y navegar el catálogo, contra `https://cmp-site.vercel.app/api`:

| Petición | Endpoint |
|----------|----------|
| Catálogo | `GET /cursos` |
| Detalle de curso | `GET /cursos/2502` (el mismo curso usado en #92 y #102) |
| Aviso de privacidad | `GET /legal/aviso_privacidad` |
| Términos y condiciones | `GET /legal/terminos_condiciones` |

Cada petición valida código HTTP 200. Hay una pausa de 500 ms entre peticiones.

## Por qué solo lectura y por qué esta escala

- No hay ambiente de staging para CMP_Site, así que la carga va contra producción real. Por eso solo se usan `GET` públicos: nunca `POST /auth/register`, `POST /compras-cursos` ni nada que escriba datos.
- Es una **línea base**, no una prueba de esfuerzo: 10 usuarios virtuales, ramp-up de 10 s, 5 iteraciones (200 peticiones en total, unos 25 segundos de prueba). Sirve para medir el comportamiento normal sin riesgo de afectar el servicio.
- Las pruebas de esfuerzo (carga hasta el punto de quiebre, sección 4.7) quedan fuera de alcance de #96 por decisión del proyecto y no se correrán contra producción sin un ambiente aislado.

## Cómo ejecutarlo

Requiere Apache JMeter 5.x. Desde la raíz del repositorio:

```bash
bash tests/jmeter/run-baseline.sh
```

En PowerShell, equivalente directo (el directorio de salida no debe existir):

```powershell
$out = "tests\jmeter\results\$(Get-Date -Format yyyyMMdd-HHmmss)"
jmeter -n -t tests\jmeter\cmp-baseline.jmx -l "$out\resultados.jtl" -e -o "$out\reporte-html" -j "$out\jmeter.log"
```

Los parámetros se pueden cambiar sin editar el `.jmx` (por ejemplo `-Jusers=5 -Jloops=3`), pero para la línea base oficial se usan los valores por defecto: `host`, `courseId`, `users`, `rampUp`, `loops`.

Resultados en `tests/jmeter/results/<fecha>/` (ignorado por git): `resultados.jtl` y `reporte-html/index.html`.

## Resultado de la corrida

Corrida del 26/10/2026, 8:48 p. m., Apache JMeter 5.6.3, desde el equipo de desarrollo, contra producción (`cmp-site.vercel.app`). Parámetros por defecto: 10 usuarios, ramp-up 10 s, 5 iteraciones. Las cifras se calcularon desde `resultados.jtl`; el percentil 95 usa el método de rango más cercano, por lo que puede diferir en pocos ms del que muestra el reporte HTML.

| Dato | Valor |
|------|-------|
| Total de peticiones | 200 |
| Duración | 32 s |
| Tiempo de respuesta promedio | 747 ms |
| Percentil 95 | 2954 ms |
| Tiempo máximo | 4832 ms |
| Tasa de error | 0 % (200 de 200 con HTTP 200) |
| Throughput | 6.24 peticiones/s |
| APDEX total (T = 500 ms, F = 1.5 s) | 0.757 |

Por endpoint (50 muestras cada uno):

| Endpoint | Promedio (ms) | Mín (ms) | Máx (ms) | p95 (ms) | Error (%) | Tamaño medio |
|----------|---------------|----------|----------|----------|-----------|--------------|
| GET /cursos | 2217 | 537 | 4832 | 4488 | 0 | 124 KB |
| GET /cursos/2502 | 185 | 120 | 605 | 430 | 0 | 1.1 KB |
| GET /legal/aviso_privacidad | 327 | 95 | 1378 | 636 | 0 | 12.5 KB |
| GET /legal/terminos_condiciones | 259 | 83 | 1114 | 577 | 0 | 5.2 KB |

Observaciones:

- Sin errores ni timeouts: el servicio respondió correctamente a toda la carga de línea base.
- Detalle y documentos legales responden en menos de 0.7 s en p95 (APDEX 0.94 a 0.99).
- El catálogo es el punto más lento: 2.2 s de promedio y 4.5 s en p95 (APDEX 0.15). La latencia al primer byte es baja (unos 370 ms); el tiempo restante se va en descargar una respuesta de unos 124 KB. JMeter no pide compresión por defecto, así que en la app, que sí negocia gzip a través del cliente nativo, el tiempo real puede ser menor. Esto no se verificó.
- Recomendación para el backend (fuera del alcance de #96, sin cambios de contrato hechos aquí): confirmar compresión gzip/brotli en `/cursos` y valorar paginación o campos reducidos para el listado.
- Es una línea base de un solo origen y de una sola corrida; no sustituye a una prueba de esfuerzo (sección 4.7, fuera de alcance).
