import {useCallback, useState} from 'react';

import {Course} from '../../models/Course';
import {CourseRepository} from '../../repositories/contracts/CourseRepository';

export type CatalogState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

export function useCatalogViewModel(repository: CourseRepository) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [state, setState] = useState<CatalogState>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      const data = await repository.getCourses();

      setCourses(data);
      setState(data.length === 0 ? 'empty' : 'success');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible cargar los cursos',
      );

      setState('error');
    }
  }, [repository]);

  return {
    courses,
    state,
    error,
    loadCourses,
  };
}