# Matriz de pruebas de caja negra (E2E manual) — CMP_Movil

Issue relacionado: A68 (#100). Rúbrica: pruebas funcionales E2E sin acceso a código y seguimiento de errores corregidos en Release.

## Alcance y método

- Pruebas manuales en un dispositivo físico Android, sin acceso al código: solo se observa lo que ve y hace una persona usuaria.
- Cada caso se ejecuta en el build **Debug** y en el build **Release** (candidato minificado, firmado temporalmente con el keystore debug; el keystore de producción se resuelve en #127).
- Esta matriz documenta lo que se ejecutó a mano. No es automatización (no Detox/Appium) y no sustituye la suite Jest.
- Los bugs encontrados se anotan en [BLACK_BOX_BUGS_LOG.md](BLACK_BOX_BUGS_LOG.md) con su ID de caso.

## Datos y precondiciones

| Dato | Descripción |
|---|---|
| Cuenta cliente | Cuenta de prueba con rol cliente, correo accesible para recibir OTP. Preferible una cuenta desechable, no real. |
| Cuenta de otro rol | Opcional, para comprobar que no ve la gestión de eliminación (BB-52). |
| Curso con cupo | Al menos un curso publicado con cupos disponibles. |
| Curso inscrito | Una compra con pago confirmado por administración, para MC y MAT. |
| Entorno | Anotar la URL de API usada (producción o pruebas) en Observaciones del primer caso. |

Las pruebas usan el backend real. Los casos que escriben datos (REG, COM, ARCO) dejan registros en el backend: usar solo datos de prueba.

## Cómo llenar las columnas

- **Debug / Release**: `OK`, `FALLA` o `N/A` (no aplicable o bloqueado). Un `FALLA` debe tener su bug en el log.
- **Fecha**: AAAA-MM-DD de la última ejecución.
- **Observaciones**: dispositivo y versión de Android, mensajes vistos, capturas.

## Casos

| ID | Módulo | Pasos a ejecutar | Resultado esperado | Debug | Release | Observaciones | Fecha |
|---|---|---|---|---|---|---|---|
| BB-01 | Arranque | 1. Instalar el APK. 2. Abrir la app sin sesión. | Abre la pantalla de inicio pública con acceso al catálogo, inicio de sesión y registro; sin cierres inesperados. | | | | |
| BB-02 | Registro | 1. Ir a Registro. 2. Dejar todos los campos vacíos y enviar. | Se indican los campos obligatorios; no se envía nada. | | | | |
| BB-03 | Registro | 1. Capturar datos personales válidos (nombre, apellido paterno, edad, sexo). 2. Correo con formato inválido. 3. Teléfono de menos de 10 dígitos. 4. Contraseñas distintas. | Cada dato inválido muestra un mensaje claro; no se solicita código. | | | | |
| BB-04 | Registro | 1. Capturar todos los datos válidos con un correo de prueba. 2. Solicitar el código de verificación. 3. Ingresar el código de 6 dígitos recibido. 4. Completar el registro. | Se envía el código al correo; con código correcto se crea la cuenta y se informa el resultado. | | | | |
| BB-05 | Registro | 1. Repetir con un código incorrecto. | Mensaje de error legible; no se crea la cuenta. | | | | |
| BB-06 | Registro | 1. Registrar un correo ya existente. | Mensaje de error sin exponer datos internos. | | | | |
| BB-07 | Login | 1. Ir a Iniciar sesión. 2. Ingresar correo y contraseña correctos. | Entra a la zona autenticada y se ve el nombre de la cuenta en Mi cuenta. | | | | |
| BB-08 | Login | 1. Ingresar contraseña incorrecta. 2. Ingresar correo inexistente. | Mensaje de credenciales inválidas; no entra. | | | | |
| BB-09 | Login | 1. Dejar campos vacíos y enviar. | Validación sin llamada a la red ni cierre de la app. | | | | |
| BB-10 | Login | 1. Iniciar sesión. 2. Cerrar la app desde recientes. 3. Abrirla de nuevo. | Conserva la sesión y entra directo a la zona autenticada. | | | | |
| BB-11 | Login | 1. Iniciar sesión sin red (modo avión). | Mensaje de error de conexión; la app sigue estable. | | | | |
| BB-12 | Recuperación | 1. Ir a recuperar contraseña. 2. Ingresar un correo vacío o inválido. | Mensaje de validación. | | | | |
| BB-13 | Recuperación | 1. Ingresar el correo de la cuenta de prueba y enviar. | Mensaje de confirmación genérico; el correo de recuperación llega a la bandeja. | | | | |
| BB-14 | Recuperación | 1. Ingresar un correo no registrado. | Mismo mensaje genérico, sin revelar si la cuenta existe. | | | | |
| BB-15 | Logout | 1. Con sesión, ir a Mi cuenta. 2. Pulsar Cerrar sesión. | Regresa a la zona pública; el botón Atrás no regresa a pantallas autenticadas. | | | | |
| BB-16 | Logout | 1. Cerrar sesión. 2. Cerrar y reabrir la app. | No hay sesión; pide iniciar sesión. | | | | |
| BB-17 | Catálogo | 1. Abrir Catálogo. | Se listan los cursos con indicador de carga y luego resultados. | | | | |
| BB-18 | Catálogo | 1. Buscar por el nombre de un curso existente. 2. Buscar un texto inexistente. 3. Borrar la búsqueda. | Filtra los resultados; texto inexistente muestra el estado "Sin resultados"; al borrar vuelve la lista completa. | | | | |
| BB-19 | Catálogo | 1. Filtrar por categoría. 2. Filtrar por modalidad. 3. Fijar un precio máximo. 4. Combinar filtros y limpiarlos. | Cada filtro reduce los resultados correctamente; combinados se acumulan; al limpiar se restaura la lista. | | | | |
| BB-20 | Catálogo | 1. Abrir el catálogo sin red. 2. Recuperar la red y reintentar. | Estado de error con opción de reintento; al reintentar carga la lista. | | | | |
| BB-21 | Detalle de curso | 1. Abrir un curso desde el catálogo. | Se muestran descripción, instructor, modalidad, fechas y horario, sede y dirección, cupo y disponibilidad. | | | | |
| BB-22 | Detalle de curso | 1. Sin sesión, abrir un curso e intentar comprar. | Se invita a crear cuenta o iniciar sesión; no se inicia compra. | | | | |
| BB-23 | Detalle de curso | 1. Abrir el detalle sin red. 2. Pulsar Intentar nuevamente con red. | Mensaje "No pudimos cargar el curso" y reintento funcional. | | | | |
| BB-24 | Compra | 1. Con sesión de cliente, abrir un curso con cupo y pulsar comprar/reservar. 2. Capturar nombre y apellido paterno del participante. 3. Confirmar. | Se crea la reserva con folio, total, límite de pago y estado "Pendiente de pago". | | | | |
| BB-25 | Compra | 1. Intentar confirmar sin nombre o apellido paterno. | Validación de obligatorios; no se crea la compra. | | | | |
| BB-26 | Compra | 1. Pedir más de un cupo y capturar varios participantes. 2. Confirmar. | El total refleja los cupos; se registran todos los participantes. | | | | |
| BB-27 | Compra | 1. Pulsar confirmar dos veces seguidas rápidamente. | Se crea una sola compra. | | | | |
| BB-28 | Compra | 1. Abrir Historial de compras. | La compra recién creada aparece con su folio, curso y estado. | | | | |
| BB-29 | Compra | 1. Abrir el detalle de la compra. 2. Revisar resumen, datos para pagar, personas registradas. | Datos coherentes con lo capturado y con el total. | | | | |
| BB-30 | Compra | 1. En el detalle, reportar un pago con monto, referencia y fecha válidos. | El pago aparece en "Pagos reportados" como reportado; el saldo pendiente sigue hasta que administración lo valide. | | | | |
| BB-31 | Compra | 1. Reportar pago con monto vacío o inválido. | Mensaje de validación; no se registra. | | | | |
| BB-32 | Compra | 1. Abrir Historial sin compras (cuenta nueva) y sin red. | Estado vacío claro; sin red, error con reintento. | | | | |
| BB-33 | Mis cursos | 1. Con una inscripción activa, abrir Mis cursos. | Se lista el curso inscrito con su estado. | | | | |
| BB-34 | Mis cursos | 1. Con una cuenta sin inscripciones, abrir Mis cursos. | Mensaje "Aún no tienes cursos inscritos" sin errores. | | | | |
| BB-35 | Mis cursos | 1. Abrir el detalle del curso inscrito. | Muestra participante inscrito, fecha de inscripción, horario, lugar y datos del curso; botón de volver funcional. | | | | |
| BB-36 | Mis cursos | 1. En el detalle, pulsar Actualizar información. | Recarga sin duplicar datos ni cerrar la app. | | | | |
| BB-37 | Mis cursos | 1. Abrir el detalle sin red y reintentar con red. | Estado de error con reintento funcional. | | | | |
| BB-38 | Materiales | 1. En el detalle de un curso inscrito, pulsar Ver materiales del curso. | Se muestra el estado de consulta y luego se abre la carpeta autorizada de Google Drive. | | | | |
| BB-39 | Materiales | 1. Con un curso sin materiales o sin autorización, pulsar Ver materiales. | Mensaje claro; no se expone ninguna carpeta ajena. | | | | |
| BB-40 | Materiales | 1. Pulsar Ver materiales sin red. | Mensaje de error y la app permanece estable. | | | | |
| BB-41 | Progreso académico | 1. En el detalle del curso inscrito, revisar sesiones del curso. 2. Revisar asistencia y progreso. | Sesiones, asistencia y progreso coinciden con lo registrado por administración. | | | | |
| BB-42 | Progreso académico | 1. Revisar una sesión con justificación registrada. | Se muestra "Justificación registrada" sin afirmar asistencia. | | | | |
| BB-43 | Perfil | 1. Ir a Mi cuenta y abrir Mis datos personales. | Se muestran el correo (solo lectura) y los datos rectificables cargados. | | | | |
| BB-44 | Perfil | 1. Cambiar nombre y teléfono con valores válidos. 2. Guardar. 3. Salir y reabrir la pantalla. | Mensaje de éxito y los cambios persisten. | | | | |
| BB-45 | Perfil | 1. Capturar edad o teléfono inválidos. 2. Guardar. | Validación; no se guarda. | | | | |
| BB-46 | Perfil | 1. Intentar editar el correo. | El correo no es editable. | | | | |
| BB-47 | Solicitud ARCO de cancelación | 1. Con cuenta cliente, ir a Mi cuenta y Solicitar eliminación de cuenta. 2. Revisar el proceso. | Se explica que la solicitud se revisa y no elimina la cuenta de inmediato; botón de enviar deshabilitado. | | | | |
| BB-48 | Solicitud ARCO de cancelación | 1. Ingresar la contraseña sin marcar la confirmación. 2. Marcar la confirmación sin contraseña. | En ambos casos no se puede enviar. | | | | |
| BB-49 | Solicitud ARCO de cancelación | 1. Ingresar contraseña incorrecta y confirmar. | Mensaje de error; no se genera folio; la contraseña no queda en el campo. | | | | |
| BB-50 | Solicitud ARCO de cancelación | 1. Con contraseña correcta y confirmación, enviar. | Se muestra folio y estado de la solicitud; la sesión sigue activa; la cuenta no se elimina. | | | | |
| BB-51 | Solicitud ARCO de cancelación | 1. Enviar de nuevo la solicitud. | Se reutiliza la solicitud abierta con el mismo folio. | | | | |
| BB-52 | Solicitud ARCO de cancelación | 1. Con una cuenta de otro rol, abrir Mi cuenta. | No aparece la sección Gestión de cuenta. | | | | |
| BB-53 | Opt-Out (A66) | 1. Ir a Mi cuenta. 2. Localizar la sección Derecho de oposición. | Aparecen tres switches apagados por defecto: comunicaciones no esenciales, analítica de uso y compartir progreso con terceros. | | | | |
| BB-54 | Opt-Out (A66) | 1. Activar cada switch. 2. Cerrar y reabrir la app. 3. Volver a Mi cuenta. | Cada switch conserva su estado; se mueve solo el que se tocó. | | | | |
| BB-55 | Opt-Out (A66) | 1. Activar un switch. 2. Cerrar sesión e iniciar con otra cuenta. 3. Volver a la primera cuenta. | Las preferencias son por cuenta: la segunda no hereda las de la primera; la primera las conserva. | | | | |
| BB-56 | Opt-Out (A66) | 1. Activar y desactivar un switch rápidamente varias veces. | La interfaz no se bloquea ni queda en un estado inconsistente. | | | | |
| BB-57 | Información legal | 1. Abrir Privacidad y términos desde Mi cuenta. | Se muestra la información, marcada como provisional. | | | | |
| BB-58 | Regresión Release | 1. Repetir BB-07, BB-17, BB-24, BB-38, BB-44 y BB-50 en el build Release. | Mismo comportamiento que en Debug; sin cierres ni pantallas en blanco por minificación. | | | | |
| BB-59 | Robustez | 1. Rotar el dispositivo. 2. Enviar la app a segundo plano 1 minuto y volver. 3. Cambiar tamaño de fuente del sistema. | La app conserva estado y se mantiene legible. | | | | |
| BB-60 | Robustez | 1. Con sesión, cambiar la contraseña desde el sitio web. 2. Volver a la app y navegar. | La app cierra la sesión de forma controlada, sin errores crudos. | | | | |

## Cobertura contra los flujos pedidos

| Flujo | Casos |
|---|---|
| Registro | BB-02 a BB-06 |
| Login | BB-07 a BB-11 |
| Recuperación de contraseña | BB-12 a BB-14 |
| Logout | BB-15, BB-16 |
| Catálogo y filtros | BB-17 a BB-20 |
| Detalle de curso | BB-21 a BB-23 |
| Compra | BB-24 a BB-32 |
| Mis cursos | BB-33 a BB-37 |
| Materiales (Google Drive) | BB-38 a BB-40 |
| Progreso académico | BB-41, BB-42 |
| Perfil | BB-43 a BB-46 |
| Solicitud ARCO de cancelación | BB-47 a BB-52 |
| Opt-Out (A66) | BB-53 a BB-56 |
| Transversales | BB-01, BB-57 a BB-60 |

## Limitaciones conocidas

- Las preferencias de Opt-Out son solo locales (CMP_Site no tiene endpoint): BB-53 a BB-56 verifican la interfaz y la persistencia en el dispositivo, no el efecto en el servidor.
- El MFA móvil no se cubre: no hay contrato verificado para completarlo.
- Notificaciones, lecciones y módulos no se cubren: no existe API de cliente verificada (ver `BACKEND_CONTRACTS.md`).
- El cierre de sesión por cambio de contraseña (BB-60) depende de que el backend invalide los tokens; si no lo hace, registrarlo como hallazgo.
