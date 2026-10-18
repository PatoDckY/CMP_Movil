import {CourseService} from '../contracts/CourseService';
import {CourseDto} from '../dto/CourseDto';
import {apiRequest} from '../http/httpClient';

export const courseService: CourseService = {
  getCourses(): Promise<CourseDto[]> {
    return apiRequest<CourseDto[]>('/cursos', {}, {timeoutMs: 15_000});
  },

  getCourseById(id: number): Promise<CourseDto> {
    if (!Number.isSafeInteger(id) || id <= 0) {
      return Promise.reject(new Error('El identificador del curso no es válido.'));
    }
    return apiRequest<CourseDto>(`/cursos/${id}`, {}, {timeoutMs: 15_000});
  },
};
