import {useCallback, useEffect, useRef, useState} from 'react';

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
  const requestId = useRef(0);
  const loadingId = useRef<number | null>(null);
  useEffect(() => () => {
    requestId.current += 1;
    loadingId.current = null;
  }, []);

  const loadCourse = useCallback(
    async (courseId: number) => {
      if (loadingId.current === courseId) { return; }
      const id = ++requestId.current;
      loadingId.current = null;
      if (!Number.isSafeInteger(courseId) || courseId <= 0) {
        setCourse(null); setError('El identificador del curso no es válido.'); setState('error');
        return;
      }
      loadingId.current = courseId;
      try {
        setState('loading');
        setError(null);

        const data =
          await repository.getCourseById(courseId);

        if (id !== requestId.current) { return; }

        setCourse(data);
        setState('success');
      } catch (err) {
        if (id !== requestId.current) { return; }
        setCourse(null);

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar el curso',
        );

        setState('error');
      } finally {
        if (id === requestId.current) { loadingId.current = null; }
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
