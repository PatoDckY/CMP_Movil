# Pruebas de integración con Postman CLI — CMP_Movil (#92)

Fecha: 2026-10-25. Colección: [`tests/postman/cmp-integration.postman_collection.json`](../../tests/postman/cmp-integration.postman_collection.json). Herramienta exigida por la Actividad 3 (automatización de pruebas) para integración: Postman CLI ejecutando una colección contra la API, con código de respuesta, estructura de datos y persistencia en PostgreSQL.

## Resultado de la corrida real

Corrida del 2026-10-26 (UTC) con Postman CLI contra `https://cmp-site.vercel.app/api`, cuentas A y B sembradas, curso `2502`, `enablePurchase=false`. **30 solicitudes, 69 aserciones, 0 fallos** (11,2 s). Reportes locales: `tests/postman/results/report.html` y `junit.xml` (ignorados por Git).

| Carpeta | Resultado | Solicitudes con aserciones |
|---|---|---|
| 0. Catálogo público | Pasa | 2 (8 aserciones) |
| 1. Registro (validaciones) | Pasa | 3: 400 sin correo, 409 con correo de A, 400 registro incompleto |
| 2. Autenticación (A) | Pasa | 8: login inexistente 401, login A, check-session, profile, notificaciones, compras, refresh, check-session tras refresh |
| 3. Compra | **Omitida** (opt-in, no se escribió en producción) | 0 |
| 4. Mis cursos, materiales, progreso | Pasa | 3: lista, detalle (inscripción 6), materiales |
| 5. Aislamiento (B) | Pasa | 5 ejecutadas: B no ve la inscripción; detalle y materiales de A con token de B → 404 sin enlace de Drive; A intacto. Las 2 de compras se omitieron (dependen de la carpeta 3) |
| 6. Token inválido y cierre de sesión | Pasa | 9: sin token, basura, JWT `exp=1`, check-session, materiales, refresh inválido → 401; logout de A y B → 200; token revocado → 401 |

Persistencia en PostgreSQL (consulta de solo lectura por Neon, equivalente a `verify.sql`): A existe, rol 1, activa, inscripción 6 en el curso 2502 (`activo`) con 4/2 sesiones y `porcentaje_avance` 50.00, 0 compras; B existe, activa, sin inscripciones ni compras. Coincide con lo que devolvió la API.

No se ejecutó: carpeta 3 (compra y reporte de pago), `seed.sql` y `cleanup.sql` (las cuentas se sembraron aparte), ni el workflow de GitHub Actions. No quedaron datos nuevos de la colección que limpiar; el logout solo incrementó la versión de tokens de A y B.

## Qué cubre

| Carpeta | Casos |
|---|---|
| 0. Catálogo público | `GET /cursos` (contrato CourseDto, curso de prueba presente), `GET /cursos/{id}` |
| 1. Registro (solo validaciones) | `send-otp` sin correo → 400; con correo de A → 409 (prueba que la cuenta persiste); `register` incompleto → 400. No crea cuentas: el OTP solo llega por correo |
| 2. Autenticación (A) | login con correo inexistente → 401; login A (tokens, usuario); `check-session`, `/profile`, `/cliente/notificaciones`, `/compras-cursos` con el mismo token; refresh y sesión tras renovar |
| 3. Compra (A), opt-in `enablePurchase=true` | métodos de pago, reserva (`Pendiente de pago`, usuario y curso correctos), listado, reporte de pago sin comprobante (`Pago reportado`), detalle con resumen |
| 4. Mis cursos (A) | contrato de lista, inscripción sembrada presente, la reserva sin validar **no** crea inscripción, avance igual al sembrado, detalle coherente con la lista, materiales autorizados (estado válido, enlace solo de Drive HTTPS) |
| 5. Aislamiento (B) | B no ve la inscripción de A en su lista; detalle y materiales de A con token de B → 404/403 sin filtrar el enlace de Drive; compras de A no visibles; A intacto |
| 6. Token inválido | sin token, basura y JWT con `exp=1` → 401; `check-session` `ok:false`; refresh inválido → 401; logout de A y B y token revocado → 401 |

La compra es opt-in porque reserva cupo del curso y escribe historial, movimientos de cupo y analítica (`movimientos_cupos_curso`, `historial_estados_compra`, dataset de analítica con FK `restrict`). Esas filas no se limpian automáticamente; ver Limpieza.

## Ejecución

1. Generar el hash bcrypt de una contraseña de prueba (política: 8+ caracteres, letra, número, símbolo, sin secuencias 123/abc/qwe), fuera del repositorio:

```bash
cd ../CMP_Site && node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" 'Contraseña-de-prueba'
```

2. Sembrar (transacción única; elegir un curso existente):

```bash
psql "$DATABASE_URL" -v pwhash='<hash>' -v course_id=<idCurso> -f tests/postman/sql/seed.sql
```

3. Ejecutar con Postman CLI ([instalación](https://learning.postman.com/docs/postman-cli/postman-cli-installation)); ninguna credencial está en el repositorio:

```bash
CMP_PASSWORD_A='...' CMP_PASSWORD_B='...' CMP_COURSE_ID=<idCurso> sh tests/postman/run-integration.sh
```

Variables: `CMP_BASE_URL` (por defecto la API de producción), `CMP_EMAIL_A/B`, `CMP_EXPECTED_PROGRESS` (50), `CMP_ENABLE_PURCHASE` (false). Genera `tests/postman/results/junit.xml` y `report.html` (ignorados por Git).

4. Persistencia real: `psql "$DATABASE_URL" -f tests/postman/sql/verify.sql` (solo lectura).
5. Limpieza: `psql "$DATABASE_URL" -f tests/postman/sql/cleanup.sql`. Borra progreso, inscripción y cuentas `qa-integracion-*@example.test`; las compras de `enablePurchase=true` solo se listan para revertirlas a mano (cupos y movimientos).

Los datos por corrida son únicos (`runId` con marca de tiempo en participante, referencia y observaciones). Las cuentas A/B son fijas porque se siembran; repetir tras una corrección no requiere resembrar, salvo tras limpiar. El logout final revoca los tokens de ambas cuentas.

## CI

Se añadió `.github/workflows/integration.yml`, **solo manual** (`workflow_dispatch`). No corre en cada PR a `develop` porque exige cuentas sembradas en una base real, escribe contra ella, depende de secrets (`CMP_IT_PASSWORD_A/B`, variable `CMP_IT_COURSE_ID`) y los PR desde forks no los reciben. Un job obligatorio en PR habría quedado en rojo o con escrituras no controladas. Para correr en cada PR haría falta un entorno de pruebas aislado (rama de base de datos y backend desplegado para pruebas), que hoy no existe. El workflow no se ejecutó.

## Defectos encontrados

Ninguno en la API en los casos ejecutados. Hallazgos de diseño de pruebas:

- El registro no es automatizable de extremo a extremo: el OTP solo se envía por correo (almacén en memoria, ya no se escribe en logs). Se cubre con validaciones y cuentas sembradas.
- Crear una compra no tiene un camino de reversión limpio: no hay endpoint de cancelación documentado y las FK `restrict` obligan a limpieza manual. Sin un entorno aislado, la compra debe ser opt-in. No alimenta #104 salvo que se decida exponer un entorno de pruebas.
- La inscripción solo existe tras la validación del administrador, que la colección no puede simular; se siembra por SQL.

## Criterios de aceptación de #92

| # | Criterio | Estado |
|---|---|---|
| 1 | Se prueban flujos que involucran más de un módulo | **Cumplido** (auth → catálogo → Mis cursos → materiales, corrida real 0 fallos) |
| 2 | La autenticación se mantiene al navegar entre rutas protegidas | **Cumplido** (mismo token en perfil, notificaciones, compras, Mis cursos, materiales; refresh; corrida real) |
| 3 | La adquisición se refleja en Mis cursos | **Parcial**: la inscripción existente aparece con contrato correcto. Compra y reporte de pago no se ejecutaron (opt-in) y la validación por administrador no es automatizable |
| 4 | El acceso al contenido respeta la autorización | **Cumplido** (A autorizado; sin token y con B rechazados; corrida real) |
| 5 | El progreso se refleja donde corresponde | **Cumplido** (lista = detalle = 50 % en PostgreSQL) |
| 6 | Los cambios de cuenta no afectan datos de otros usuarios | **Cumplido** en lectura de inscripción y materiales; las comprobaciones sobre compras de A quedaron omitidas junto con la carpeta 3 |
| 7 | Los errores quedan documentados | **Cumplido**: la corrida real no encontró defectos de API |
| 8 | Las pruebas pueden repetirse tras correcciones | **Cumplido**: comando único, datos por corrida, seed/cleanup, workflow manual |
| 9 | Los resultados quedan como evidencia | **Cumplido**: reportes JUnit/HTML, tabla de arriba y verificación en PostgreSQL |

## Pendiente

Carpeta 3 (compra y reporte de pago): requiere un entorno aislado o aceptar la limpieza manual de cupos y movimientos en producción. Workflow de GitHub Actions sin ejecutar. Review cruzado de Luis.
