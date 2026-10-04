import {Course} from '../../models/Course';
import {mapCourseDtoToModel} from '../../mappers/courseMapper';
import {CourseService} from '../../services/contracts/CourseService';
import {CourseRepository} from '../contracts/CourseRepository';

export class CourseRepositoryImpl implements CourseRepository {
  constructor(private readonly courseService: CourseService) {}

  async getCourses(): Promise<Course[]> {
    const coursesDto = await this.courseService.getCourses();

    return coursesDto.map(mapCourseDtoToModel);
  }

  async getCourseById(id: number): Promise<Course> {
    const courseDto = await this.courseService.getCourseById(id);

    return mapCourseDtoToModel(courseDto);
  }
}