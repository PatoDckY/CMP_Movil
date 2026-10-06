import {AuthRepositoryImpl} from '../repositories/implementations/AuthRepositoryImpl';
import {CourseRepositoryImpl} from '../repositories/implementations/CourseRepositoryImpl';

import {authService} from '../services/implementations/authService';
import {courseService} from '../services/implementations/courseService';

export const authRepository =
  new AuthRepositoryImpl(authService);

export const courseRepository =
  new CourseRepositoryImpl(courseService);