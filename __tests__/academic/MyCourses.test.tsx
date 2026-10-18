import { MyCoursesRepositoryImpl } from '../../src/repositories/implementations/MyCoursesRepositoryImpl';
import { myCourseService } from '../../src/services/implementations/myCourseService';
import { useMyCourseDetailViewModel } from '../../src/viewmodels/myCourses/useMyCourseDetailViewModel';
import { useMyCoursesViewModel } from '../../src/viewmodels/myCourses/useMyCoursesViewModel';
import { tokenStorage } from '../../src/services/security/tokenStorage';
import { myCourseDto } from '../helpers/fixtures';
import { act, renderHook } from '../helpers/renderHook';
import {mapMyCourseDetailDtoToModel, mapMyCourseDtoToModel} from '../../src/mappers/myCourseMapper';
import {MyCourseSummaryDto} from '../../src/services/dto/MyCourseDto';
jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => 'fixture-access'),
    getRefreshToken: jest.fn(async () => null),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(),
  },
}));
describe('Autorización y progreso académico disponible', () => {
  test.each([
    {sesionesTotales: -1}, {sesionesTotales: 1.5}, {sesionesCompletadas: -1},
    {sesionesCompletadas: 1.5}, {sesionesCompletadas: 999},
    {porcentajeAvance: NaN}, {porcentajeAvance: -1}, {porcentajeAvance: 101},
    {porcentajeAsistencia: NaN}, {porcentajeAsistencia: -1}, {porcentajeAsistencia: 101},
  ])('no presenta un progreso incompatible como válido: %j', invalid => {
    const dto = {...myCourseDto, ...invalid};
    expect(() => mapMyCourseDetailDtoToModel(dto)).toThrow('progreso académico');
    expect(() => mapMyCourseDtoToModel(dto as unknown as MyCourseSummaryDto)).toThrow('progreso académico');
  });
  test.each([0, 100])('conserva el porcentaje límite real del servidor: %s', value => {
    const result = mapMyCourseDetailDtoToModel({...myCourseDto, porcentajeAvance: value, porcentajeAsistencia: value});
    expect(result.progress.progressPercentage).toBe(value);
    expect(result.progress.attendancePercentage).toBe(value);
  });
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock;
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(
      'fixture-access',
    );
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });
  const repository = new MyCoursesRepositoryImpl(myCourseService);
  function response(status: number, data: unknown): Response {
    return {
      ok: status >= 200 && status < 300,
      status,
      text: async () => JSON.stringify(data),
    } as Response;
  }
  test('carga inscripción por ID, sesiones y progreso del servidor sin inventar lecciones', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, { success: true, curso: myCourseDto }),
    );
    const detail = await repository.getMyCourseDetail(7);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/cliente\/mis-cursos\/7$/);
    expect(
      new Headers(fetchMock.mock.calls[0][1].headers).get('Authorization'),
    ).toBe('Bearer fixture-access');
    expect(detail.progress.progressPercentage).toBe(25);
    expect(detail.sessions[0].virtualLink).toBe('https://example.com/session');
    expect(detail.enrollmentId).toBe(7);
  });
  test.each([401, 403, 404])(
    'HTTP %i no expone contenido ni conserva detalle',
    async status => {
      fetchMock.mockResolvedValueOnce(
        response(status, { message: 'Acceso denegado' }),
      );
      const vm = await renderHook(() => useMyCourseDetailViewModel(repository));
      await act(async () => {
        await vm.current.loadMyCourseDetail(7);
      });
      expect(vm.current.course).toBeNull();
      expect(vm.current.state).toBe('error');
      await vm.unmount();
    },
  );
  test('sin credenciales no consulta contenido académico', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    await expect(repository.getMyCourseDetail(7)).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('una respuesta con otra inscripción se rechaza aunque sea HTTP 200', async () => {
    fetchMock.mockResolvedValueOnce(
      response(200, {
        success: true,
        curso: { ...myCourseDto, idInscripcion: 99 },
      }),
    );
    await expect(repository.getMyCourseDetail(7)).rejects.toThrow(
      'esta inscripción',
    );
  });
  test('identificador inválido no alcanza la red', async () => {
    await expect(repository.getMyCourseDetail(-1)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('listado vacío mantiene resumen y permite reintentar tras error', async () => {
    const data = {
      courses: [],
      summary: {
        totalEnrollments: 0,
        upcomingCourses: 0,
        activeCourses: 0,
        finishedCourses: 0,
        completedCourses: 0,
      },
    };
    const repo = {
      getMyCourses: jest
        .fn()
        .mockRejectedValueOnce(new Error('Sin red'))
        .mockResolvedValueOnce(data),
      getMyCourseDetail: jest.fn(),
    };
    const vm = await renderHook(() => useMyCoursesViewModel(repo));
    await act(async () => {
      await vm.current.loadMyCourses();
    });
    expect(vm.current.hasError).toBe(true);
    await act(async () => {
      await vm.current.loadMyCourses();
    });
    expect(vm.current.isEmpty).toBe(true);
    expect(vm.current.summary.totalEnrollments).toBe(0);
    await vm.unmount();
  });
});
