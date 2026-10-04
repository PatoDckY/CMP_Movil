import {CourseProgress} from './Progress';

export type CourseSituation =
  | 'Próximamente'
  | 'En curso'
  | 'Finalizado';

export interface NextCourseSession {
  id: number;
  number: number;

  title: string;

  date: string;
  startTime: string;
  endTime: string;

  status: string;
}

export interface MyCoursesSummary {
  totalEnrollments: number;
  upcomingCourses: number;
  activeCourses: number;
  finishedCourses: number;
  completedCourses: number;
}

export interface MyCourse {
  enrollmentId: number;
  courseId: number;

  title: string;
  description: string | null;
  imageUrl: string | null;

  instructorName: string;

  categoryName: string | null;
  modalityName: string | null;

  startDate: string;
  endDate: string;
  schedule: string | null;

  participantName: string;

  enrollmentStatus: string;

  situation: CourseSituation;

  progress: CourseProgress;

  nextSession: NextCourseSession | null;
}

export interface CourseSession {
  id: number;
  number: number;

  title: string;
  description: string | null;

  date: string;

  startTime: string;
  endTime: string;

  status: string;

  modalityName: string | null;

  locationName: string | null;
  fullAddress: string | null;

  virtualLink: string | null;

  attendanceStatus: string;

  checkInTime: string | null;
  checkOutTime: string | null;

  lateMinutes: number | null;

  justified: boolean;
  justificationReason: string | null;

  attendanceNotes: string | null;
}

export interface MyCourseDetail {
  enrollmentId: number;

  enrollmentStatus: string;
  enrollmentDate: string | null;
  enrollmentOrigin: string;

  participantId: number | null;
  participantName: string;

  participantEmail: string | null;
  participantPhone: string | null;

  courseId: number;

  title: string;
  description: string | null;
  imageUrl: string | null;

  instructorName: string;
  instructorSpecialty: string | null;

  categoryName: string | null;
  modalityName: string | null;

  locationName: string | null;
  fullAddress: string | null;

  startDate: string;
  endDate: string;
  schedule: string | null;

  situation: CourseSituation;

  progress: CourseProgress;

  sessions: CourseSession[];
}

export interface MyCoursesData {
  summary: MyCoursesSummary;
  courses: MyCourse[];
}