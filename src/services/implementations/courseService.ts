import {CourseService} from '../contracts/CourseService';
import {CourseDto} from '../dto/CourseDto';
import {apiRequest} from '../http/httpClient';

export const courseService: CourseService = {
  getCourses(): Promise<CourseDto[]> {
    return apiRequest<CourseDto[]>('/cursos');
  },

  getCourseById(id: number): Promise<CourseDto> {
    return apiRequest<CourseDto>(`/cursos/${id}`);
  },
};