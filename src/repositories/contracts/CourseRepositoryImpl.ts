import {Course} from '../../models/Course';
import {CourseRepository} from '../contracts/CourseRepository';
import {CourseService} from '../../services/contracts/CourseService';

export class CourseRepositoryImpl implements CourseRepository {
  constructor(private readonly courseService: CourseService) {}

  getCourses(): Promise<Course[]> {
    return this.courseService.getCourses();
  }

  getCourseById(id: number): Promise<Course> {
    return this.courseService.getCourseById(id);
  }
}