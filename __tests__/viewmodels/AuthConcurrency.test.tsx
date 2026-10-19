import { useLoginViewModel } from '../../src/viewmodels/auth/useLoginViewModel';
import { useRegisterViewModel } from '../../src/viewmodels/auth/useRegisterViewModel';
import { AuthRepository } from '../../src/repositories/contracts/AuthRepository';
import { act, renderHook, deferred } from '../helpers/renderHook';
import { LoginResult, RegistrationOtpResult } from '../../src/models/User';
function repository(): jest.Mocked<AuthRepository> {
  return {
    login: jest.fn(),
    register: jest.fn(),
    sendRegistrationOtp: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  };
}
describe('Regresiones de formularios de autenticación', () => {
  test('no duplica login mientras la primera respuesta sigue pendiente', async () => {
    const repo = repository();
    const pending = deferred<LoginResult>();
    repo.login.mockReturnValue(pending.promise);
    const vm = await renderHook(() => useLoginViewModel(repo));
    await act(async () => {
      vm.current.setEmail('cliente@example.com');
      vm.current.setPassword('fixture');
    });
    let first!: Promise<LoginResult | null>;
    await act(async () => {
      first = vm.current.login();
      expect(await vm.current.login()).toBeNull();
    });
    expect(repo.login).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.reject(new Error('Sin red'));
      await first;
    });
    expect(vm.current.state).toBe('error');
    await vm.unmount();
  });
  test('registro exige diez dígitos de teléfono, no solo diez caracteres', async () => {
    const repo = repository();
    const vm = await renderHook(() => useRegisterViewModel(repo));
    await act(async () => {
      vm.current.setFirstName('Ana');
      vm.current.setPaternalLastName('Prueba');
      vm.current.setAge('25');
      vm.current.setSex('femenino');
      vm.current.setEmail('ana@example.com');
      vm.current.setPhone('abcdefghij');
    });
    await act(async () => {
      expect(await vm.current.sendOtp()).toBe(false);
    });
    expect(repo.sendRegistrationOtp).not.toHaveBeenCalled();
    expect(vm.current.error).toContain('10 dígitos');
    await vm.unmount();
  });
  test('no duplica envío de OTP ni registra mientras se está enviando', async () => {
    const repo = repository();
    const pending = deferred<RegistrationOtpResult>();
    repo.sendRegistrationOtp.mockReturnValue(pending.promise);
    const vm = await renderHook(() => useRegisterViewModel(repo));
    await act(async () => {
      vm.current.setFirstName('Ana');
      vm.current.setPaternalLastName('Prueba');
      vm.current.setAge('25');
      vm.current.setSex('femenino');
      vm.current.setEmail('ana@example.com');
      vm.current.setPhone('5555555555');
    });
    let sending!: Promise<boolean>;
    await act(async () => {
      sending = vm.current.sendOtp();
      expect(await vm.current.sendOtp()).toBe(false);
      expect(await vm.current.register()).toBe(false);
    });
    expect(repo.sendRegistrationOtp).toHaveBeenCalledTimes(1);
    expect(repo.register).not.toHaveBeenCalled();
    await act(async () => {
      pending.resolve({
        message: 'Código enviado',
        email: 'ana@example.com',
        emailSent: true,
      });
      await sending;
    });
    expect(vm.current.otpSent).toBe(true);
    await vm.unmount();
  });
});
