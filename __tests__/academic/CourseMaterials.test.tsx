import {CourseMaterialsRepositoryImpl} from '../../src/repositories/implementations/CourseMaterialsRepositoryImpl';
import {courseMaterialsService} from '../../src/services/implementations/courseMaterialsService';
import {CourseMaterialsService, CourseMaterialsDto} from '../../src/services/contracts/CourseMaterialsService';
import {CourseMaterialsRepository} from '../../src/repositories/contracts/CourseMaterialsRepository';
import {CourseMaterials, isDriveFolderUrl} from '../../src/models/CourseMaterials';
import {useCourseMaterialsViewModel} from '../../src/viewmodels/myCourses/useCourseMaterialsViewModel';
import {tokenStorage} from '../../src/services/security/tokenStorage';
import {act, deferred, renderHook} from '../helpers/renderHook';

jest.mock('../../src/services/security/tokenStorage', () => ({tokenStorage: {
  getSessionVersion: jest.fn(() => 0), getAccessToken: jest.fn(async () => 'fixture-access'),
  getRefreshToken: jest.fn(async () => null), clearTokens: jest.fn(), updateAccessToken: jest.fn(),
}}));
const link = 'https://drive.google.com/drive/folders/fixture_folder?usp=sharing';
const dto: CourseMaterialsDto = {success: true, idInscripcion: 7, idCurso: 2, estado: 'disponible', url: link};
const available: CourseMaterials = {enrollmentId: 7, courseId: 2, status: 'disponible', url: link};

describe('Materiales: contrato API real y validación defensiva', () => {
  const originalFetch = globalThis.fetch;
  const fetchMock = jest.fn();
  const repository = new CourseMaterialsRepositoryImpl(courseMaterialsService);
  beforeEach(() => {jest.clearAllMocks(); globalThis.fetch = fetchMock; (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue('fixture-access');});
  afterEach(() => {globalThis.fetch = originalFetch; jest.useRealTimers();});
  function response(status: number, body: unknown): Response {
    return {status, ok: status >= 200 && status < 300, text: async () => JSON.stringify(body)} as Response;
  }
  test('GET por inscripción, Bearer y sin caché; no hay URL permanente', async () => {
    fetchMock.mockResolvedValue(response(200, dto));
    expect(await repository.getMaterials(7)).toEqual(available);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/cliente\/mis-cursos\/7\/materiales$/);
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer fixture-access');
    expect(new Headers(options.headers).get('Cache-Control')).toBe('no-store');
  });
  test.each([401, 403, 404, 500])('HTTP %s no entrega materiales', async status => {
    fetchMock.mockResolvedValue(response(status, {error: 'Fallo controlado'}));
    await expect(repository.getMaterials(7)).rejects.toMatchObject({status});
  });
  test('sin credenciales y con ID inválido no hay consulta', async () => {
    await expect(repository.getMaterials(-1)).rejects.toThrow();
    await expect(courseMaterialsService.getMaterials(0)).rejects.toThrow();
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    await expect(repository.getMaterials(7)).rejects.toMatchObject({status: 401});
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('timeout de red no permite usar una URL tardía', async () => {
    jest.useFakeTimers(); fetchMock.mockImplementation(() => new Promise(() => {}));
    const result = repository.getMaterials(7).catch(error => error);
    await jest.advanceTimersByTimeAsync(15_000);
    expect(await result).toEqual(expect.objectContaining({message: expect.stringContaining('tiempo')}));
  });
  test.each([
    {idInscripcion: 8}, {idCurso: 0}, {success: false}, {estado: 'inventado'},
    {url: 'http://drive.google.com/drive/folders/fixture'},
    {url: 'https://drive.google.com.evil.test/drive/folders/fixture'},
    {url: 'https://drive.google.com/file/d/fixture'},
    {url: 'https://user@drive.google.com/drive/folders/fixture'},
    {url: 'https://drive.google.com/drive/folders/fixture?redirect=https://evil.test'},
    {estado: 'finalizado', url: link}, {estado: 'disponible', url: undefined},
  ])('rechaza respuestas incompatibles: %j', async invalid => {
    const service = {getMaterials: jest.fn(async () => ({...dto, ...invalid}))} as unknown as CourseMaterialsService;
    await expect(new CourseMaterialsRepositoryImpl(service).getMaterials(7)).rejects.toThrow('verificar');
  });
  test.each([link, 'https://drive.google.com/drive/u/0/folders/fixture?resourcekey=0_fixture', 'https://drive.google.com/drive/folders/fixture'])('carpeta HTTPS válida: %s', value => expect(isDriveFolderUrl(value)).toBe(true));
  test.each([null, '', 'invalid', 'https://drive.google.com:444/drive/folders/fixture', 'https://drive.google.com/drive/folders/fixture#x', 'https://drive.google.com/drive/folders/fixture?usp=a&usp=b'])('enlace no permitido: %s', value => expect(isDriveFolderUrl(value)).toBe(false));
});

describe('Materiales: ViewModel sin retención de enlaces y autorización fresca', () => {
  let version: number;
  let listeners: Set<() => void>;
  const open = jest.fn(async (_url: string) => {});
  const scope = {version: () => version, subscribe: (listener: () => void) => {listeners.add(listener); return () => {listeners.delete(listener);};}};
  function invalidate() {version++; listeners.forEach(listener => listener());}
  beforeEach(() => {version = 0; listeners = new Set(); open.mockClear();});
  test.each(['no_iniciado', 'finalizado', 'sin_materiales', 'disponible'] as const)('estado %s procede del servidor y no abre durante consulta', async status => {
    const repo = {getMaterials: jest.fn(async () => ({...available, status, url: status === 'disponible' ? link : undefined}))};
    const vm = await renderHook(() => useCourseMaterialsViewModel(repo, 7, 2, 1, open, scope));
    await act(async () => vm.current.reload());
    expect(vm.current.status).toBe(status); expect(open).not.toHaveBeenCalled();
    expect(JSON.stringify(vm.current)).not.toContain('drive.google.com'); await vm.unmount();
  });
  test('cada pulsación verifica de nuevo: cambio de fecha o enlace no reutiliza la consulta anterior', async () => {
    const repo = {getMaterials: jest.fn().mockResolvedValueOnce(available).mockResolvedValueOnce({...available,status:'finalizado',url:undefined}).mockResolvedValueOnce({...available,url:link.replace('fixture_folder','other_folder')})};
    const vm = await renderHook(() => useCourseMaterialsViewModel(repo, 7, 2, 1, open, scope));
    await act(async () => vm.current.reload()); await act(async () => vm.current.openMaterials());
    expect(open).not.toHaveBeenCalled(); expect(vm.current.status).toBe('finalizado');
    await act(async () => vm.current.openMaterials()); expect(repo.getMaterials).toHaveBeenCalledTimes(3);
    expect(open).toHaveBeenCalledWith(link.replace('fixture_folder','other_folder')); await vm.unmount();
  });
  test.each(['logout', 'cuenta', 'curso', 'desmontaje', 'nueva-version'])('respuesta tardía después de %s no abre materiales', async scenario => {
    const pending = deferred<CourseMaterials>(); let account: number | null = 1; let id = 7;
    const repo: CourseMaterialsRepository = {getMaterials: jest.fn(() => pending.promise)};
    const vm = await renderHook(() => useCourseMaterialsViewModel(repo, id, 2, account, open, scope));
    let result!: Promise<void>;
    await act(async () => {result = vm.current.openMaterials();});
    if (scenario === 'desmontaje') {await vm.unmount();}
    else if (scenario === 'nueva-version') {version++;}
    else {await act(async () => {if (scenario === 'cuenta') {account = 99;} if (scenario === 'curso') {id = 8;} if (scenario === 'logout') {account = null;} invalidate();});}
    await act(async () => {pending.resolve(available); await result;});
    expect(open).not.toHaveBeenCalled();
    if (scenario !== 'desmontaje') {expect(vm.current.status).toBeNull(); expect(vm.current.busy).toBe(false); await vm.unmount();}
  });
  test('otro curso, fallo de red y fallo al abrir dejan error genérico y permiten reintentar', async () => {
    const repo = {getMaterials: jest.fn().mockResolvedValueOnce({...available,courseId:9}).mockRejectedValueOnce(new Error(link)).mockResolvedValue(available)};
    const vm = await renderHook(() => useCourseMaterialsViewModel(repo, 7, 2, 1, open, scope));
    await act(async () => vm.current.openMaterials()); expect(open).not.toHaveBeenCalled();
    await act(async () => vm.current.reload()); expect(vm.current.error).not.toContain(link);
    open.mockRejectedValueOnce(new Error(link)); await act(async () => vm.current.openMaterials()); expect(vm.current.error).not.toContain(link);
    await act(async () => vm.current.openMaterials()); expect(vm.current.error).toBeNull(); await vm.unmount();
  });
  test('bloquea envíos concurrentes y cancela la consulta anterior', async () => {
    const pending = deferred<CourseMaterials>(); const repo = {getMaterials: jest.fn(() => pending.promise)};
    const vm = await renderHook(() => useCourseMaterialsViewModel(repo, 7, 2, 1, open, scope));
    let result!: Promise<void>;
    await act(async () => {result = vm.current.reload(); await vm.current.openMaterials();});
    expect(repo.getMaterials).toHaveBeenCalledTimes(1); await act(async () => {vm.current.cancel(); pending.resolve(available); await result;});
    expect(open).not.toHaveBeenCalled(); await vm.unmount();
  });
});
