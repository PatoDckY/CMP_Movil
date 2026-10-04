import {Course} from '../../models/Course';

export interface CourseService {
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course>;
}