import { useCatalogViewModel } from '../../src/viewmodels/catalog/useCatalogViewModel';
import { useCourseDetailViewModel } from '../../src/viewmodels/catalog/useCourseDetailViewModel';
import { filterCatalogCourses, getCatalogFilterError, groupCatalogCourses } from '../../src/viewmodels/catalog/catalogFilters';
import { Course } from '../../src/models/Course';
import { course } from '../helpers/fixtures';
import { act, renderHook, deferred } from '../helpers/renderHook';

describe('Catálogo y detalle público', () => {
  const catalog = [course,
    {...course, id: 2, title: 'Curso gratuito', categoryId: 2, categoryName: 'Formación', modalityId: 2, modalityName: 'En línea', cost: '0.00'},
    {...course, id: 3, title: 'Curso avanzado', cost: '250.00'},
    {...course, id: 4, cost: null},
    {...course, id: 5, cost: 'incompatible'},
  ];
  test('combina categoría, modalidad y precio sin tratar un precio desconocido como gratuito', () => {
    expect(filterCatalogCourses(catalog, {categoryId: 2}).map(item => item.id)).toEqual([2]);
    expect(filterCatalogCourses(catalog, {modalityId: 2}).map(item => item.id)).toEqual([2]);
    expect(filterCatalogCourses(catalog, {maxPrice: '100'}).map(item => item.id)).toEqual([1, 2]);
    expect(filterCatalogCourses(catalog, {categoryId: 1, modalityId: 1, maxPrice: '100.00'}).map(item => item.id)).toEqual([1]);
    expect(filterCatalogCourses(catalog, {maxPrice: '0'}).map(item => item.id)).toEqual([2]);
    expect(filterCatalogCourses(catalog, {maxPrice: '   '})).toEqual(catalog);
    expect(groupCatalogCourses(catalog, 'auxilios', {categoryId: 1, maxPrice: '100'})[0].courses).toEqual([course]);
  });
  test.each(['-1', '1e3', '12.345', 'texto'])('precio máximo inválido %s se informa y no devuelve resultados engañosos', value => {
    expect(getCatalogFilterError({maxPrice: value})).not.toBeNull();
    expect(filterCatalogCourses(catalog, {maxPrice: value})).toEqual([]);
  });
  test('ViewModel aplica y limpia búsqueda/filtros sin repetir peticiones al servidor', async () => {
    const repository = {getCourses: jest.fn(async () => catalog), getCourseById: jest.fn()};
    const vm = await renderHook(() => useCatalogViewModel(repository));
    await act(async () => {await vm.current.loadCourses();});
    expect(vm.current.categories.map(item => item.id)).toEqual([2, 1]);
    expect(vm.current.modalities).toHaveLength(2);
    await act(async () => {vm.current.setSearch('auxilios'); vm.current.setCategory(1); vm.current.setModality(1); vm.current.setMaxPrice('100');});
    expect(vm.current.groupedCourses[0].courses).toEqual([course]);
    expect(vm.current.hasActiveFilters).toBe(true);
    await act(async () => {vm.current.setMaxPrice('error');});
    expect(vm.current.filterError).not.toBeNull();
    await act(async () => {vm.current.clearFilters();});
    expect(vm.current.search).toBe('');
    expect(vm.current.hasActiveFilters).toBe(false);
    expect(vm.current.filterError).toBeNull();
    expect(vm.current.groupedCourses.flatMap(group => group.courses)).toHaveLength(catalog.length);
    expect(repository.getCourses).toHaveBeenCalledTimes(1);
    await vm.unmount();
  });
  test.each(['auxilios', 'SALUD', 'Ana', 'presencial'])(
    'búsqueda por %s',
    query => {
      expect(groupCatalogCourses([course], query)[0].courses).toEqual([course]);
    },
  );
  test('vacío, sin coincidencias y categoría faltante', () => {
    expect(groupCatalogCourses([], '')).toEqual([]);
    expect(groupCatalogCourses([course], 'inexistente')).toEqual([]);
    expect(
      groupCatalogCourses([{ ...course, categoryName: null }], ' ')[0].title,
    ).toBe('Sin categoría');
  });
  test('carga evita duplicados, muestra vacío y permite reintentar tras error', async () => {
    const pending = deferred<Course[]>();
    const repository = {
      getCourses: jest
        .fn()
        .mockReturnValueOnce(pending.promise)
        .mockRejectedValueOnce(new Error('Sin red'))
        .mockResolvedValueOnce([course]),
      getCourseById: jest.fn(),
    };
    const vm = await renderHook(() => useCatalogViewModel(repository));
    let loading!: Promise<void>;
    await act(async () => {
      loading = vm.current.loadCourses();
      await vm.current.loadCourses();
    });
    expect(vm.current.state).toBe('loading');
    expect(repository.getCourses).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve([]);
      await loading;
    });
    expect(vm.current.state).toBe('empty');
    await act(async () => {
      await vm.current.loadCourses();
    });
    expect(vm.current.state).toBe('error');
    await act(async () => {
      await vm.current.loadCourses();
    });
    expect(vm.current.courses).toEqual([course]);
    await vm.unmount();
  });
  test('detalle ignora respuestas antiguas al cambiar de curso', async () => {
    const old = deferred<Course>();
    const repository = {
      getCourses: jest.fn(),
      getCourseById: jest
        .fn()
        .mockReturnValueOnce(old.promise)
        .mockResolvedValueOnce({ ...course, id: 2 }),
    };
    const vm = await renderHook(() => useCourseDetailViewModel(repository));
    let first!: Promise<void>;
    await act(async () => {
      first = vm.current.loadCourse(1);
      await vm.current.loadCourse(1);
      await vm.current.loadCourse(2);
    });
    await act(async () => {
      old.resolve(course);
      await first;
    });
    expect(vm.current.course?.id).toBe(2);
    expect(repository.getCourseById).toHaveBeenCalledTimes(2);
    await vm.unmount();
  });
  test('detalle valida identificador y muestra error sin contenido anterior', async () => {
    const repository = {
      getCourses: jest.fn(),
      getCourseById: jest.fn().mockRejectedValue(new Error('No disponible')),
    };
    const vm = await renderHook(() => useCourseDetailViewModel(repository));
    await act(async () => {
      await vm.current.loadCourse(-1);
    });
    expect(repository.getCourseById).not.toHaveBeenCalled();
    await act(async () => {
      await vm.current.loadCourse(1);
    });
    expect(vm.current.state).toBe('error');
    expect(vm.current.course).toBeNull();
    await vm.unmount();
  });
  test('una ruta inválida durante carga no bloquea volver a consultar el curso', async () => {
    const pending = deferred<Course>();
    const repository = {
      getCourses: jest.fn(),
      getCourseById: jest
        .fn()
        .mockReturnValueOnce(pending.promise)
        .mockResolvedValueOnce(course),
    };
    const vm = await renderHook(() => useCourseDetailViewModel(repository));
    let old!: Promise<void>;
    await act(async () => {
      old = vm.current.loadCourse(1);
      await vm.current.loadCourse(-1);
    });
    await act(async () => {
      await vm.current.loadCourse(1);
    });
    await act(async () => {
      pending.resolve(course);
      await old;
    });
    expect(repository.getCourseById).toHaveBeenCalledTimes(2);
    expect(vm.current.state).toBe('success');
    await vm.unmount();
  });
});
