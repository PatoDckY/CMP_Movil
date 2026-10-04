# Arquitectura de software — SIMG-CMP Móvil

## 1. Propósito

La aplicación móvil SIMG-CMP utiliza una arquitectura por capas con
MVVM como patrón principal de presentación.

El objetivo es separar la interfaz de usuario, la lógica de presentación,
el dominio y el acceso a datos, reduciendo el acoplamiento entre los
componentes de la aplicación.

La aplicación móvil no tendrá acceso directo a PostgreSQL.

Toda comunicación con los datos del sistema deberá realizarse mediante
las rutas API proporcionadas por CMP_Site.

## 2. Capas principales

### Presentación

La capa de presentación contiene las pantallas y componentes visuales.

Incluye principalmente:

- screens
- components
- navigation

Las vistas únicamente muestran información, reciben acciones del usuario
y delegan la lógica al ViewModel correspondiente.

Una View no debe realizar solicitudes HTTP directamente.

### Lógica de presentación

La lógica de presentación está implementada mediante ViewModels.

Los ViewModels son responsables de:

- Mantener el estado requerido por las pantallas.
- Procesar acciones del usuario.
- Solicitar operaciones a los repositorios.
- Gestionar estados de carga.
- Gestionar estados de éxito, vacío y error.
- Proporcionar a la View información preparada para mostrarse.

El ViewModel no debe conocer los detalles de HTTP ni los formatos de
respuesta utilizados por CMP_Site.

## 3. Dominio

La capa de dominio contiene los modelos internos utilizados por la
aplicación móvil.

Ejemplos:

- User
- Course
- Purchase
- MyCourse
- CourseProgress
- Notification

Los modelos representan la información utilizada dentro de la aplicación
y son independientes del formato utilizado por la API.

Los modelos no deben depender de pantallas, componentes ni mecanismos HTTP.

## 4. Capa de datos e infraestructura

La capa de datos es responsable de comunicarse con fuentes externas.

Está formada principalmente por:

- Repository
- Service
- DTO
- Mapper
- HTTP Client
- Storage

Los Services conocen los endpoints de CMP_Site y trabajan con DTO.

Los Repositories exponen modelos del dominio al resto de la aplicación y
ocultan los detalles de la fuente de datos.

Los Mappers convierten entre DTO y modelos internos.

## 5. DTO

DTO significa Data Transfer Object.

Un DTO representa exactamente la estructura utilizada para intercambiar
información con CMP_Site.

Ejemplo:

Curso recibido desde CMP_Site:

idCurso
tituloCurso
descripcion

La aplicación móvil no debe depender directamente de estos nombres en sus
pantallas o ViewModels.

## 6. Mapper

Los Mappers convierten DTO externos en modelos internos de la aplicación.

Ejemplo:

idCurso → id
tituloCurso → title
descripcion → description

De esta forma, un cambio en el formato del backend puede resolverse en la
capa de datos sin modificar directamente las pantallas.

## 7. Repository Pattern

El patrón Repository se utiliza como intermediario entre los ViewModels y
las fuentes de datos.

El ViewModel depende de una abstracción Repository y no de una
implementación HTTP concreta.

Flujo:

View
↓
ViewModel
↓
Repository
↓
Service
↓
HTTP Client
↓
API CMP_Site

La respuesta sigue el camino inverso.

API CMP_Site
↓
DTO
↓
Service
↓
Repository
↓
Mapper
↓
Model
↓
ViewModel
↓
View

## 8. Service

Los Services representan las operaciones disponibles en la API.

Ejemplos:

CourseService
AuthService
PurchaseService
MyCoursesService

Un Service devuelve o recibe DTO y no debe contener lógica visual.

## 9. Dependency Injection

Las dependencias se proporcionarán desde un punto de composición.

Esto permite que un ViewModel trabaje con contratos en lugar de depender
directamente de implementaciones concretas.

Ejemplo:

CourseRepositoryImpl recibe CourseService mediante constructor.

Las dependencias compartidas se construyen desde config/dependencies.ts.

## 10. Observer

React utiliza un comportamiento basado en Observer mediante estado,
hooks y Context.

Cuando cambia el estado gestionado por un ViewModel, la View recibe la
actualización y vuelve a renderizar la información correspondiente.

No será necesario crear un sistema Observer paralelo mientras los mecanismos
reactivos de React cubran esta responsabilidad.

## 11. Singleton

Singleton se reservará para componentes de infraestructura que deban
compartir una única instancia durante la ejecución de la aplicación.

Ejemplos previstos:

- Cliente HTTP.
- Configuración compartida.
- Administrador de almacenamiento seguro.

No se utilizará Singleton para modelos, pantallas o ViewModels.

## 12. Proxy

El patrón Proxy se utilizará principalmente para controlar solicitudes
HTTP autenticadas.

Un cliente HTTP autenticado podrá envolver al cliente HTTP principal para:

- Leer el token almacenado de forma segura.
- Agregar Authorization cuando corresponda.
- Interceptar respuestas 401.
- Centralizar comportamiento de autenticación.

Su implementación se realizará cuando se desarrolle el flujo de sesión
móvil.

## 13. Seguridad

Los secretos de infraestructura no deberán almacenarse en la aplicación.

Variables como:

DATABASE_URL
JWT_SECRET

permanecerán únicamente en el backend.

La aplicación utilizará HTTPS para comunicarse con CMP_Site.

Los tokens de autenticación deberán almacenarse utilizando almacenamiento
seguro del dispositivo.

Para builds de producción se contempla protección adicional mediante:

- javascript-obfuscator para código JavaScript.
- R8 / ProGuard para código Android.

Estas medidas complementan la seguridad, pero no sustituyen los controles
del backend.

## 14. Organización modular

La arquitectura permite desarrollar de manera separada los módulos:

Autenticación
Catálogo
Adquisición
Mis cursos
Progreso
Cuenta
Notificaciones

Las funcionalidades comparten infraestructura sin crear dependencias
directas entre pantallas.

## 15. Estados de ViewModel

Los ViewModels que consuman datos deberán contemplar estados como:

idle
loading
success
empty
error

Esto permite mantener la lógica de estado fuera de la interfaz gráfica.

## 16. Regla general

La regla principal de comunicación es:

View → ViewModel → Repository → Service → API

Nunca:

View → API

ni:

React Native → PostgreSQL

## 17. Diagrama lógico

```text
┌─────────────────────────────┐
│            View             │
│ Screens / Components        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          ViewModel          │
│ Estado y presentación       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         Repository          │
│ Abstracción de datos        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Service           │
│ DTO / llamadas de API       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        HTTP Client          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        API CMP_Site         │
└─────────────────────────────┘