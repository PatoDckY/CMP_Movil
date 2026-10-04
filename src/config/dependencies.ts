import {CourseRepositoryImpl} from '../repositories/implementations/CourseRepositoryImpl';
import {courseService} from '../services/implementations/courseService';

export const courseRepository = new CourseRepositoryImpl(courseService);