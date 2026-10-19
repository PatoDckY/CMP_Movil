import { Profile } from '../../src/models/Profile';
import { ProfileRepositoryImpl } from '../../src/repositories/implementations/ProfileRepositoryImpl';
import { profileService } from '../../src/services/implementations/profileService';
import { useProfileViewModel } from '../../src/viewmodels/account/useProfileViewModel';
import { tokenStorage } from '../../src/services/security/tokenStorage';
import { act, renderHook, deferred } from '../helpers/renderHook';
jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(async () => 'fixture-access'),
    getRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(),
  },
}));
const profile: Profile = {
  id: 1,
  firstName: 'Ana',
  paternalLastName: 'Prueba',
  maternalLastName: null,
  age: 25,
  sex: 'femenino',
  phone: '5555555555',
  email: 'ana@example.com',
};
const dto = {
  id: 1,
  nombre: 'Ana',
  apellidoPaterno: 'Prueba',
  apellidoMaterno: null,
  edad: 25,
  sexo: 'femenino',
  telefono: '5555555555',
  correo: 'ana@example.com',
};
describe('Perfil: contrato HTTP, mapeo y formulario', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });
  test('GET y PUT autenticados; envía solo campos rectificables', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ profile: dto }),
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const repository = new ProfileRepositoryImpl(profileService);
    expect(await repository.getProfile()).toEqual(profile);
    await repository.updateProfile({
      ...profile,
      firstName: ' Ana ',
      maternalLastName: '',
      phone: ' 5555555555 ',
    });
    const calls = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(calls[0][0]).toMatch(/\/api\/profile$/);
    expect(new Headers(calls[1][1].headers).get('Authorization')).toBe(
      'Bearer fixture-access',
    );
    expect(calls[1][1].method).toBe('PUT');
    expect(JSON.parse(calls[1][1].body as string)).toEqual({
      nombre: 'Ana',
      apellidoPaterno: 'Prueba',
      apellidoMaterno: null,
      edad: 25,
      sexo: 'femenino',
      telefono: '5555555555',
    });
    expect(tokenStorage.clearTokens).not.toHaveBeenCalled();
  });
  test('carga y guarda perfil validado', async () => {
    const repository = {
      getProfile: jest.fn(async () => profile),
      updateProfile: jest.fn(async () => ({ ...profile, firstName: 'Nueva' })),
    };
    const vm = await renderHook(() => useProfileViewModel(repository));
    await act(async () => {
      await vm.current.loadProfile();
    });
    expect(vm.current.form.firstName).toBe('Ana');
    await act(async () => {
      vm.current.updateField('firstName', ' Nueva ');
    });
    await act(async () => {
      expect(await vm.current.saveProfile()).toBe(true);
    });
    expect(repository.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ firstName: 'Nueva' }),
    );
    expect(vm.current.form.firstName).toBe('Nueva');
    await vm.unmount();
  });
  test.each([
    ['firstName', ''],
    ['paternalLastName', ''],
    ['age', '0'],
    ['age', '121'],
    ['age', '1.5'],
    ['sex', 'invalido'],
    ['phone', 'abcdefghij'],
  ])('valida %s=%s sin enviar', async (field, value) => {
    const repository = {
      getProfile: jest.fn(async () => profile),
      updateProfile: jest.fn(),
    };
    const vm = await renderHook(() => useProfileViewModel(repository));
    await act(async () => {
      await vm.current.loadProfile();
    });
    await act(async () => {
      vm.current.updateField(field as keyof typeof vm.current.form, value);
    });
    await act(async () => {
      expect(await vm.current.saveProfile()).toBe(false);
    });
    expect(repository.updateProfile).not.toHaveBeenCalled();
    expect(vm.current.error).not.toBeNull();
    await vm.unmount();
  });
  test('fallo de consulta permite reintentar y no duplica consultas pendientes', async () => {
    const pending = deferred<Profile>();
    const repository = {
      getProfile: jest
        .fn()
        .mockRejectedValueOnce(new Error('Sin conexión'))
        .mockReturnValueOnce(pending.promise),
      updateProfile: jest.fn(),
    };
    const vm = await renderHook(() => useProfileViewModel(repository));
    await act(async () => {
      await vm.current.loadProfile();
    });
    expect(vm.current.status).toBe('error');
    let loading!: Promise<void>;
    await act(async () => {
      loading = vm.current.loadProfile();
      await vm.current.loadProfile();
    });
    expect(repository.getProfile).toHaveBeenCalledTimes(2);
    await act(async () => {
      pending.resolve(profile);
      await loading;
    });
    expect(vm.current.status).toBe('ready');
    await vm.unmount();
  });
  test('fallo de guardado conserva el formulario y evita envíos simultáneos', async () => {
    const pending = deferred<Profile>();
    const repository = {
      getProfile: jest.fn(async () => profile),
      updateProfile: jest.fn(() => pending.promise),
    };
    const vm = await renderHook(() => useProfileViewModel(repository));
    await act(async () => {
      await vm.current.loadProfile();
    });
    let save!: Promise<boolean>;
    await act(async () => {
      save = vm.current.saveProfile();
      expect(await vm.current.saveProfile()).toBe(false);
    });
    expect(repository.updateProfile).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.reject(new Error('No se guardó'));
      expect(await save).toBe(false);
    });
    expect(vm.current.form.firstName).toBe('Ana');
    expect(vm.current.error).not.toBeNull();
    await vm.unmount();
  });
});
