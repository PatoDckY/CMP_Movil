#!/usr/bin/env sh
# Ejecuta la colección de integración con Postman CLI y deja los reportes en tests/postman/results/.
# Requeridas: CMP_PASSWORD_A, CMP_PASSWORD_B, CMP_COURSE_ID.
# Opcionales: CMP_BASE_URL, CMP_EMAIL_A, CMP_EMAIL_B, CMP_ENABLE_PURCHASE (true|false, por defecto false),
# CMP_EXPECTED_PROGRESS (por defecto 50).
set -eu
cd "$(dirname "$0")"
: "${CMP_PASSWORD_A:?Falta CMP_PASSWORD_A}" "${CMP_PASSWORD_B:?Falta CMP_PASSWORD_B}" "${CMP_COURSE_ID:?Falta CMP_COURSE_ID}"
mkdir -p results
exec postman collection run cmp-integration.postman_collection.json \
  --env-var "baseUrl=${CMP_BASE_URL:-https://cmp-site.vercel.app/api}" \
  --env-var "emailA=${CMP_EMAIL_A:-qa-integracion-a@example.test}" \
  --env-var "passwordA=${CMP_PASSWORD_A}" \
  --env-var "emailB=${CMP_EMAIL_B:-qa-integracion-b@example.test}" \
  --env-var "passwordB=${CMP_PASSWORD_B}" \
  --env-var "courseId=${CMP_COURSE_ID}" \
  --env-var "expectedProgress=${CMP_EXPECTED_PROGRESS:-50}" \
  --env-var "enablePurchase=${CMP_ENABLE_PURCHASE:-false}" \
  -r cli,junit,html \
  --reporter-junit-export results/junit.xml \
  --reporter-html-export results/report.html
