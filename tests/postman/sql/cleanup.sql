-- Limpieza de las pruebas de integración (#92). Borra SOLO filas de las cuentas qa-integracion-*@example.test.
-- Uso:  psql "$DATABASE_URL" -f sql/cleanup.sql
-- Las compras creadas con enablePurchase=true reservan cupo (cupos_ocupados, movimientos_cupos_curso) y escriben
-- historial y analítica; NO se borran aquí a ciegas. El SELECT final las lista para revertirlas con criterio.
\set ON_ERROR_STOP on
BEGIN;

DELETE FROM academia.progreso_curso WHERE inscripcion_id IN (
  SELECT i.id_inscripcion FROM academia.inscripciones_cursos i
  JOIN seguridad.usuarios u ON u.id = i.usuario_id WHERE u.correo LIKE 'qa-integracion-%@example.test');

DELETE FROM academia.inscripciones_cursos WHERE usuario_id IN (
  SELECT id FROM seguridad.usuarios WHERE correo LIKE 'qa-integracion-%@example.test')
  AND observaciones = 'QA integración #92';

-- Las cuentas solo se borran si ya no tienen compras ni inscripciones.
DELETE FROM seguridad.usuarios u WHERE u.correo LIKE 'qa-integracion-%@example.test'
  AND NOT EXISTS (SELECT 1 FROM academia.comprascursosinacademia c WHERE c.idusuario = u.id)
  AND NOT EXISTS (SELECT 1 FROM academia.inscripciones_cursos i WHERE i.usuario_id = u.id);

COMMIT;

\echo '== Residuos que requieren revisión manual (compras de la colección)'
SELECT c.idcompra, c.foliocompra, c.idcurso, c.estado, c.idusuario
FROM academia.comprascursosinacademia c JOIN seguridad.usuarios u ON u.id = c.idusuario
WHERE u.correo LIKE 'qa-integracion-%@example.test';
