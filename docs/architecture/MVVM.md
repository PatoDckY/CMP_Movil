# Arquitectura de software — SIMG-CMP Móvil

## 1. Propósito

La aplicación móvil SIMG-CMP utiliza una arquitectura por capas con
Model-View-ViewModel (MVVM) como patrón principal para la presentación.

El objetivo de esta arquitectura es separar claramente la interfaz de
usuario, la lógica de presentación, el dominio y el acceso a datos, con
el fin de reducir el acoplamiento y facilitar el mantenimiento,
las pruebas y la evolución del sistema.

La aplicación móvil no tendrá acceso directo a PostgreSQL.

Toda comunicación con la información del sistema deberá realizarse
mediante las rutas API proporcionadas por CMP_Site.

La arquitectura general seguirá el flujo:

View → ViewModel → Repository → Service → HTTP Client → API CMP_Site

## 2. Arquitectura por capas

La aplicación se divide conceptualmente en cuatro capas principales:

### 2.1. Presentación

La capa de presentación contiene los elementos con los que interactúa
directamente el usuario.

Incluye principalmente:

- Screens.
- Components.
- Navigation.

Las Views son responsables de mostrar información, recibir acciones del
usuario y delegarlas al ViewModel correspondiente.

Una View no debe realizar solicitudes HTTP directamente ni contener
lógica relacionada con el acceso a datos.

Ejemplos:

- CatalogScreen.
- LoginScreen.
- RegisterScreen.
- MyCoursesScreen.
- PurchaseDetailScreen.

### 2.2. Lógica de presentación

La lógica de presentación está implementada mediante ViewModels.

Los ViewModels mantienen el estado requerido por una pantalla,
procesan eventos de usuario y solicitan operaciones mediante contratos
Repository.

También son responsables de administrar estados como:

- idle.
- loading.
- success.
- empty.
- error.

El ViewModel no debe conocer URLs, estructuras HTTP ni detalles internos
de CMP_Site.

Ejemplo:

CatalogScreen utiliza useCatalogViewModel.

El ViewModel utiliza CourseRepository.

### 2.3. Dominio

La capa de dominio contiene los modelos internos utilizados por la
aplicación móvil.

Entre las principales entidades identificadas se encuentran:

- User.
- Course.
- Purchase.
- PurchaseDetail.
- MyCourse.
- CourseProgress.
- Notification.

Estos modelos representan la información como la necesita la aplicación
y no necesariamente utilizan los mismos nombres o estructuras del backend.

Por ejemplo, CMP_Site puede devolver:

idCurso  
tituloCurso  
descripcion

Mientras que el modelo móvil utiliza:

id  
title  
description

Los modelos del dominio no deben depender de pantallas, componentes,
HTTP ni estructuras específicas del backend.

### 2.4. Datos e infraestructura

La capa de datos e infraestructura contiene los mecanismos necesarios
para obtener, enviar, transformar y almacenar información.

Está formada principalmente por:

- Repository.
- Service.
- DTO.
- Mapper.
- HTTP Client.
- Storage.
- Configuración de dependencias.

Los Services conocen las operaciones ofrecidas por CMP_Site.

Los Repositories abstraen el origen de los datos.

Los DTO representan los contratos externos.

Los Mappers transforman los DTO en modelos internos y viceversa cuando
sea necesario.

## 3. Model-View-ViewModel

MVVM es el patrón principal utilizado para separar la interfaz de usuario
de la lógica de presentación.

### View

La View representa las pantallas y componentes visuales.

Debe:

- Mostrar datos.
- Capturar eventos del usuario.
- Mostrar estados de carga, error o contenido.
- Delegar operaciones al ViewModel.

No debe:

- Ejecutar fetch directamente.
- Conocer endpoints.
- Acceder directamente a PostgreSQL.
- Convertir estructuras complejas del backend.

### ViewModel

El ViewModel funciona como intermediario entre la View y los contratos
del dominio.

Debe:

- Mantener estado.
- Procesar acciones de la View.
- Consumir contratos Repository.
- Preparar información para la interfaz.
- Gestionar errores y estados de carga.

El ViewModel debe depender de abstracciones y no directamente de
implementaciones concretas.

### Model

El Model representa las entidades internas utilizadas por la aplicación.

Los modelos permanecen independientes de React Native y del formato de
transferencia utilizado por CMP_Site.

## 4. DTO

DTO significa Data Transfer Object.

Los DTO representan las estructuras utilizadas para transferir
información entre CMP_Movil y CMP_Site.

Los DTO deben reflejar el contrato externo de la API.

Ejemplo:

```text
CourseDto

idCurso
tituloCurso
descripcion
idInstructor
fechaInicio
fechaFin
```

Los DTO pertenecen a la capa de datos.

Las pantallas y ViewModels no deben depender directamente de ellos.

## 5. Mapper

Los Mappers convierten datos entre las estructuras externas de CMP_Site
y los modelos internos de CMP_Movil.

Ejemplo:

```text
CourseDto                 Course

idCurso          →        id
tituloCurso      →        title
descripcion      →        description
idInstructor     →        instructorId
```

El Mapper permite desacoplar el dominio móvil del contrato del backend.

El flujo habitual de una respuesta es:

```text
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
```

Cuando la aplicación necesita enviar información al backend, también
puede utilizar un Mapper para transformar un modelo o estructura de
entrada del dominio en un DTO de solicitud.

## 6. Repository Pattern

Repository es uno de los patrones de diseño utilizados formalmente por
la aplicación.

Su responsabilidad es proporcionar al ViewModel una interfaz estable
para obtener o modificar datos sin exponer cómo se obtienen realmente.

Ejemplo:

```text
CatalogScreen
     ↓
useCatalogViewModel
     ↓
CourseRepository
     ↓
CourseRepositoryImpl
     ↓
CourseService
     ↓
API CMP_Site
```

El contrato Repository pertenece a:

```text
src/repositories/contracts
```

Las implementaciones pertenecen a:

```text
src/repositories/implementations
```

Un ViewModel debe depender del contrato Repository y no directamente del
Service.

## 7. Service

Los Services representan las operaciones disponibles en la API de
CMP_Site.

Ejemplos:

- CourseService.
- AuthService.
- PurchaseService.
- MyCoursesService.

Un Service puede recibir o devolver DTO.

El Service conoce los endpoints requeridos, pero no contiene lógica de
interfaz gráfica.

Ejemplo conceptual:

```text
CourseService.getCourses()
        ↓
GET /api/cursos
```

## 8. HTTP Client

El HTTP Client centraliza la comunicación HTTP común.

Es responsable de tareas como:

- Construcción de solicitudes.
- Encabezados comunes.
- Conversión de respuestas JSON.
- Manejo general de errores HTTP.
- Uso de la URL base de CMP_Site.

Actualmente la URL base configurada es:

```text
https://cmp-site.vercel.app/api
```

Las pantallas y ViewModels no deben utilizar fetch directamente.

## 9. Dependency Injection

La aplicación utiliza inyección de dependencias para reducir el
acoplamiento entre implementaciones.

Principalmente se utilizará inyección por constructor.

Ejemplo:

```text
CourseRepositoryImpl
        ↓ recibe
CourseService
```

Las dependencias compartidas se construirán desde un punto de composición
ubicado en:

```text
src/config/dependencies.ts
```

Dependency Injection se considera una técnica arquitectónica y no uno de
los patrones de diseño adicionales definidos para el proyecto.

## 10. Observer Pattern

Observer es uno de los patrones considerados dentro de la arquitectura.

En React Native este comportamiento se obtiene principalmente mediante:

- useState.
- Hooks.
- Context cuando sea necesario.
- Actualización reactiva de componentes.

Cuando cambia el estado administrado por un ViewModel, la View observa
ese cambio y vuelve a renderizar la información correspondiente.

No será necesario implementar un sistema Observer paralelo mientras las
herramientas reactivas de React cubran esta responsabilidad.

## 11. Singleton Pattern

Singleton se utilizará únicamente cuando sea necesario compartir una
sola instancia de infraestructura durante la ejecución de la aplicación.

Se contempla su utilización para componentes como:

- Cliente HTTP.
- Configuración compartida.
- Almacenamiento seguro de credenciales o tokens.

No se utilizará Singleton indiscriminadamente.

Los Models, Views y ViewModels no deben convertirse en Singleton.

## 12. Proxy Pattern

Proxy se utilizará principalmente en el manejo futuro de solicitudes
autenticadas.

Se contempla un componente como:

```text
AuthenticatedHttpClient
```

que envolverá al cliente HTTP principal.

Este Proxy podrá ser responsable de:

- Obtener el token almacenado de forma segura.
- Agregar el encabezado Authorization.
- Controlar respuestas 401.
- Centralizar comportamiento relacionado con autenticación.

Su implementación se realizará cuando se desarrolle el flujo de sesión
móvil.

## 13. Autenticación

Los contratos de autenticación contemplan las operaciones necesarias para:

- Inicio de sesión.
- Solicitud de código OTP para registro.
- Registro de usuario.
- Verificación de sesión.
- Cierre de sesión.
- Respuesta de autenticación con MFA requerido.

El backend web actualmente administra la sesión mediante autenticación
propia de CMP_Site.

La adaptación necesaria para autenticación móvil y almacenamiento seguro
del token se realizará en las actividades correspondientes al manejo de
sesión.

No se almacenarán secretos del servidor en CMP_Movil.

## 14. Adquisición y pagos

El dominio de adquisición contempla:

- Purchase.
- PurchaseDetail.
- PurchaseParticipant.
- PaymentMethod.
- CoursePayment.
- PaymentSummary.

Los contratos permiten representar operaciones como:

- Listar compras.
- Crear una compra.
- Consultar el detalle de una compra.
- Obtener métodos de pago.
- Reportar un pago.

Las estructuras externas se representan mediante PurchaseDto y las
conversiones se centralizan en purchaseMapper.

## 15. Mis cursos y progreso

El módulo Mis Cursos representa la relación del usuario con los cursos
en los que está inscrito.

Los modelos principales incluyen:

- MyCourse.
- MyCourseDetail.
- CourseSession.
- CourseProgress.

El progreso académico se encuentra relacionado con la inscripción y
contempla datos como:

- Número total de sesiones.
- Sesiones completadas.
- Porcentaje de avance.
- Porcentaje de asistencia.
- Estado académico.
- Fecha de última actividad.
- Fecha de finalización.

## 16. Notificaciones

La aplicación contempla el modelo Notification y un contrato Repository
para el acceso futuro a notificaciones académicas.

Actualmente CMP_Site dispone de estructuras de notificación en el
backend, pero no se ha identificado una API de cliente completa para
consultarlas desde CMP_Movil.

Por esta razón no se inventará un endpoint ni una implementación Service
que todavía no exista.

La implementación se realizará cuando CMP_Site exponga el contrato
correspondiente.

## 17. Seguridad

CMP_Movil no almacenará secretos propios de la infraestructura.

Información como:

```text
DATABASE_URL
JWT_SECRET
```

debe permanecer exclusivamente en CMP_Site.

La aplicación utilizará HTTPS para comunicarse con el backend.

Los tokens o credenciales de sesión móvil deberán almacenarse mediante un
mecanismo seguro del dispositivo.

Para builds de producción se contempla protección adicional mediante:

```text
javascript-obfuscator
R8 / ProGuard
```

javascript-obfuscator permitirá dificultar el análisis del código
JavaScript generado.

R8 / ProGuard permitirá aplicar optimización y ofuscación al código
Android en builds de producción.

Estas herramientas complementan la seguridad, pero no sustituyen los
controles implementados en el backend.

## 18. Organización modular

La arquitectura permite desarrollar de forma separada los siguientes
módulos funcionales:

- Autenticación.
- Catálogo.
- Adquisición.
- Mis cursos.
- Progreso.
- Cuenta.
- Notificaciones.

Cada módulo puede incorporar sus propios Models, DTO, Mappers, Services,
Repositories, ViewModels y Views según sus necesidades.

## 19. Flujo general

La regla principal de comunicación será:

```text
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
  ↓
PostgreSQL
```

La aplicación móvil nunca utilizará:

```text
View → API
```

ni:

```text
React Native → PostgreSQL
```

## 20. Diagrama lógico

```text
┌─────────────────────────────┐
│            View             │
│ Screens / Components        │
└──────────────┬──────────────┘
               │ acciones / estado
               ▼
┌─────────────────────────────┐
│          ViewModel          │
│ Estado y lógica presentación│
└──────────────┬──────────────┘
               │ contrato
               ▼
┌─────────────────────────────┐
│         Repository          │
│ Abstracción de datos        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           Service           │
│ Operaciones / DTO           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        HTTP Client          │
│ Solicitudes / errores       │
└──────────────┬──────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────┐
│        API CMP_Site         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

Los Mappers convierten la información entre los DTO de infraestructura y
los modelos internos utilizados por la aplicación.

La arquitectura definitiva establece como flujo estándar:

```text
View → ViewModel → Repository → Service → HTTP Client → API CMP_Site
```