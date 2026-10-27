import {
  MyCourseDetail,
  MyCoursesData,
} from '../../models/MyCourse';

export interface MyCoursesRepository {
  getMyCourses(): Promise<MyCoursesData>;

  getMyCourseDetail(
    enrollmentId: number,
  ): Promise<MyCourseDetail>;
}