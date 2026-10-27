
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MyCourse,
  MyCoursesData,
  MyCoursesSummary,
} from '../../models/MyCourse';

import {
  MyCoursesRepository,
} from '../../repositories/contracts/MyCoursesRepository';

export type MyCoursesState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

const INITIAL_SUMMARY: MyCoursesSummary = {
  totalEnrollments: 0,
  upcomingCourses: 0,
  activeCourses: 0,
  finishedCourses: 0,
  completedCourses: 0,
};

const EMPTY_COURSES: MyCourse[] = [];

/**
 * ViewModel del módulo Mis cursos.
 *
 * Responsabilidades:
 * - Consultar las inscripciones reales.
 * - Administrar los estados de carga.
 * - Manejar errores de conexión.
 * - Proporcionar el resumen académico.
 * - Permitir actualizar la información.
 *
 * No contiene componentes visuales
 * ni realiza peticiones HTTP directas.
 */
export function useMyCoursesViewModel(
  repository: MyCoursesRepository,
) {
  const [data, setData] =
    useState<MyCoursesData | null>(null);

  const [state, setState] =
    useState<MyCoursesState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const requestId = useRef(0);

  const mountedRef = useRef(true);

  /**
   * Evita actualizar el estado cuando
   * el componente ya fue desmontado.
   */
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestId.current += 1;
    };
  }, []);

  /**
   * Recupera las inscripciones desde
   * MyCoursesRepository.
   */
  const loadMyCourses = useCallback(
    async (): Promise<void> => {
      const currentRequestId =
        ++requestId.current;

      try {
        // Al volver a enfocar la pantalla se revalida en segundo
        // plano: se conserva la lista visible en lugar de
        // reemplazarla por un spinner a pantalla completa.
        setState(current =>
          current === 'success' || current === 'empty'
            ? current
            : 'loading',
        );
        setError(null);

        const result =
          await repository.getMyCourses();

        if (
          !mountedRef.current ||
          currentRequestId !== requestId.current
        ) {
          return;
        }

        if (
          !result ||
          !Array.isArray(result.courses) ||
          !result.summary
        ) {
          throw new Error(
            'La información recibida de Mis cursos no es válida.',
          );
        }

        setData(result);

        setState(
          result.courses.length === 0
            ? 'empty'
            : 'success',
        );
      } catch (err) {
        if (
          !mountedRef.current ||
          currentRequestId !== requestId.current
        ) {
          return;
        }

        setData(null);

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar tus cursos.',
        );

        setState('error');
      }
    },
    [repository],
  );

  /**
   * Datos listos para utilizar
   * desde MyCoursesScreen.tsx.
   */
  const courses =
    data?.courses ?? EMPTY_COURSES;

  const summary =
    data?.summary ?? INITIAL_SUMMARY;

  return {
    courses,
    summary,

    state,
    error,

    isLoading:
      state === 'loading',

    isEmpty:
      state === 'empty',

    hasCourses:
      state === 'success' &&
      courses.length > 0,

    hasError:
      state === 'error',

    loadMyCourses,
  };
}
