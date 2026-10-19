export interface CourseMaterialsDto {
  success: true;
  idInscripcion: number;
  idCurso: number;
  estado: 'no_iniciado' | 'finalizado' | 'sin_materiales' | 'disponible';
  url?: string;
}
export interface CourseMaterialsService {
  getMaterials(enrollmentId: number): Promise<CourseMaterialsDto>;
}
