
import {
  RepositoryFactory,
} from '../factories/RepositoryFactory';

import {
  CourseRepositoryImpl,
} from '../repositories/implementations/CourseRepositoryImpl';

import {
  MyCoursesRepositoryImpl,
} from '../repositories/implementations/MyCoursesRepositoryImpl';

import {
  PurchaseRepositoryImpl,
} from '../repositories/implementations/PurchaseRepositoryImpl';

import {
  courseService,
} from '../services/implementations/courseService';

import {
  myCourseService,
} from '../services/implementations/myCourseService';

import {
  purchaseService,
} from '../services/implementations/purchaseService';

import {
  PasswordRecoveryRepositoryImpl,
} from '../repositories/implementations/PasswordRecoveryRepositoryImpl';

/**
 * Repositorio de autenticación.
 */
export const authRepository =
  RepositoryFactory.createAuthRepository();

/**
 * Repositorio del catálogo de cursos.
 */
export const courseRepository =
  new CourseRepositoryImpl(
    courseService,
  );

/**
 * Repositorio de compras.
 *
 * Mantiene el módulo de reservas,
 * historial y reportes de pago.
 */
export const purchaseRepository =
  new PurchaseRepositoryImpl(
    purchaseService,
  );

/**
 * Repositorio de Mis cursos.
 *
 * Consulta las inscripciones reales
 * del usuario en CMP_Site.
 */
export const myCoursesRepository =
  new MyCoursesRepositoryImpl(
    myCourseService,
  );



/**
 * Repositorio de recuperación de contraseña.
 */
export const passwordRecoveryRepository =
  new PasswordRecoveryRepositoryImpl();