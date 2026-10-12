
import {
  MyCourseDetail,
  MyCoursesData,
} from '../../models/MyCourse';

import {
  mapMyCourseDetailDtoToModel,
  mapMyCoursesResponseDtoToModel,
} from '../../mappers/myCourseMapper';

import {
  MyCoursesService,
} from '../../services/contracts/MyCoursesService';

import {
  MyCoursesRepository,
} from '../contracts/MyCoursesRepository';

/**
 * Implementación del repositorio
 * de cursos inscritos.
 *
 * Comunica la capa de servicios
 * con los modelos de la aplicación.
 *
 * Las conversiones de datos
 * se realizan mediante los
 * mappers existentes.
 */
export class MyCoursesRepositoryImpl
  implements MyCoursesRepository {

  constructor(
    private readonly myCoursesService: MyCoursesService,
  ) {}

  /**
   * Obtiene las inscripciones
   * del usuario autenticado.
   *
   * Incluye el resumen general
   * y la lista de cursos.
   */
  async getMyCourses(): Promise<MyCoursesData> {
    const responseDto =
      await this.myCoursesService.getMyCourses();

    return mapMyCoursesResponseDtoToModel(
      responseDto,
    );
  }

  /**
   * Obtiene el detalle completo
   * de una inscripción.
   *
   * Incluye información académica,
   * progreso, sesiones y asistencia.
   */
  async getMyCourseDetail(
    enrollmentId: number,
  ): Promise<MyCourseDetail> {
    const responseDto =
      await this.myCoursesService.getMyCourseDetail(
        enrollmentId,
      );

    return mapMyCourseDetailDtoToModel(
      responseDto.curso,
    );
  }
}
