import {Course} from '../../models/Course';
import {CourseService} from '../contracts/CourseService';
import {apiRequest} from '../http/httpClient';

export const courseService: CourseService = {
  getCourses(): Promise<Course[]> {
    return apiRequest<Course[]>('/cursos');
  },

  getCourseById(id: number): Promise<Course> {
    return apiRequest<Course>(`/cursos/${id}`);
  },
};