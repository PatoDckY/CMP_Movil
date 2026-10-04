import {
  MyCourseDetailResponseDto,
  MyCoursesResponseDto,
} from '../dto/MyCourseDto';

export interface MyCoursesService {
  getMyCourses(): Promise<MyCoursesResponseDto>;

  getMyCourseDetail(
    enrollmentId: number,
  ): Promise<MyCourseDetailResponseDto>;
}