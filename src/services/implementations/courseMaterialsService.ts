import {CourseMaterialsService, CourseMaterialsDto} from '../contracts/CourseMaterialsService';
import {apiRequest} from '../http/httpClient';

export const courseMaterialsService: CourseMaterialsService = {
  getMaterials(enrollmentId) {
    if (!Number.isSafeInteger(enrollmentId) || enrollmentId <= 0) {
      return Promise.reject(new Error('La inscripción no es válida.'));
    }
    return apiRequest<CourseMaterialsDto>(`/cliente/mis-cursos/${enrollmentId}/materiales`,
      {method: 'GET', headers: {'Cache-Control': 'no-store'}},
      {requireAuthentication: true, timeoutMs: 15_000, expectedStatus: 200});
  },
};
