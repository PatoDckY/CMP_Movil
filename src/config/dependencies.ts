import {CourseRepositoryImpl} from '../repositories/contracts/CourseRepositoryImpl';
import {courseService} from '../services/implementations/courseService';

export const courseRepository = new CourseRepositoryImpl(courseService);