import {useCallback, useState} from 'react';

import {Course} from '../../models/Course';
import {CourseRepository} from '../../repositories/contracts/CourseRepository';

export type CourseDetailState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export function useCourseDetailViewModel(
  repository: CourseRepository,
) {
  const [course, setCourse] =
    useState<Course | null>(null);

  const [state, setState] =
    useState<CourseDetailState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const loadCourse = useCallback(
    async (courseId: number) => {
      try {
        setState('loading');
        setError(null);

        const data =
          await repository.getCourseById(courseId);

        setCourse(data);
        setState('success');
      } catch (err) {
        setCourse(null);

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar el curso',
        );

        setState('error');
      }
    },
    [repository],
  );

  return {
    course,
    state,
    error,
    loadCourse,
  };
}