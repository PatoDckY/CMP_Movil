-- Solo lectura: confirma en PostgreSQL lo que la API devolvió (persistencia real).
-- Uso:  psql "$DATABASE_URL" -f sql/verify.sql
\echo '== Cuentas de prueba (esperado: 2, activas, rol 1)'
SELECT id, correo, rol_id, activo FROM seguridad.usuarios WHERE correo LIKE 'qa-integracion-%@example.test' ORDER BY id;

\echo '== Inscripción y avance de A (esperado: 1 fila, 4/2/50.00)'
SELECT i.id_inscripcion, i.curso_id, i.estado, p.sesiones_totales, p.sesiones_completadas, p.porcentaje_avance
FROM academia.inscripciones_cursos i
JOIN seguridad.usuarios u ON u.id = i.usuario_id
LEFT JOIN academia.progreso_curso p ON p.inscripcion_id = i.id_inscripcion
WHERE u.correo = 'qa-integracion-a@example.test';

\echo '== B no tiene inscripciones ni compras (esperado: 0 y 0)'
SELECT (SELECT count(*) FROM academia.inscripciones_cursos i JOIN seguridad.usuarios u ON u.id = i.usuario_id WHERE u.correo = 'qa-integracion-b@example.test') AS inscripciones_b,
       (SELECT count(*) FROM academia.comprascursosinacademia c JOIN seguridad.usuarios u ON u.id = c.idusuario WHERE u.correo = 'qa-integracion-b@example.test') AS compras_b;

\echo '== Compras de A creadas por la colección (solo con enablePurchase=true): estado y pagos'
SELECT c.idcompra, c.foliocompra, c.estado, (SELECT count(*) FROM academia.pagos_cursos g WHERE g.id_compra = c.idcompra) AS pagos
FROM academia.comprascursosinacademia c JOIN seguridad.usuarios u ON u.id = c.idusuario
WHERE u.correo = 'qa-integracion-a@example.test' ORDER BY c.idcompra;
