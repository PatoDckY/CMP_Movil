import { Course } from '../../models/Course';
import { amountToCents } from '../../models/purchaseValidation';

export interface CatalogFilters {
  categoryId?: number | null;
  modalityId?: number | null;
  maxPrice?: string;
}

export function getCatalogFilterError(filters: CatalogFilters): string | null {
  return filters.maxPrice?.trim() && amountToCents(filters.maxPrice) === null
    ? 'Ingresa un precio máximo válido, con hasta dos decimales.'
    : null;
}

export function filterCatalogCourses(
  courses: Course[],
  filters: CatalogFilters,
): Course[] {
  if (getCatalogFilterError(filters)) {
    return [];
  }
  const maximum = filters.maxPrice?.trim()
    ? amountToCents(filters.maxPrice)
    : null;
  return courses.filter(course => {
    if (
      filters.categoryId != null &&
      course.categoryId !== filters.categoryId
    ) {
      return false;
    }
    if (
      filters.modalityId != null &&
      course.modalityId !== filters.modalityId
    ) {
      return false;
    }
    if (maximum !== null) {
      const price = course.cost === null ? null : amountToCents(course.cost);
      if (price === null || price > maximum) {
        return false;
      }
    }
    return true;
  });
}
export interface CourseGroup {
  title: string;
  count: number;
  courses: Course[];
}
export function groupCatalogCourses(
  courses: Course[],
  search: string,
  filters: CatalogFilters = {},
): CourseGroup[] {
  const query = search.trim().toLocaleLowerCase('es-MX');
  const groups = new Map<string, Course[]>();
  filterCatalogCourses(courses, filters).forEach(course => {
    const category = course.categoryName?.trim() || 'Sin categoría';
    const text = [
      course.title,
      course.description,
      course.instructorName,
      course.modalityName,
      category,
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('es-MX');
    if (query && !text.includes(query)) {
      return;
    }
    groups.set(category, [...(groups.get(category) ?? []), course]);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([title, entries]) => ({
      title,
      count: entries.length,
      courses: [...entries].sort((a, b) =>
        a.title.localeCompare(b.title, 'es'),
      ),
    }));
}
