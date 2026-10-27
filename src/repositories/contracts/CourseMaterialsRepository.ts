import {CourseMaterials} from '../../models/CourseMaterials';
export interface CourseMaterialsRepository {
  getMaterials(enrollmentId: number): Promise<CourseMaterials>;
}
