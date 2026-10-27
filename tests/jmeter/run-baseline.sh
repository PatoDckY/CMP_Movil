#!/usr/bin/env bash
# Linea base de rendimiento de la API (#96). Solo GET de lectura, carga modesta.
# Requiere Apache JMeter 5.x en el PATH (comando `jmeter`).
set -euo pipefail
cd "$(dirname "$0")"

OUT="results/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

jmeter -n \
  -t cmp-baseline.jmx \
  -l "$OUT/resultados.jtl" \
  -e -o "$OUT/reporte-html" \
  -j "$OUT/jmeter.log"

echo "Reporte HTML: $OUT/reporte-html/index.html"
