# Arquitectura MVVM — SIMG-CMP Móvil

## 1. Propósito

La aplicación móvil SIMG-CMP utilizará el patrón arquitectónico
Model-View-ViewModel (MVVM) para separar la interfaz de usuario,
la lógica de presentación, las reglas y estructuras del dominio,
y el acceso a servicios externos.

La arquitectura busca facilitar el mantenimiento, las pruebas,
la reutilización de componentes y el crecimiento modular de la aplicación.

## 2. Capas principales

### View

La capa View contiene las pantallas y componentes visuales de la aplicación.

Responsabilidades:

- Mostrar información al usuario.
- Capturar acciones e interacción.
- Representar estados de carga, éxito, vacío y error.
- Delegar la lógica al ViewModel.
- No realizar directamente solicitudes HTTP ni implementar reglas de negocio.

Ejemplos:

- LoginScreen
- RegisterScreen
- CatalogScreen
- CourseDetailScreen
- MyCoursesScreen
- ProfileScreen

### ViewModel

La capa ViewModel actúa como intermediaria entre View y Model/servicios.

Responsabilidades:

- Administrar el estado utilizado por la vista.
- Procesar eventos generados por el usuario.
- Ejecutar casos de uso de la aplicación.
- Consumir servicios o repositorios.
- Preparar información para mostrarla en la interfaz.
- Administrar estados de carga y error.

La View no debe conocer los detalles de comunicación con APIs.

### Model

La capa Model representa las entidades y estructuras de datos utilizadas
por la aplicación.

Responsabilidades:

- Definir entidades del dominio.
- Definir tipos e interfaces.
- Representar datos recibidos o enviados a servicios.
- Mantener modelos independientes de la interfaz de usuario.

Ejemplos:

- User
- Course
- Lesson
- Progress
- Notification
- Acquisition

### Services / Data

Esta capa será responsable de la comunicación con fuentes externas.

Responsabilidades:

- Comunicación con la API de SIMG-CMP.
- Solicitudes HTTP.
- Manejo de autenticación y tokens.
- Persistencia local cuando corresponda.
- Conversión de respuestas externas a estructuras utilizadas por la aplicación.

La View nunca deberá acceder directamente a esta capa.

## 3. Flujo de comunicación

El flujo principal será:

View
↓
ViewModel
↓
Service / Repository
↓
API SIMG-CMP

La respuesta seguirá el flujo inverso:

API SIMG-CMP
↓
Service / Repository
↓
ViewModel
↓
View

## 4. Separación de responsabilidades

La aplicación mantendrá separadas las siguientes responsabilidades:

Presentación:
Pantallas, componentes y navegación.

Lógica de presentación:
ViewModels y administración de estados.

Dominio:
Modelos, entidades y reglas independientes de la interfaz.

Datos:
Servicios, clientes HTTP, almacenamiento local y comunicación con APIs.

## 5. Dependencias

Las dependencias deberán dirigirse desde las capas externas hacia las
abstracciones internas.

Una pantalla podrá utilizar un ViewModel.

Un ViewModel podrá utilizar servicios o repositorios.

Los servicios podrán utilizar el cliente HTTP y mecanismos de almacenamiento.

Los modelos no deberán depender de pantallas ni componentes visuales.

## 6. Módulos previstos

La arquitectura deberá permitir desarrollar de manera independiente los módulos:

- Autenticación
- Catálogo
- Adquisición
- Mis cursos
- Progreso
- Cuenta
- Notificaciones

Además existirán elementos compartidos para navegación, componentes,
configuración y utilidades.

## 7. Manejo de estado

Cada ViewModel será responsable del estado necesario para su funcionalidad.

Como mínimo, los flujos que consuman servicios deberán contemplar:

- Estado inicial.
- Estado de carga.
- Estado exitoso.
- Estado vacío cuando corresponda.
- Estado de error.

La selección de herramientas adicionales de manejo global de estado deberá
justificarse según las necesidades reales del proyecto.

## 8. Navegación

La navegación será responsabilidad de la capa de presentación.

Se distinguirán inicialmente dos contextos:

- Navegación pública.
- Navegación autenticada.

La autorización para acceder a determinadas funcionalidades dependerá del
estado de autenticación y de las reglas definidas por el sistema.

## 9. Regla general de arquitectura

Una pantalla no debe contener reglas de negocio ni acceder directamente
a la API.

La comunicación recomendada será:

View → ViewModel → Service/Repository → API

Esto permitirá mantener bajo acoplamiento entre la interfaz y la infraestructura.

## 10. Diagrama lógico

```text
┌─────────────────────────────┐
│            View             │
│ Screens / Components        │
└──────────────┬──────────────┘
               │ acciones / estado
               ▼
┌─────────────────────────────┐
│          ViewModel          │
│ Estado + lógica presentación│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Services/Repositories   │
│ API / Storage / Auth        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        API SIMG-CMP         │
└─────────────────────────────┘

Models y entidades son compartidos por las capas que los requieren,
sin depender de la interfaz gráfica.