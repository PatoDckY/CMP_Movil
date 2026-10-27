export type CourseSituationDto =
  | 'Próximamente'
  | 'En curso'
  | 'Finalizado';

export interface NextSessionDto {
  idSesion: number;
  numeroSesion: number;

  titulo: string;

  fecha: string;
  horaInicio: string;
  horaFin: string;

  estado: string;
}

export interface MyCourseSummaryDto {
  idInscripcion: number;
  idCurso: number;

  tituloCurso: string;
  descripcion: string | null;
  urlImagenPortada: string | null;

  instructorNombre: string;

  categoriaNombre: string | null;
  modalidadNombre: string | null;

  fechaInicio: string;
  fechaFin: string;
  horario: string | null;

  participanteNombre: string;

  estadoInscripcion: string;
  estadoAcademico: string;

  sesionesTotales: number;
  sesionesCompletadas: number;

  porcentajeAvance: number;
  porcentajeAsistencia: number;

  situacionCurso: CourseSituationDto;

  proximaSesion: NextSessionDto | null;
}

export interface MyCoursesGlobalSummaryDto {
  totalInscripciones: number;
  cursosProximos: number;
  cursosEnCurso: number;
  cursosFinalizados: number;
  cursosCompletados: number;
}

export interface MyCoursesResponseDto {
  success: true;

  resumen: MyCoursesGlobalSummaryDto;
  cursos: MyCourseSummaryDto[];
}

export interface CourseSessionDetailDto {
  idSesion: number;
  numeroSesion: number;

  titulo: string;
  descripcion: string | null;

  fecha: string;

  horaInicio: string;
  horaFin: string;

  estado: string;

  modalidadNombre: string | null;

  ubicacionNombre: string | null;
  direccionCompleta: string | null;

  enlaceVirtual: string | null;

  estadoAsistencia: string;

  horaEntrada: string | null;
  horaSalida: string | null;

  minutosRetardo: number | null;

  justificada: boolean;

  motivoJustificacion: string | null;
  observacionesAsistencia: string | null;
}

export interface MyCourseDetailDto {
  idInscripcion: number;

  estadoInscripcion: string;
  fechaInscripcion: string | null;
  origenInscripcion: string;

  participanteId: number | null;
  participanteNombre: string;

  participanteCorreo: string | null;
  participanteTelefono: string | null;

  idCurso: number;

  tituloCurso: string;
  descripcion: string | null;
  urlImagenPortada: string | null;

  instructorNombre: string;
  instructorEspecialidad: string | null;

  categoriaNombre: string | null;
  modalidadNombre: string | null;

  ubicacionNombre: string | null;
  direccionCompleta: string | null;

  fechaInicio: string;
  fechaFin: string;
  horario: string | null;

  situacionCurso: CourseSituationDto;

  sesionesTotales: number;
  sesionesCompletadas: number;

  porcentajeAvance: number;
  porcentajeAsistencia: number;

  estadoAcademico: string;

  fechaUltimaActividad: string | null;
  fechaFinalizacion: string | null;

  sesiones: CourseSessionDetailDto[];
}

export interface MyCourseDetailResponseDto {
  success: true;
  curso: MyCourseDetailDto;
}