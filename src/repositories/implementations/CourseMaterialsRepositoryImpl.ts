import {CourseMaterials, isDriveFolderUrl} from '../../models/CourseMaterials';
import {CourseMaterialsService} from '../../services/contracts/CourseMaterialsService';
import {CourseMaterialsRepository} from '../contracts/CourseMaterialsRepository';

export class CourseMaterialsRepositoryImpl implements CourseMaterialsRepository {
  constructor(private readonly service: CourseMaterialsService) {}
  async getMaterials(enrollmentId: number): Promise<CourseMaterials> {
    if (!Number.isSafeInteger(enrollmentId) || enrollmentId <= 0) {throw new Error('La inscripción no es válida.');}
    const dto = await this.service.getMaterials(enrollmentId);
    if (!dto || dto.success !== true || dto.idInscripcion !== enrollmentId || !Number.isSafeInteger(dto.idCurso) || dto.idCurso <= 0 ||
      !['no_iniciado', 'finalizado', 'sin_materiales', 'disponible'].includes(dto.estado) ||
      (dto.estado === 'disponible' ? !isDriveFolderUrl(dto.url) : dto.url !== undefined)) {
      throw new Error('No fue posible verificar la respuesta de materiales.');
    }
    return {enrollmentId, courseId: dto.idCurso, status: dto.estado, ...(dto.estado === 'disponible' ? {url: dto.url} : {})};
  }
}
