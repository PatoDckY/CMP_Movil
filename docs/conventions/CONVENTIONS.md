# Convenciones de desarrollo — SIMG-CMP Móvil

## Estructura

El proyecto utiliza MVVM.

- `screens`: vistas principales de la aplicación.
- `components`: elementos visuales reutilizables.
- `viewmodels`: estado y lógica de presentación.
- `models`: entidades y tipos utilizados por la aplicación.
- `services`: comunicación con la API de CMP_Site.
- `repositories`: acceso organizado a servicios y fuentes de datos.
- `navigation`: navegación pública y autenticada.
- `storage`: persistencia local y manejo de sesión.
- `config`: configuración global.
- `utils`: funciones auxiliares reutilizables.

## Convenciones de nombres

Los componentes, pantallas, modelos y ViewModels utilizarán PascalCase.

Ejemplos:

- `LoginScreen.tsx`
- `CourseCard.tsx`
- `LoginViewModel.ts`
- `Course.ts`

Los servicios, repositorios, utilidades y archivos de configuración utilizarán camelCase.

Ejemplos:

- `authService.ts`
- `courseRepository.ts`
- `apiConfig.ts`

## Pantallas

Las pantallas deberán terminar con el sufijo `Screen`.

Ejemplo:

`LoginScreen.tsx`

Las pantallas no deberán conectarse directamente con la API.

## ViewModels

Los ViewModels deberán terminar con el sufijo `ViewModel`.

Ejemplo:

`LoginViewModel.ts`

Son responsables del estado y de coordinar las operaciones necesarias para la vista.

## Servicios

Los servicios encapsularán la comunicación HTTP con el backend CMP_Site.

Ejemplos:

- `authService.ts`
- `courseService.ts`
- `purchaseService.ts`

No se permitirá conexión directa desde React Native a PostgreSQL.

## Repositorios

Los repositorios actuarán como intermediarios entre ViewModels y servicios cuando una funcionalidad requiera abstraer el origen de los datos.

## Backend

La aplicación móvil utilizará como backend las rutas API del proyecto CMP_Site.

Flujo:

Screen → ViewModel → Repository/Service → API CMP_Site → PostgreSQL

## Git

El desarrollo cotidiano se realizará en la rama `develop`.

La rama `main` se reservará para versiones estables e integradas.

Los mensajes de commit deberán indicar la actividad correspondiente.

Ejemplo:

`chore(A11): define estructura y convenciones del proyecto móvil`