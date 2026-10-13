import {MyCourse} from '../../src/models/MyCourse';
import {groupMyCourses} from '../../src/viewmodels/myCourses/groupMyCourses';

const enrollment = (
  enrollmentId: number,
  courseId: number,
  participantName: string,
): MyCourse => ({
  enrollmentId,
  courseId,
  participantName,
  title: 'Curso de prueba',
  description: null,
  imageUrl: null,
  instructorName: 'Instructor',
  categoryName: null,
  modalityName: null,
  startDate: '2099-10-20',
  endDate: '2099-10-22',
  schedule: null,
  enrollmentStatus: 'Activo',
  situation: 'Próximamente',
  progress: {
    totalSessions: 0,
    completedSessions: 0,
    progressPercentage: 0,
    attendancePercentage: 0,
    academicStatus: 'No iniciado',
    lastActivityDate: null,
    completionDate: null,
  },
  nextSession: null,
});

describe('Mis cursos: agrupación por curso y participante', () => {
  test('muestra un curso con dos inscripciones distintas', () => {
    const source = [
      enrollment(1, 10, 'Ana'),
      enrollment(2, 10, 'Carlos'),
    ];
    const result = groupMyCourses(source);

    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe(10);
    expect(result[0].enrollments.map(item => item.participantName)).toEqual([
      'Ana',
      'Carlos',
    ]);
    expect(result[0].enrollments.map(item => item.enrollmentId)).toEqual([
      1,
      2,
    ]);
    expect(source).toHaveLength(2);
  });

  test('mantiene separados cursos distintos', () => {
    const result = groupMyCourses([
      enrollment(1, 10, 'Ana'),
      enrollment(2, 15, 'Carlos'),
    ]);
    expect(result).toHaveLength(2);
  });

  test('conserva tres participantes y una única tarjeta de curso', () => {
    const result = groupMyCourses([
      enrollment(1, 10, 'Ana'),
      enrollment(2, 10, 'Carlos'),
      enrollment(3, 10, 'Luis'),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].enrollments).toHaveLength(3);
  });
});
