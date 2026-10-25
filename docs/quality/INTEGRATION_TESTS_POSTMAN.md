# Pruebas de integración con Postman CLI — CMP_Movil (#92)

Fecha: 2026-10-25. Colección: [`tests/postman/cmp-integration.postman_collection.json`](../../tests/postman/cmp-integration.postman_collection.json). Herramienta exigida por la Actividad 3 (automatización de pruebas) para integración: Postman CLI ejecutando una colección contra la API, con código de respuesta, estructura de datos y persistencia en PostgreSQL.

## Estado honesto de la corrida

**No se ejecutó la corrida completa contra CMP_Site.** Se eligió producción con cuentas ficticias sembradas por SQL, pero crear cuentas y escribir filas en la base real queda fuera de lo que este agente hace por sí mismo. Por eso:

| Qué se hizo | Dónde | Resultado |
|---|---|---|
| Carpeta 0 (catálogo), 2 solicitudes de validación de registro y 6 casos de token inválido/sin token | Producción, solo lectura o rechazos sin efecto (newman, `courseId=2502`) | 21 aserciones, 19 en verde; las 2 fallidas eran un fallo del propio script (leía la variable equivocada), corregido y repetido: 8/8 en verde en el catálogo |
| Colección completa (37 solicitudes, 85 aserciones) | Servidor simulado local con el contrato de `BACKEND_CONTRACTS.md` | 0 fallos. Valida la lógica de los scripts, **no** el backend real |
| Seeds, verificación SQL, limpieza, workflow | — | Escritos, **sin ejecutar** |

El resultado real de los pasos autenticados (A, B, compra) queda pendiente de que alguien con acceso ejecute el procedimiento de abajo y anote aquí el resultado.

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

Ninguno en la API: no se llegó a los pasos autenticados reales. Hallazgos de diseño de pruebas:

- El registro no es automatizable de extremo a extremo: el OTP solo se envía por correo (almacén en memoria, ya no se escribe en logs). Se cubre con validaciones y cuentas sembradas.
- Crear una compra no tiene un camino de reversión limpio: no hay endpoint de cancelación documentado y las FK `restrict` obligan a limpieza manual. Sin un entorno aislado, la compra debe ser opt-in. No alimenta #104 salvo que se decida exponer un entorno de pruebas.
- La inscripción solo existe tras la validación del administrador, que la colección no puede simular; se siembra por SQL.

## Criterios de aceptación de #92

| # | Criterio | Estado |
|---|---|---|
| 1 | Se prueban flujos que involucran más de un módulo | **Cubierto en la colección** (auth → catálogo → compras → Mis cursos → materiales); sin corrida real |
| 2 | La autenticación se mantiene al navegar entre rutas protegidas | **Cubierto** (carpeta 2, mismo token en 4 módulos + refresh); sin corrida real |
| 3 | La adquisición se refleja en Mis cursos | **Parcial**: la inscripción sembrada aparece y la reserva sin validar no genera inscripción; la validación de pago por administrador no es automatizable |
| 4 | El acceso al contenido respeta la autorización | **Cubierto** (materiales con A autorizado; sin token y con B rechazados); sin corrida real |
| 5 | El progreso se refleja donde corresponde | **Cubierto** (lista = detalle = valor sembrado en PostgreSQL); sin corrida real |
| 6 | Los cambios de cuenta no afectan datos de otros usuarios | **Cubierto** (carpeta 5); sin corrida real |
| 7 | Los errores quedan documentados | **Cumplido**: sección Defectos; sin defectos de API porque no hubo corrida real |
| 8 | Las pruebas pueden repetirse tras correcciones | **Cumplido**: comando único, datos por corrida, seed/cleanup, workflow manual |
| 9 | Los resultados quedan como evidencia | **Parcial**: reportes JUnit/HTML y artefacto del workflow listos; la evidencia de la corrida real está pendiente |

## Pendiente

Ejecutar los pasos 1–5 y registrar aquí el resultado por caso. `seed.sql` y `cleanup.sql` se escribieron leyendo el esquema de CMP_Site y no se ejecutaron, ni siquiera en transacción con rollback: conviene revisarlos antes de correrlos en producción.
