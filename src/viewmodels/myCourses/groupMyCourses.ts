import {MyCourse} from '../../models/MyCourse';

export interface MyCourseGroup {
  courseId: number;
  enrollments: MyCourse[];
}

/**
 * El API entrega una inscripción por participante.
 * Una misma cuenta puede tener varias inscripciones del mismo curso.
 * Conserva el orden recibido y los IDs de cada inscripción.
 */
export function groupMyCourses(
  enrollments: ReadonlyArray<MyCourse>,
): MyCourseGroup[] {
  const groups = new Map<number, MyCourseGroup>();

  for (const enrollment of enrollments) {
    let group = groups.get(enrollment.courseId);

    if (!group) {
      group = {
        courseId: enrollment.courseId,
        enrollments: [],
      };
      groups.set(enrollment.courseId, group);
    }

    group.enrollments.push(enrollment);
  }

  return [...groups.values()];
}
