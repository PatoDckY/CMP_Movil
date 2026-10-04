import {Course} from '../models/Course';
import {CourseDto} from '../services/dto/CourseDto';

export function mapCourseDtoToModel(dto: CourseDto): Course {
  return {
    id: dto.idCurso,
    title: dto.tituloCurso,
    description: dto.descripcion,

    instructorId: dto.idInstructor,
    instructorName: dto.instructorNombre,
    instructorSpecialty: dto.instructorEspecialidad,

    categoryId: dto.idCategoria,
    categoryName: dto.categoriaNombre,

    locationId: dto.idUbicacion,
    locationName: dto.ubicacionNombre,
    locationAddress: dto.ubicacionDireccion,

    modalityId: dto.idModalidad,
    modalityName: dto.modalidadNombre,

    startDate: dto.fechaInicio,
    endDate: dto.fechaFin,
    schedule: dto.horario,
    targetAudience: dto.dirigidoA,

    maxCapacity: dto.cupoMaximo,
    occupiedCapacity: dto.cuposOcupados,

    cost: dto.costo,
    imageUrl: dto.urlImagenPortada,

    active: dto.activo,

    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}