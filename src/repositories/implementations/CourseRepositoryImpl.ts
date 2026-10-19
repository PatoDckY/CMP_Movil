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
    if (!Number.isSafeInteger(id) || id <= 0) {throw new Error('El identificador del curso no es válido.');}
    const courseDto = await this.courseService.getCourseById(id);

    if (courseDto?.idCurso !== id) {throw new Error('El servidor no confirmó la información del curso seleccionado.');}

    return mapCourseDtoToModel(courseDto);
  }
}
