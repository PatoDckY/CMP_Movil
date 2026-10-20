
import {
  RepositoryFactory,
} from '../factories/RepositoryFactory';
import {AccountRepositoryImpl} from '../repositories/implementations/AccountRepositoryImpl';
import {accountService} from '../services/implementations/accountService';
import {OptOutPreferencesRepositoryImpl} from '../repositories/implementations/OptOutPreferencesRepositoryImpl';
import {keychainPreferencesStorage} from '../storage/keychainPreferencesStorage';
import {passwordRecoveryService} from '../services/implementations/passwordRecoveryService';
import {CourseMaterialsRepositoryImpl} from '../repositories/implementations/CourseMaterialsRepositoryImpl';
import {courseMaterialsService} from '../services/implementations/courseMaterialsService';
import {tokenStorage} from '../services/security/tokenStorage';
import {sessionEvents} from '../services/security/sessionEvents';

export const courseMaterialsRepository = new CourseMaterialsRepositoryImpl(courseMaterialsService);
export const courseMaterialsSessionScope = {
  version: tokenStorage.getSessionVersion,
  subscribe: sessionEvents.subscribe,
};

export const accountRepository = new AccountRepositoryImpl(accountService);

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
  PasswordRecoveryRepositoryImpl,
} from '../repositories/implementations/PasswordRecoveryRepositoryImpl';

import {
  ProfileRepositoryImpl,
} from '../repositories/implementations/ProfileRepositoryImpl';

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
  profileService,
} from '../services/implementations/profileService';

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
 */
export const purchaseRepository =
  new PurchaseRepositoryImpl(
    purchaseService,
  );

/**
 * Repositorio de Mis cursos.
 */
export const myCoursesRepository =
  new MyCoursesRepositoryImpl(
    myCourseService,
  );

/**
 * Repositorio de recuperación de contraseña.
 */
export const passwordRecoveryRepository =
  new PasswordRecoveryRepositoryImpl(passwordRecoveryService);

/**
 * A17 - Derechos ARCO.
 *
 * Acceso y rectificación de
 * los datos personales.
 */
export const profileRepository =
  new ProfileRepositoryImpl(
    profileService,
  );

/**
 * A66 - Derecho de oposición (Opt-Out).
 *
 * Persistencia local mientras CMP_Site no exponga un endpoint.
 */
export const optOutPreferencesRepository =
  new OptOutPreferencesRepositoryImpl(
    keychainPreferencesStorage,
  );
