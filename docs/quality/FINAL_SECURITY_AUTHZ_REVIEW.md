# Revisión final de seguridad y autorización — CMP_Movil (#102, A70)

Fecha: 2026-10-26. Código móvil: `develop` en `44258d0`. Backend leído (solo lectura, copia local de `CMP_Site` en `1b3571b`).

Esta revisión no repite pruebas: reúne la evidencia de tres fuentes y cierra la brecha H7 de #94 con una extensión de la colección Postman.

| Fuente | Qué aporta |
|---|---|
| **#92** — [`INTEGRATION_TESTS_POSTMAN.md`](INTEGRATION_TESTS_POSTMAN.md) | Corrida real del 2026-10-26 contra producción (30 solicitudes, 69 aserciones, 0 fallos): carpetas 2, 4, 5 y 6 |
| **#94** — [`AUTH_SESSION_SECURITY_AUDIT.md`](AUTH_SESSION_SECURITY_AUDIT.md) | Auditoría de código: sesión, Keychain, secretos, mensajes de error |
| **Extensión #102** | Carpeta `7. Aislamiento extendido (cuenta B)`: perfil, notificaciones, compra y materiales ajenos |

## Estado de la extensión (carpeta 7)

**Ejecutada contra producción el 2026-10-26: 14 solicitudes y 27 aserciones, 0 fallos** (corrida completa de la colección con `enablePurchase=false`: 44 solicitudes, 96 aserciones). Cuentas sembradas en Neon por el equipo (A = usuario 1036, B = 1037; inscripción 7, notificación 4, compra 2631). Verificación posterior de solo lectura en PostgreSQL: la notificación 4 sigue sin leer, la compra 2631 no cambió y ninguna fila de A se modificó.

Resultado por caso (token de B): `/profile` devuelve a B, con y sin `?id=<A>`; notificaciones de B sin las de A, con y sin `?usuarioId=<A>`; `PATCH …/leida` de la notificación 4 de A → 404; detalle de la compra 2631 → 404 y listado de B sin ella; materiales de la inscripción 7 de A y de una inexistente → 404 sin enlace de Drive.

Lectura del backend que coincide con lo observado:

- `GET /profile` no recibe parámetros y filtra por `usuarios.id = session.user.id`.
- `GET /cliente/notificaciones` solo lee `page` y `pageSize`; filtra por `inscripciones_cursos.usuario_id = session.user.id`.
- `PATCH /cliente/notificaciones/{id}/leida` comprueba pertenencia con `session.user.id` y responde 404 si la notificación es ajena o no existe.
- `GET /compras-cursos` y `/{id}` filtran por `compras.idusuario` del token.
- `GET /cliente/mis-cursos/{id}/materiales` exige sesión (401), pertenencia (404) y estado de inscripción vigente (403).

## Criterios de aceptación de #102

| # | Criterio | Evidencia | Estado |
|---|---|---|---|
| 1 | Las rutas protegidas requieren una sesión válida | **#92** carpeta 6 (real): `/cliente/mis-cursos`, `/cliente/mis-cursos/{id}/materiales` y `check-session` dan 401 sin token y con token basura. **#94** §3: el navegador autenticado solo se monta con usuario | **Cumple** |
| 2 | Una sesión expirada impide seguir usando recursos protegidos | **#92** carpeta 6 (real): JWT con `exp=1` → 401, refresh inválido → 401, y token de A tras logout → 401. **#94** §2: refresh en 401, borrado de Keychain si el refresh es 401/403 | **Cumple** |
| 3 | Los usuarios solo acceden a recursos autorizados | **#92** carpeta 5 (real): detalle y materiales ajenos → 404 sin enlace de Drive. **#94** §4: la UI no muestra datos antes del rechazo. **Extensión 7**: materiales de inscripción ajena e inexistente → 404/403 | **Cumple** |
| 4 | Un usuario no consulta información de otra cuenta | **#92** carpeta 5 (real): lista, detalle y materiales de A invisibles para B. **Extensión 7**: perfil (con y sin `?id=`), notificaciones (con y sin `?usuarioId=`), `PATCH` de notificación ajena y compra de A. Código del backend: filtrado siempre por el usuario del token | **Cumple**, con prueba real también en perfil, notificaciones y compra (cierra H7) |
| 5 | Los cursos protegidos requieren una adquisición válida | **#92** carpeta 4 y 5 (real): A, con inscripción, abre materiales (200); B, sin inscripción, recibe 404. **#92** carpeta 3 (compra): la reserva sin validar no genera inscripción (compra no ejecutada en producción; el comportamiento viene del backend: la inscripción solo existe tras validar el pago). **Extensión 7**: materiales con una inscripción ajena e inexistente | **Cumple** |
| 6 | Las respuestas de autenticación y autorización se manejan correctamente | **#92** (real): 401/404/403 con cuerpo JSON y sin datos ajenos. **#94** §1–2 y §8: manejo de 401 con refresh, mensajes en español sin trazas, 5xx genérico. Observación: H1 (mensajes distintos en el login, CMP_Site#14) | **Cumple**, con H1 abierto (media) |
| 7 | La aplicación no expone credenciales ni información sensible | **#94** §6–7: tokens solo en Keychain, sin `AsyncStorage`, sin secretos en el código, sin material de firma versionado; `console.error` retirado (#94, H3). **#129**: binario release sin hallazgos. Observación: la contraseña de las cuentas de prueba está publicada en un repositorio público (H6, baja, aceptada) | **Cumple**, con H6 abierto (baja) |
| 8 | Los hallazgos críticos son corregidos antes de la liberación | Repaso abajo | **Cumple**: sin críticos ni altos |

## Hallazgos abiertos (repaso para el criterio 8)

| ID | Origen | Severidad | Estado |
|---|---|---|---|
| H1 — el login permite enumerar cuentas | #94 | **Media** | Abierto en backend: [CMP_Site#14](https://github.com/CentroMedicoPichardo/CMP_Site/issues/14). No bloquea la liberación |
| H2 — `send-otp` revela correos registrados | #94 | Baja | Mejora en CMP_Site#14 |
| H6 — contraseña de prueba en repositorio público | #94 | Baja | Aceptada por el equipo; rotar o borrar las cuentas tras la liberación |
| H7 — aislamiento sin prueba real en perfil, notificaciones y compra | #94 | Baja | **Cerrado** con la carpeta 7 (corrida real) |
| Carpeta 3 (compra y pago) sin ejecutar en producción | #92 | Baja | Requiere entorno aislado o limpieza manual de cupos |

**No hay hallazgos de severidad alta o crítica sin corregir** entre #92, #94 y esta extensión. Esta conclusión cubre lo revisado, incluida la corrida real de la carpeta 7.
