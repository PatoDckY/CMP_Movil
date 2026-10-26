-- Siembra de datos ficticios para las pruebas de integración (#92). NO ejecutado por CI.
-- Uso:  psql "$DATABASE_URL" -v pwhash='<hash bcrypt>' -v course_id=<id curso> -f sql/seed.sql
-- El hash se genera fuera de la base: ver docs/quality/INTEGRATION_TESTS_POSTMAN.md.
-- Todo queda en una transacción; si algo falla no se escribe nada.
\set ON_ERROR_STOP on
BEGIN;

INSERT INTO seguridad.usuarios
  (nombre, "apellidoPaterno", edad, sexo, telefono, correo, contrasena, rol_id)
VALUES
  ('QA', 'IntegracionA', 30, 'Otro', '5500000001', 'qa-integracion-a@example.test', :'pwhash', 1),
  ('QA', 'IntegracionB', 30, 'Otro', '5500000002', 'qa-integracion-b@example.test', :'pwhash', 1);

-- Inscripción vigente de A en el curso (simula una compra ya validada por un administrador).
INSERT INTO academia.inscripciones_cursos (curso_id, usuario_id, estado, monto_pagado, observaciones)
SELECT :course_id, u.id, 'activo', 0, 'QA integración #92'
FROM seguridad.usuarios u WHERE u.correo = 'qa-integracion-a@example.test';

-- Avance conocido (2 de 4 sesiones = 50 %) que la colección compara en lista y detalle.
INSERT INTO academia.progreso_curso (inscripcion_id, sesiones_totales, sesiones_completadas, porcentaje_avance, porcentaje_asistencia)
SELECT i.id_inscripcion, 4, 2, 50, 100
FROM academia.inscripciones_cursos i
JOIN seguridad.usuarios u ON u.id = i.usuario_id
WHERE u.correo = 'qa-integracion-a@example.test' AND i.curso_id = :course_id;

COMMIT;

SELECT u.id AS usuario_id, u.correo, i.id_inscripcion
FROM seguridad.usuarios u
LEFT JOIN academia.inscripciones_cursos i ON i.usuario_id = u.id
WHERE u.correo LIKE 'qa-integracion-%@example.test' ORDER BY u.id;
