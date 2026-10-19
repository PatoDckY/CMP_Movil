import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { AppState } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { SessionProvider, useSession } from '../../src/session/SessionContext';
import {
  authRepository,
  courseRepository,
  purchaseRepository,
  myCoursesRepository,
  profileRepository,
  accountRepository,
} from '../../src/config/dependencies';
import { tokenStorage } from '../../src/services/security/tokenStorage';
import { useLoginViewModel } from '../../src/viewmodels/auth/useLoginViewModel';
import { useRegisterViewModel } from '../../src/viewmodels/auth/useRegisterViewModel';
import { useCatalogViewModel } from '../../src/viewmodels/catalog/useCatalogViewModel';
import { useCourseDetailViewModel } from '../../src/viewmodels/catalog/useCourseDetailViewModel';
import { groupCatalogCourses } from '../../src/viewmodels/catalog/catalogFilters';
import { usePurchaseViewModel } from '../../src/viewmodels/purchases/usePurchaseViewModel';
import { useMyCoursesViewModel } from '../../src/viewmodels/myCourses/useMyCoursesViewModel';
import { useMyCourseDetailViewModel } from '../../src/viewmodels/myCourses/useMyCourseDetailViewModel';
import { useProfileViewModel } from '../../src/viewmodels/account/useProfileViewModel';
import { useAccountDeletionViewModel } from '../../src/viewmodels/account/useAccountDeletionViewModel';
import {
  createIsolatedBackend,
  fixturePassword,
} from '../helpers/isolatedBackend';
import { purchaseInput } from '../helpers/fixtures';

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

function useProduct() {
  const session = useSession();
  return {
    session,
    register: useRegisterViewModel(authRepository),
    login: useLoginViewModel(authRepository),
    catalog: useCatalogViewModel(courseRepository),
    detail: useCourseDetailViewModel(courseRepository),
    purchase: usePurchaseViewModel(purchaseRepository),
    courses: useMyCoursesViewModel(myCoursesRepository),
    academic: useMyCourseDetailViewModel(myCoursesRepository),
    profile: useProfileViewModel(profileRepository, session.updateProfile),
    deletion: useAccountDeletionViewModel(
      accountRepository,
      session.user?.role,
    ),
  };
}

describe('PF/PI - recorridos completos entre capas con backend aislado', () => {
  let product: ReturnType<typeof useProduct>;
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  let backend: ReturnType<typeof createIsolatedBackend>;
  let persisted: false | { username: string; password: string };
  const originalFetch = globalThis.fetch;
  function Probe() {
    product = useProduct();
    return null;
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest
      .spyOn(AppState, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() });
    persisted = false;
    (Keychain.getGenericPassword as jest.Mock).mockImplementation(
      async () => persisted,
    );
    (Keychain.setGenericPassword as jest.Mock).mockImplementation(
      async (username: string, password: string) => {
        persisted = { username, password };
        return { service: 'mock', storage: 'mock' };
      },
    );
    (Keychain.resetGenericPassword as jest.Mock).mockImplementation(
      async () => {
        persisted = false;
        return true;
      },
    );
    await tokenStorage.clearTokens();
    backend = createIsolatedBackend();
    // No existe fallback a la red. Todas las URLs son interceptadas aquí.
    globalThis.fetch = jest.fn(backend.fetch);
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <SessionProvider>
          <Probe />
        </SessionProvider>,
      );
    });
  });
  afterEach(async () => {
    await act(async () => renderer.unmount());
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  async function login() {
    await act(async () => {
      product.login.setEmail('cliente@example.com');
      product.login.setPassword(fixturePassword);
    });
    await act(async () => {
      const result = await product.login.login();
      if (result?.status === 'authenticated') {
        product.session.setAuthenticatedUser(result.user);
      }
    });
    expect(product.session.isAuthenticated).toBe(true);
  }
  test('registro → login → catálogo → reserva pendiente → inscripción autorizada → perfil → A17 → logout', async () => {
    expect(product.session.isAuthenticated).toBe(false);
    await act(async () => {
      const vm = product.register;
      vm.setFirstName('Cliente');
      vm.setPaternalLastName('Prueba');
      vm.setAge('25');
      vm.setSex('otro');
      vm.setPhone('5555555555');
      vm.setEmail('cliente@example.com');
      vm.setPassword(fixturePassword);
      vm.setConfirmPassword(fixturePassword);
      vm.setVerificationCode('654321');
      vm.setAcceptTerms(true);
    });
    await act(async () => {
      expect(await product.register.sendOtp()).toBe(true);
    });
    await act(async () => {
      expect(await product.register.register()).toBe(true);
    });
    await login();
    await act(async () => {
      await product.catalog.loadCourses();
    });
    expect(
      groupCatalogCourses(product.catalog.courses, 'auxilios'),
    ).toHaveLength(1);
    await act(async () => {
      await product.detail.loadCourse(1);
    });
    expect(product.detail.course?.id).toBe(1);
    await act(async () => {
      await product.purchase.createPurchase(purchaseInput);
    });
    expect(product.purchase.purchase?.status).toBe('Pendiente de pago');
    expect((await purchaseRepository.getPurchaseDetail(1)).purchase.id).toBe(1);
    await act(async () => {
      await product.courses.loadMyCourses();
    });
    expect(product.courses.isEmpty).toBe(true);
    // Simula una decisión posterior del backend, no una inscripción automática del móvil.
    backend.state.enrolled = true;
    await act(async () => {
      await product.courses.loadMyCourses();
      await product.academic.loadMyCourseDetail(7);
    });
    expect(product.courses.courses[0].enrollmentId).toBe(7);
    expect(product.academic.course?.progress.progressPercentage).toBe(25);
    await act(async () => {
      await product.profile.loadProfile();
    });
    await act(async () => {
      product.profile.updateField('firstName', 'Nombre actualizado');
    });
    const sessionChecks = backend.calls.filter(
      call => call.path === '/api/auth/check-session',
    ).length;
    await act(async () => {
      expect(await product.profile.saveProfile()).toBe(true);
    });
    expect(product.session.user?.fullName).toBe('Nombre actualizado Prueba');
    expect(
      backend.calls.filter(call => call.path === '/api/auth/check-session'),
    ).toHaveLength(sessionChecks);
    await act(async () => {
      product.deletion.setPassword(fixturePassword);
      product.deletion.setConfirmed(true);
    });
    await act(async () => {
      expect(await product.deletion.submit()).toBe(true);
    });
    expect(product.deletion.receipt).toMatchObject({
      requestId: 17,
      status: 'pendiente',
      deletionCompleted: false,
    });
    expect(product.deletion.password).toBe('');
    expect(product.session.isAuthenticated).toBe(true);
    await act(async () => {
      await product.session.logout();
    });
    expect(product.session.isAuthenticated).toBe(false);
    expect(persisted).toBe(false);
    expect(await tokenStorage.getTokens()).toBeNull();
  });

  test('ausencia de red en catálogo y perfil permite reintentar sin perder la sesión', async () => {
    backend.state.registered = true;
    await login();
    backend.state.offline = true;
    await act(async () => {
      await product.catalog.loadCourses();
      await product.profile.loadProfile();
    });
    expect(product.catalog.state).toBe('error');
    expect(product.profile.status).toBe('error');
    expect(product.session.isAuthenticated).toBe(true);
    backend.state.offline = false;
    await act(async () => {
      await product.catalog.loadCourses();
      await product.profile.loadProfile();
    });
    expect(product.catalog.state).toBe('success');
    expect(product.profile.status).toBe('ready');
  });

  test('cuenta revocada → 401 → refresh rechazado → acceso privado bloqueado', async () => {
    backend.state.registered = true;
    await login();
    backend.state.active = false;
    await act(async () => {
      await product.academic.loadMyCourseDetail(7);
    });
    expect(product.academic.course).toBeNull();
    expect(product.session.isAuthenticated).toBe(false);
    expect(persisted).toBe(false);
  });

  test.each([403, 500])(
    'A17 HTTP %i no cierra sesión ni muestra folio inexistente',
    async status => {
      backend.state.registered = true;
      await login();
      backend.state.deletionStatus = status;
      await act(async () => {
        product.deletion.setPassword(fixturePassword);
        product.deletion.setConfirmed(true);
      });
      await act(async () => {
        expect(await product.deletion.submit()).toBe(false);
      });
      expect(product.deletion.password).toBe('');
      expect(product.deletion.receipt).toBeNull();
      expect(product.session.isAuthenticated).toBe(true);
    },
  );

  test('A17 respuesta inesperada con eliminación completada se rechaza', async () => {
    backend.state.registered = true;
    await login();
    backend.state.malformedReceipt = true;
    await act(async () => {
      product.deletion.setPassword(fixturePassword);
      product.deletion.setConfirmed(true);
    });
    await act(async () => {
      expect(await product.deletion.submit()).toBe(false);
    });
    expect(product.deletion.receipt).toBeNull();
    expect(product.session.isAuthenticated).toBe(true);
  });
});
