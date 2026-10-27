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

Pendiente de completar con los números del reporte HTML de JMeter.

| Dato | Valor |
|------|-------|
| Fecha y hora | |
| Versión de JMeter | |
| Red / equipo de origen | |
| Total de peticiones | |
| Tiempo de respuesta promedio (ms) | |
| Percentil 95 (ms) | |
| Tiempo máximo (ms) | |
| Tasa de error (%) | |
| Throughput (peticiones/s) | |

Por endpoint:

| Endpoint | Muestras | Promedio (ms) | p95 (ms) | Error (%) |
|----------|----------|---------------|----------|-----------|
| GET /cursos | | | | |
| GET /cursos/2502 | | | | |
| GET /legal/aviso_privacidad | | | | |
| GET /legal/terminos_condiciones | | | | |

Observaciones:
