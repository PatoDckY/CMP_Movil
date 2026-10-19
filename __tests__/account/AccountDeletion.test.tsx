import { AccountRepositoryImpl } from '../../src/repositories/implementations/AccountRepositoryImpl';
import { accountService } from '../../src/services/implementations/accountService';
import { AccountService } from '../../src/services/contracts/AccountService';
import { AccountDeletionResponseDto } from '../../src/services/dto/AccountDto';
import { useAccountDeletionViewModel } from '../../src/viewmodels/account/useAccountDeletionViewModel';
import { mapAccountDeletionReceipt } from '../../src/mappers/accountMapper';
import { tokenStorage } from '../../src/services/security/tokenStorage';
import { act, renderHook, deferred } from '../helpers/renderHook';

jest.mock('../../src/services/security/tokenStorage', () => ({
  tokenStorage: {
    getSessionVersion: jest.fn(() => 0),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    clearTokens: jest.fn(),
    updateAccessToken: jest.fn(),
  },
}));
const accepted: AccountDeletionResponseDto = {
  message: 'Solicitud registrada',
  solicitudId: 17,
  estado: 'pendiente',
  eliminacionCompletada: false,
};
const originalFetch = globalThis.fetch;
const storage = tokenStorage as jest.Mocked<typeof tokenStorage>;
const fetchMock = jest.fn();
function response(status: number, data: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => JSON.stringify(data),
  } as Response;
}
describe('A17 - contrato, repositorio y ViewModel offline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getAccessToken.mockResolvedValue('fixture-access');
    storage.getRefreshToken.mockResolvedValue('fixture-refresh');
    globalThis.fetch = fetchMock;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.useRealTimers();
  });

  test('DELETE con Bearer, dos campos exactos y respuesta 202', async () => {
    fetchMock.mockResolvedValueOnce(response(202, accepted));
    const repository = new AccountRepositoryImpl(accountService);
    expect(
      await repository.requestDeletion({
        password: ' fixture ',
        confirmed: true,
      }),
    ).toEqual({
      message: accepted.message,
      requestId: 17,
      status: 'pendiente',
      deletionCompleted: false,
    });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/api\/account$/);
    expect(options.method).toBe('DELETE');
    expect(new Headers(options.headers).get('Authorization')).toBe(
      'Bearer fixture-access',
    );
    expect(JSON.parse(options.body)).toEqual({
      contrasena: ' fixture ',
      confirmacion: true,
    });
    expect(storage.clearTokens).not.toHaveBeenCalled();
  });
  test('sin token no envía la solicitud', async () => {
    storage.getAccessToken.mockResolvedValue(null);
    await expect(
      new AccountRepositoryImpl(accountService).requestDeletion({
        password: 'fixture',
        confirmed: true,
      }),
    ).rejects.toThrow('Inicia sesión');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  test('un 200 no se interpreta como solicitud aceptada', async () => {
    fetchMock.mockResolvedValueOnce(response(200, accepted));
    await expect(
      new AccountRepositoryImpl(accountService).requestDeletion({
        password: 'fixture',
        confirmed: true,
      }),
    ).rejects.toThrow();
  });
  test.each([400, 403, 404, 423, 500])(
    'maneja HTTP %i sin exponer el cuerpo de error',
    async status => {
      fetchMock.mockResolvedValueOnce(
        response(status, { message: 'detalle interno que no se debe mostrar' }),
      );
      await expect(
        new AccountRepositoryImpl(accountService).requestDeletion({
          password: 'fixture',
          confirmed: true,
        }),
      ).rejects.not.toThrow('detalle interno');
    },
  );
  test('devuelve el folio existente y su estado respondida', async () => {
    fetchMock.mockResolvedValueOnce(
      response(202, {
        ...accepted,
        message: 'Ya tienes una solicitud de eliminación en proceso.',
        estado: 'respondida',
      }),
    );
    const result = await new AccountRepositoryImpl(
      accountService,
    ).requestDeletion({ password: 'fixture', confirmed: true });
    expect(result.requestId).toBe(17);
    expect(result.status).toBe('respondida');
    expect(result.deletionCompleted).toBe(false);
    expect(result.message).toContain('Ya tienes');
  });
  test.each([
    { ...accepted, solicitudId: 0 },
    { ...accepted, eliminacionCompletada: true },
    { ...accepted, estado: 'eliminada' },
    { ...accepted, solicitudId: '17' },
    null,
  ])('rechaza un recibo incompatible', dto => {
    expect(() =>
      mapAccountDeletionReceipt(dto as AccountDeletionResponseDto),
    ).toThrow();
  });
  test.each([
    { password: '', confirmed: true },
    { password: 'fixture', confirmed: false },
    { password: 'a'.repeat(201), confirmed: true },
  ])('valida antes de enviar', async input => {
    const service: AccountService = { requestDeletion: jest.fn() };
    await expect(
      new AccountRepositoryImpl(service).requestDeletion(input),
    ).rejects.toThrow();
    expect(service.requestDeletion).not.toHaveBeenCalled();
  });
  test('ViewModel valida contraseña, consentimiento y rol', async () => {
    const repository = { requestDeletion: jest.fn() };
    const vm = await renderHook(() =>
      useAccountDeletionViewModel(repository, 'cliente'),
    );
    await act(async () => {
      expect(await vm.current.submit()).toBe(false);
    });
    await act(async () => {
      vm.current.setPassword('fixture');
    });
    await act(async () => {
      expect(await vm.current.submit()).toBe(false);
    });
    expect(repository.requestDeletion).not.toHaveBeenCalled();
    expect(vm.current.error).not.toBeNull();
    await vm.unmount();
    const denied = await renderHook(() =>
      useAccountDeletionViewModel(repository, 'admin'),
    );
    await act(async () => {
      await denied.current.submit();
    });
    expect(denied.current.error).toContain('clientes');
    expect(repository.requestDeletion).not.toHaveBeenCalled();
    await denied.unmount();
  });
  test('borra la contraseña, bloquea doble envío y conserva folio sin otro envío', async () => {
    const pending = deferred<ReturnType<typeof mapAccountDeletionReceipt>>();
    const repository = { requestDeletion: jest.fn(() => pending.promise) };
    const vm = await renderHook(() =>
      useAccountDeletionViewModel(repository, 'cliente'),
    );
    await act(async () => {
      vm.current.setPassword('fixture');
      vm.current.setConfirmed(true);
    });
    let sending!: Promise<boolean>;
    await act(async () => {
      sending = vm.current.submit();
      await vm.current.submit();
    });
    expect(vm.current.password).toBe('');
    expect(vm.current.isSubmitting).toBe(true);
    expect(repository.requestDeletion).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve(mapAccountDeletionReceipt(accepted));
      await sending;
    });
    expect(vm.current.receipt?.requestId).toBe(17);
    expect(vm.current.receipt?.deletionCompleted).toBe(false);
    await act(async () => {
      await vm.current.submit();
    });
    expect(repository.requestDeletion).toHaveBeenCalledTimes(1);
    await vm.unmount();
  });
  test('fallo de red no conserva contraseña ni produce recibo de éxito', async () => {
    const repository = {
      requestDeletion: jest
        .fn()
        .mockRejectedValue(new Error('private diagnostic')),
    };
    const vm = await renderHook(() =>
      useAccountDeletionViewModel(repository, 'cliente'),
    );
    await act(async () => {
      vm.current.setPassword('fixture');
      vm.current.setConfirmed(true);
    });
    await act(async () => {
      await vm.current.submit();
    });
    expect(vm.current.password).toBe('');
    expect(vm.current.receipt).toBeNull();
    expect(vm.current.error).not.toContain('private diagnostic');
    await vm.unmount();
  });
  test('timeout no se interpreta como rechazo definitivo ni como eliminación completada', async () => {
    jest.useFakeTimers();
    fetchMock.mockReturnValueOnce(new Promise(() => {}));
    const result = new AccountRepositoryImpl(accountService)
      .requestDeletion({ password: 'fixture', confirmed: true })
      .catch(error => error);
    await jest.advanceTimersByTimeAsync(15_000);
    expect((await result).message).toContain('No fue posible confirmar');
    expect(storage.clearTokens).not.toHaveBeenCalled();
  });
});
