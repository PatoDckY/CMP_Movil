
import {
  MyCoursesService,
} from '../contracts/MyCoursesService';

import {
  MyCourseDetailResponseDto,
  MyCoursesResponseDto,
} from '../dto/MyCourseDto';

import {
  apiRequest,
} from '../http/httpClient';

export const myCourseService: MyCoursesService = {
  /**
   * Obtener los cursos inscritos
   * del usuario autenticado.
   *
   * GET /api/cliente/mis-cursos
   */
  getMyCourses(): Promise<MyCoursesResponseDto> {
    return apiRequest<MyCoursesResponseDto>(
      '/cliente/mis-cursos',
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    );
  },

  /**
   * Consultar el detalle de una inscripción.
   *
   * GET /api/cliente/mis-cursos/{id}
   */
  getMyCourseDetail(
    enrollmentId: number,
  ): Promise<MyCourseDetailResponseDto> {
    if (
      !Number.isSafeInteger(enrollmentId) ||
      enrollmentId <= 0
    ) {
      return Promise.reject(
        new Error(
          'El identificador de la inscripción no es válido.',
        ),
      );
    }

    return apiRequest<MyCourseDetailResponseDto>(
      `/cliente/mis-cursos/${enrollmentId}`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    );
  },
};
