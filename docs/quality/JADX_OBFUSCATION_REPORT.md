# Reporte de ofuscación y strings sensibles (JADX) — CMP_Movil

Fecha de análisis: 2026-10-24. Issue: #129. Rama: `feature/129-reporte-jadx-mobsf`.

## Alcance y artefacto analizado

| Dato | Valor |
|---|---|
| Commit del código | `c96d1da` (`develop`, incluye #141) |
| Artefacto | `android/app/build/outputs/apk/release/app-release.apk` (74 831 774 bytes) |
| SHA-256 | `ebebc5b281725fc628a177c89d3fe248d1153af14aa6e745579f58cf4adc1ec0` |
| Generación | `./gradlew :app:assembleRelease`; Gradle lo marcó `UP-TO-DATE` y el árbol de código es idéntico a `develop`, por lo que el APK corresponde a ese commit |
| Firma | Release firmado con el keystore de producción (#135) |
| Herramienta | JADX 1.5.6 (`jadx -d jadx-output app-release.apk`). MobSF no se usó |
| Limitación | JADX terminó con 23 errores de decompilación de métodos sueltos (`finished with errors, count: 23`) sobre 2940 clases; no afectan a la búsqueda de strings |

Configuración verificada (sin cambios) en `android/app/build.gradle`, `buildType release`: `minifyEnabled enableProguardInReleaseBuilds` (con `enableProguardInReleaseBuilds = true`) y `shrinkResources true`.

## 1. Ofuscación de la capa Java (R8)

- Hay 3019 clases renombradas en el paquete raíz `defpackage/` (`a.java`, `a0.java`, `a00.java`, `b02.java`, …).
- Las clases propias de Java son solo `com.cmp_movil.MainActivity`, `MainApplication` y `R`. Conservan su nombre porque el manifest las referencia (`android:name="com.cmp_movil.MainApplication"`); es el comportamiento esperado de R8 y no expone lógica de negocio.
- Las librerías de React Native conservan sus paquetes (`com.facebook.react.bridge.*`, etc.) por las reglas de keep que traen; también esperado.
- Ejemplo: `MainActivity.java` importa clases renombradas (`defpackage.bn1`, `defpackage.d00`, `defpackage.dt`, …) en lugar de nombres descriptivos.

**Resultado: la capa Java está ofuscada por R8.**

## 2. Búsqueda de strings sensibles

Cobertura: árbol decompilado completo de JADX (`sources/`, `resources/`, `strings.xml`, manifest) y extracción de cadenas ASCII del bundle `assets/index.android.bundle` (1119 cadenas).

| Búsqueda | Resultado |
|---|---|
| URLs distintas de `cmp-site.vercel.app` en JADX | Solo esquemas y documentación de librerías: `schemas.android.com`, `github.com`, `issuetracker.google.com`, `docs.swmansion.com`, `youtrack.jetbrains.com`, `publicsuffix.org`, `mozilla.org`, `www.apache.org`, `www.android.com` |
| URLs en el bundle Hermes | Solo documentación de librerías (`reactnavigation.org`, `react.dev`, `docs.swmansion.com`, `github.com`, `reactnative.dev`, `dev.to`, `fb.me`), el prefijo `https://wa.me/` (enlace de WhatsApp de la propia app) y `https://cmp-site.vercel.app/api` |
| `ARCO_ANONIMIZACION_JOB_SECRET` / `JOB_SECRET` | **No aparece** en el APK (JADX, bundle ni `classes.dex`) |
| `secret`, `apikey`, `api_key`, `private_key`, `client_secret` en `sources/` | Solo `javax.crypto.SecretKey` de androidx (`defpackage/b02.java`, `si.java`, `ti.java`); falsos positivos |
| Literales base64/largos de 40+ caracteres en `sources/` | Solo alfabetos base64 y constantes de React Native/TLS; sin claves |
| Patrones de claves (`AKIA…`, `AIza…`, `sk_live`, `-----BEGIN`) en el bundle | Sin coincidencias; las 3 coincidencias del patrón genérico son mensajes de librerías |
| `strings.xml` | Sin claves ni URLs; solo texto de androidx.biometric |
| Cadenas base64 de 44 caracteres en el bundle | Exactamente los dos hashes SHA-256 de pinning de `src/services/security/sslPinning.ts` (`xRUwi70J…`, `yDu9og25…`); información pública del certificado, esperada |

Datos públicos presentes: el número de WhatsApp de pagos (`PAYMENT_WHATSAPP` en `PurchaseDetailScreen.tsx`) es un contacto de negocio mostrado en la propia app, no un secreto.

**Resultado: no hay secretos, claves, URLs internas ni secretos de backend expuestos.**

## 3. Hallazgo: la capa JavaScript no está ofuscada

La lógica de la app (TypeScript) se empaqueta en `assets/index.android.bundle`, bytecode Hermes (cabecera `c61fbc03`). R8 no actúa sobre ese archivo. Extrayendo sus cadenas aparecen en claro nombres propios:

`useRegisterViewModel`, `useLoginViewModel`, `LegalInformationScreen`, `RegisterScreen`, `tokenStorage`, `getRefreshToken`, `RepositoryFactory`, `legalService`, `optOutPreferencesService`, `passwordChangeService`, `API_BASE_URL`, rutas como `/auth/mobile/logout` y el número de WhatsApp de pagos.

- Impacto: expone arquitectura y endpoints a quien extraiga strings del APK. **No** expone credenciales; el bytecode Hermes tampoco se lee como código fuente.
- Estado: no corregido en esta rama (decisión del equipo). Se registró el issue #142 para evaluar el mangling de nombres en Metro u otra ofuscación del bundle y volver a medir con este mismo procedimiento.

## Conclusión

- La capa Java del build release está correctamente ofuscada por R8 y no contiene strings sensibles ni secretos de backend; la única cadena de apariencia sensible (los hashes de pinning) es pública y esperada.
- La capa JavaScript conserva identificadores propios legibles en el bundle Hermes. Por eso **no** se declara el build "completamente ofuscado": el punto queda abierto en #142.
- Esta evidencia es estática (APK analizado con JADX); no sustituye una prueba en dispositivo.

## Reproducción

```
jadx -d jadx-output app-release.apk
grep -rEoh 'https?://[a-zA-Z0-9._:-]+' jadx-output/ | sort -u
grep -rEil '(secret|apikey|api_key|private_key)' jadx-output/sources/
# Bundle: extraer cadenas ASCII (>= 6) de jadx-output/resources/assets/index.android.bundle
```
