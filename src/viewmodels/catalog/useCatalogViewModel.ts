import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Course } from '../../models/Course';
import { CourseRepository } from '../../repositories/contracts/CourseRepository';
import {
  CatalogFilters,
  getCatalogFilterError,
  groupCatalogCourses,
} from './catalogFilters';

export type CatalogState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export function useCatalogViewModel(repository: CourseRepository) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [state, setState] = useState<CatalogState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CatalogFilters>({});
  const groupedCourses = useMemo(
    () => groupCatalogCourses(courses, search, filters),
    [courses, search, filters],
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          courses.map(course => [
            course.categoryId,
            {
              id: course.categoryId,
              name: course.categoryName?.trim() || 'Sin categoría',
            },
          ]),
        ).values(),
      ).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [courses],
  );
  const modalities = useMemo(
    () =>
      Array.from(
        new Map(
          courses.map(course => [
            course.modalityId,
            {
              id: course.modalityId,
              name: course.modalityName?.trim() || 'Sin modalidad',
            },
          ]),
        ).values(),
      ).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [courses],
  );
  const setCategory = useCallback(
    (categoryId: number | null) =>
      setFilters(current => ({ ...current, categoryId })),
    [],
  );
  const setModality = useCallback(
    (modalityId: number | null) =>
      setFilters(current => ({ ...current, modalityId })),
    [],
  );
  const setMaxPrice = useCallback(
    (maxPrice: string) => setFilters(current => ({ ...current, maxPrice })),
    [],
  );
  const clearFilters = useCallback(() => {
    setSearch('');
    setFilters({});
  }, []);
  const requestId = useRef(0);
  const loading = useRef(false);
  useEffect(
    () => () => {
      requestId.current += 1;
      loading.current = false;
    },
    [],
  );

  const loadCourses = useCallback(async () => {
    if (loading.current) {
      return;
    }
    loading.current = true;
    const id = ++requestId.current;
    try {
      setState('loading');
      setError(null);

      const data = await repository.getCourses();

      if (id !== requestId.current) {
        return;
      }

      setCourses(data);
      setState(data.length === 0 ? 'empty' : 'success');
    } catch (err) {
      if (id !== requestId.current) {
        return;
      }
      setError(
        err instanceof Error ? err.message : 'No fue posible cargar los cursos',
      );

      setState('error');
    } finally {
      if (id === requestId.current) {
        loading.current = false;
      }
    }
  }, [repository]);

  return {
    courses,
    state,
    error,
    loadCourses,
    search,
    setSearch,
    filters,
    groupedCourses,
    categories,
    modalities,
    setCategory,
    setModality,
    setMaxPrice,
    clearFilters,
    hasActiveFilters:
      filters.categoryId != null ||
      filters.modalityId != null ||
      !!filters.maxPrice?.trim(),
    filterError: getCatalogFilterError(filters),
  };
}
