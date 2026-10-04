import {
  CourseSession,
  MyCourse,
  MyCourseDetail,
  MyCoursesData,
} from '../models/MyCourse';

import {
  CourseSessionDetailDto,
  MyCourseDetailDto,
  MyCourseSummaryDto,
  MyCoursesResponseDto,
} from '../services/dto/MyCourseDto';

export function mapMyCourseDtoToModel(
  dto: MyCourseSummaryDto,
): MyCourse {
  return {
    enrollmentId: dto.idInscripcion,
    courseId: dto.idCurso,

    title: dto.tituloCurso,
    description: dto.descripcion,
    imageUrl: dto.urlImagenPortada,

    instructorName: dto.instructorNombre,

    categoryName: dto.categoriaNombre,
    modalityName: dto.modalidadNombre,

    startDate: dto.fechaInicio,
    endDate: dto.fechaFin,
    schedule: dto.horario,

    participantName: dto.participanteNombre,

    enrollmentStatus: dto.estadoInscripcion,

    situation: dto.situacionCurso,

    progress: {
      totalSessions: dto.sesionesTotales,
      completedSessions: dto.sesionesCompletadas,

      progressPercentage: dto.porcentajeAvance,
      attendancePercentage: dto.porcentajeAsistencia,

      academicStatus: dto.estadoAcademico,

      lastActivityDate: null,
      completionDate: null,
    },

    nextSession: dto.proximaSesion
      ? {
          id: dto.proximaSesion.idSesion,
          number: dto.proximaSesion.numeroSesion,

          title: dto.proximaSesion.titulo,

          date: dto.proximaSesion.fecha,

          startTime: dto.proximaSesion.horaInicio,
          endTime: dto.proximaSesion.horaFin,

          status: dto.proximaSesion.estado,
        }
      : null,
  };
}

function mapCourseSessionDtoToModel(
  dto: CourseSessionDetailDto,
): CourseSession {
  return {
    id: dto.idSesion,
    number: dto.numeroSesion,

    title: dto.titulo,
    description: dto.descripcion,

    date: dto.fecha,

    startTime: dto.horaInicio,
    endTime: dto.horaFin,

    status: dto.estado,

    modalityName: dto.modalidadNombre,

    locationName: dto.ubicacionNombre,
    fullAddress: dto.direccionCompleta,

    virtualLink: dto.enlaceVirtual,

    attendanceStatus: dto.estadoAsistencia,

    checkInTime: dto.horaEntrada,
    checkOutTime: dto.horaSalida,

    lateMinutes: dto.minutosRetardo,

    justified: dto.justificada,

    justificationReason: dto.motivoJustificacion,

    attendanceNotes: dto.observacionesAsistencia,
  };
}

export function mapMyCourseDetailDtoToModel(
  dto: MyCourseDetailDto,
): MyCourseDetail {
  return {
    enrollmentId: dto.idInscripcion,

    enrollmentStatus: dto.estadoInscripcion,
    enrollmentDate: dto.fechaInscripcion,
    enrollmentOrigin: dto.origenInscripcion,

    participantId: dto.participanteId,
    participantName: dto.participanteNombre,

    participantEmail: dto.participanteCorreo,
    participantPhone: dto.participanteTelefono,

    courseId: dto.idCurso,

    title: dto.tituloCurso,
    description: dto.descripcion,
    imageUrl: dto.urlImagenPortada,

    instructorName: dto.instructorNombre,
    instructorSpecialty: dto.instructorEspecialidad,

    categoryName: dto.categoriaNombre,
    modalityName: dto.modalidadNombre,

    locationName: dto.ubicacionNombre,
    fullAddress: dto.direccionCompleta,

    startDate: dto.fechaInicio,
    endDate: dto.fechaFin,
    schedule: dto.horario,

    situation: dto.situacionCurso,

    progress: {
      totalSessions: dto.sesionesTotales,
      completedSessions: dto.sesionesCompletadas,

      progressPercentage: dto.porcentajeAvance,
      attendancePercentage: dto.porcentajeAsistencia,

      academicStatus: dto.estadoAcademico,

      lastActivityDate: dto.fechaUltimaActividad,
      completionDate: dto.fechaFinalizacion,
    },

    sessions: dto.sesiones.map(
      mapCourseSessionDtoToModel,
    ),
  };
}

export function mapMyCoursesResponseDtoToModel(
  dto: MyCoursesResponseDto,
): MyCoursesData {
  return {
    summary: {
      totalEnrollments: dto.resumen.totalInscripciones,
      upcomingCourses: dto.resumen.cursosProximos,
      activeCourses: dto.resumen.cursosEnCurso,
      finishedCourses: dto.resumen.cursosFinalizados,
      completedCourses: dto.resumen.cursosCompletados,
    },

    courses: dto.cursos.map(mapMyCourseDtoToModel),
  };
}