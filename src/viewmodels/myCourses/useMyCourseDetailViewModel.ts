
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MyCourseDetail,
} from '../../models/MyCourse';

import {
  MyCoursesRepository,
} from '../../repositories/contracts/MyCoursesRepository';

export type MyCourseDetailState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

/**
 * ViewModel del detalle académico.
 *
 * Consulta una inscripción existente,
 * no el catálogo de cursos.
 *
 * Utiliza enrollmentId y no courseId.
 */
export function useMyCourseDetailViewModel(
  repository: MyCoursesRepository,
) {
  const [course, setCourse] =
    useState<MyCourseDetail | null>(null);

  const [state, setState] =
    useState<MyCourseDetailState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const requestId = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestId.current += 1;
    };
  }, []);

  const loadMyCourseDetail = useCallback(
    async (
      enrollmentId: number,
    ): Promise<void> => {
      const currentRequestId =
        ++requestId.current;

      if (
        !Number.isSafeInteger(enrollmentId) ||
        enrollmentId <= 0
      ) {
        setCourse(null);
        setError(
          'El identificador de la inscripción no es válido.',
        );
        setState('error');
        return;
      }

      try {
        setState('loading');
        setError(null);

        const result =
          await repository.getMyCourseDetail(
            enrollmentId,
          );

        if (
          !mountedRef.current ||
          currentRequestId !== requestId.current
        ) {
          return;
        }

        setCourse(result);
        setState('success');
      } catch (err) {
        if (
          !mountedRef.current ||
          currentRequestId !== requestId.current
        ) {
          return;
        }

        setCourse(null);

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar el detalle de la inscripción.',
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

    isLoading:
      state === 'loading',

    hasError:
      state === 'error',

    loadMyCourseDetail,
  };
}
