export interface CourseProgress {
  totalSessions: number;
  completedSessions: number;

  progressPercentage: number;
  attendancePercentage: number;

  academicStatus: string;

  lastActivityDate: string | null;
  completionDate: string | null;
}