import {RepositoryFactory} from '../factories/RepositoryFactory';
import {CourseRepositoryImpl} from '../repositories/implementations/CourseRepositoryImpl';
import {courseService} from '../services/implementations/courseService';

export const authRepository =
  RepositoryFactory.createAuthRepository();

export const courseRepository =
  new CourseRepositoryImpl(
    courseService,
  );