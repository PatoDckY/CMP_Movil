# Convenciones de desarrollo — SIMG-CMP Móvil

## 1. Propósito

Este documento establece las convenciones de organización, nombres,
responsabilidades y flujo de dependencias utilizadas en CMP_Movil.

El proyecto utiliza una arquitectura por capas con MVVM como patrón
principal de presentación.

La regla general de comunicación es:

```text
View → ViewModel → Repository → Service → HTTP Client → API CMP_Site
```

React Native nunca se conectará directamente a PostgreSQL.

## 2. Estructura principal

La estructura base del código fuente es:

```text
src/
├── components/
├── config/
├── mappers/
├── models/
├── navigation/
├── repositories/
│   ├── contracts/
│   └── implementations/
├── screens/
├── services/
│   ├── contracts/
│   ├── dto/
│   ├── http/
│   └── implementations/
├── storage/
├── utils/
└── viewmodels/
```

Cada carpeta tiene una responsabilidad específica.

## 3. Screens

La carpeta:

```text
src/screens
```

contiene las vistas principales de la aplicación.

Las pantallas deberán terminar con el sufijo:

```text
Screen
```

Ejemplos:

```text
CatalogScreen.tsx
LoginScreen.tsx
RegisterScreen.tsx
MyCoursesScreen.tsx
```

Las pantallas deben:

- Mostrar información.
- Capturar eventos del usuario.
- Consumir un ViewModel.
- Representar estados de carga, éxito, vacío y error.

Las pantallas no deben:

- Ejecutar fetch directamente.
- Conocer endpoints.
- Acceder a PostgreSQL.
- Implementar lógica de acceso a datos.

## 4. Components

La carpeta:

```text
src/components
```

contiene componentes visuales reutilizables.

Los componentes utilizarán PascalCase.

Ejemplos:

```text
CourseCard.tsx
LoadingIndicator.tsx
ErrorMessage.tsx
```

Los componentes visuales no deberán contener lógica directa de acceso al
backend.

## 5. ViewModels

La carpeta:

```text
src/viewmodels
```

contiene la lógica de presentación y el estado requerido por las Views.

Los ViewModels podrán implementarse como hooks cuando resulte apropiado.

Ejemplo:

```text
useCatalogViewModel.ts
```

Los nombres deberán identificar claramente su función y conservar el
sufijo ViewModel.

Los ViewModels deben:

- Administrar estado.
- Procesar eventos.
- Consumir contratos Repository.
- Exponer información preparada para la View.
- Gestionar estados de carga y error.

Los ViewModels no deben:

- Ejecutar fetch directamente.
- Conocer URLs.
- Consumir directamente DTO del backend.
- Depender de implementaciones Repository concretas cuando pueda usarse
  su contrato.

## 6. Models

La carpeta:

```text
src/models
```

contiene las estructuras internas del dominio móvil.

Los Models utilizarán PascalCase.

Ejemplos:

```text
Course.ts
User.ts
Purchase.ts
MyCourse.ts
Progress.ts
Notification.ts
```

Los modelos representan la información utilizada dentro de CMP_Movil.

No deben depender directamente de React Native, HTTP o estructuras de
respuesta específicas del backend.

## 7. DTO

La carpeta:

```text
src/services/dto
```

contiene los Data Transfer Objects utilizados para la comunicación con
CMP_Site.

Los archivos DTO utilizarán PascalCase y el sufijo Dto cuando corresponda.

Ejemplos:

```text
CourseDto.ts
UserDto.ts
AuthDto.ts
PurchaseDto.ts
MyCourseDto.ts
```

Los DTO deben reflejar la estructura externa utilizada por la API.

Ejemplo:

```text
idCurso
tituloCurso
descripcion
```

Los DTO no deben utilizarse directamente en las pantallas.

## 8. Mappers

La carpeta:

```text
src/mappers
```

contiene las transformaciones entre DTO y Models.

Los archivos Mapper utilizarán camelCase.

Ejemplos:

```text
courseMapper.ts
userMapper.ts
purchaseMapper.ts
myCourseMapper.ts
```

Un Mapper puede transformar:

```text
DTO → Model
```

o, cuando sea necesario:

```text
Model / Input → DTO
```

Ejemplo:

```text
idCurso     → id
tituloCurso → title
```

Las transformaciones de estructuras externas no deberán realizarse
directamente dentro de Screens.

## 9. Repository contracts

La carpeta:

```text
src/repositories/contracts
```

contiene las interfaces Repository.

Los contratos utilizarán PascalCase.

Ejemplos:

```text
CourseRepository.ts
AuthRepository.ts
PurchaseRepository.ts
MyCoursesRepository.ts
NotificationRepository.ts
```

Un contrato Repository describe las operaciones disponibles para el
dominio sin especificar cómo se obtienen los datos.

Los ViewModels deberán trabajar principalmente con estos contratos.

## 10. Repository implementations

La carpeta:

```text
src/repositories/implementations
```

contiene las implementaciones concretas de los contratos Repository.

Las implementaciones utilizarán PascalCase y el sufijo:

```text
Impl
```

Ejemplo:

```text
CourseRepositoryImpl.ts
```

Una implementación Repository puede:

- Consumir un Service.
- Utilizar Mappers.
- Combinar información de distintas fuentes.
- Devolver Models al ViewModel.

Una implementación Repository nunca deberá colocarse dentro de:

```text
src/repositories/contracts
```

## 11. Service contracts

La carpeta:

```text
src/services/contracts
```

contiene las interfaces que representan las operaciones disponibles en
CMP_Site.

Los contratos Service utilizarán PascalCase.

Ejemplos:

```text
CourseService.ts
AuthService.ts
PurchaseService.ts
MyCoursesService.ts
```

Los Services trabajan principalmente con DTO.

## 12. Service implementations

La carpeta:

```text
src/services/implementations
```

contiene las implementaciones concretas de los Services.

Cuando se exporte una instancia u objeto concreto se utilizará camelCase.

Ejemplo:

```text
courseService.ts
```

Los Services son responsables de encapsular las llamadas necesarias a la
API.

No deben contener lógica visual.

## 13. HTTP

La carpeta:

```text
src/services/http
```

contiene la infraestructura HTTP compartida.

Ejemplo:

```text
httpClient.ts
```

El cliente HTTP centraliza tareas como:

- URL base.
- Encabezados comunes.
- Parseo JSON.
- Errores HTTP.
- Configuración compartida de solicitudes.

Los Services deberán utilizar el cliente HTTP en lugar de repetir lógica
de fetch.

## 14. Storage

La carpeta:

```text
src/storage
```

contendrá mecanismos de persistencia local.

Se utilizará principalmente para información como:

- Datos temporales.
- Preferencias.
- Sesión móvil.
- Tokens almacenados de forma segura.

Las credenciales o tokens sensibles no deberán almacenarse mediante
mecanismos inseguros.

## 15. Config

La carpeta:

```text
src/config
```

contiene configuración global y composición de dependencias.

Ejemplos:

```text
apiConfig.ts
dependencies.ts
```

`apiConfig.ts` contiene configuración relacionada con la API.

`dependencies.ts` funciona como punto de composición para conectar
implementaciones concretas con sus contratos.

## 16. Utils

La carpeta:

```text
src/utils
```

contiene funciones auxiliares reutilizables que no pertenecen
directamente a un módulo funcional.

Las utilidades utilizarán camelCase.

No deben convertirse en un lugar para almacenar lógica de negocio sin
una responsabilidad clara.

## 17. Convenciones de nombres

Se utilizarán las siguientes reglas:

```text
Screens                 PascalCase + Screen
Components              PascalCase
Models                  PascalCase
DTO                     PascalCase
Service contracts       PascalCase
Repository contracts    PascalCase
Repository impl.        PascalCase + Impl
Mappers                 camelCase
Service impl./instances camelCase
Config                   camelCase
Utils                    camelCase
ViewModel hooks          use...ViewModel
```

Ejemplos:

```text
CatalogScreen.tsx
CourseCard.tsx
Course.ts
CourseDto.ts
CourseService.ts
CourseRepository.ts
CourseRepositoryImpl.ts
courseMapper.ts
courseService.ts
apiConfig.ts
useCatalogViewModel.ts
```

## 18. Imports y dependencias

Las dependencias deberán respetar la separación de capas.

La dirección recomendada es:

```text
View
 ↓
ViewModel
 ↓
Repository contract
 ↓
Repository implementation
 ↓
Service contract
 ↓
Service implementation
 ↓
HTTP Client
 ↓
API
```

Los Models no deberán importar Screens o Components.

Los DTO no deberán depender de Views.

Las Screens no deberán importar directamente el HTTP Client.

## 19. Inyección de dependencias

Se priorizará la inyección de dependencias mediante constructor.

Ejemplo conceptual:

```text
CourseRepositoryImpl(courseService)
```

Las dependencias compartidas se crearán desde:

```text
src/config/dependencies.ts
```

Esto evita que los ViewModels tengan que construir directamente las
implementaciones que utilizan.

## 20. Manejo de estado

Los ViewModels que consuman datos deberán contemplar los estados que
correspondan al flujo.

Como base se utilizarán:

```text
idle
loading
success
empty
error
```

La View será responsable únicamente de representar visualmente esos
estados.

## 21. Errores

Los errores de comunicación HTTP deberán centralizarse en la capa de
infraestructura cuando sea posible.

El HTTP Client podrá convertir respuestas no exitosas en errores
estructurados.

Los ViewModels decidirán qué mensaje o estado exponer a la View.

Las Screens no deberán interpretar directamente códigos HTTP.

## 22. Autenticación

Las operaciones de autenticación deberán respetar el mismo flujo
arquitectónico:

```text
View
 ↓
Auth ViewModel
 ↓
AuthRepository
 ↓
AuthService
 ↓
HTTP Client
 ↓
CMP_Site
```

El manejo de token móvil, almacenamiento seguro y cliente autenticado se
implementará en las actividades correspondientes.

## 23. Notificaciones

No se crearán endpoints ficticios para funcionalidades que todavía no
sean expuestas por CMP_Site.

Si existe un Model o Repository previsto pero la API aún no está
disponible, la implementación deberá mantenerse pendiente hasta contar
con un contrato real del backend.

## 24. Seguridad

CMP_Movil no debe contener secretos de infraestructura.

No deberán incluirse valores como:

```text
DATABASE_URL
JWT_SECRET
```

La comunicación con CMP_Site utilizará HTTPS.

Para producción se contempla:

```text
javascript-obfuscator
R8 / ProGuard
```

Estas herramientas se utilizarán únicamente como protección adicional y
no como sustitución de los controles de seguridad del backend.

## 25. Git

El proyecto utilizará únicamente las ramas:

```text
develop
main
```

`develop` será utilizada para el trabajo cotidiano y actividades en
desarrollo.

`main` se reservará para versiones estables e integradas.

No se crearán ramas adicionales para cada actividad.

Los mensajes de commit deberán indicar la actividad correspondiente
cuando aplique.

Ejemplos:

```text
feat(A12): define modelos DTO mappers y contratos de servicios
fix(A12): corrige estructura y completa contratos de servicios
```

## 26. Regla general

La comunicación estándar de CMP_Movil deberá respetar:

```text
View → ViewModel → Repository → Service → HTTP Client → API CMP_Site
```

Los DTO pertenecen a la capa de datos.

Los Models pertenecen al dominio.

Los Mappers traducen entre ambos.

Los Repositories abstraen el origen de los datos.

Los Services encapsulan las operaciones de la API.

Los ViewModels administran estado y lógica de presentación.

Las Views muestran información y capturan interacción.

Nunca deberá implementarse:

```text
View → API
```

ni:

```text
React Native → PostgreSQL
```