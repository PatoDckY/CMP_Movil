import {CourseDto} from '../dto/CourseDto';

export interface CourseService {
  getCourses(): Promise<CourseDto[]>;
  getCourseById(id: number): Promise<CourseDto>;
}