import {Course} from '../../models/Course';

export interface CourseRepository {
  getCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course>;
}