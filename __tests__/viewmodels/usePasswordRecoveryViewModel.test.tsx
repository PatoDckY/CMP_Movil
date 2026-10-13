
import React from 'react';
import ReactTestRenderer, {
  act,
} from 'react-test-renderer';

import {PasswordRecoveryRepository} from '../../src/repositories/contracts/PasswordRecoveryRepository';
import {usePasswordRecoveryViewModel} from '../../src/viewmodels/auth/usePasswordRecoveryViewModel';

type RecoveryViewModel =
  ReturnType<typeof usePasswordRecoveryViewModel>;

describe('A25 - Recuperación de contraseña', () => {
  let repository: jest.Mocked<PasswordRecoveryRepository>;
  let viewModel: RecoveryViewModel | null = null;

  let renderer:
    | ReturnType<typeof ReactTestRenderer.create>
    | null = null;

  function TestComponent(): React.JSX.Element {
    viewModel = usePasswordRecoveryViewModel(repository);
    return <></>;
  }

  function getViewModel(): RecoveryViewModel {
    if (!viewModel) {
      throw new Error('ViewModel no inicializado');
    }

    return viewModel;
  }

  beforeEach(async () => {
    repository = {
      requestPasswordReset: jest.fn(),
    };

    viewModel = null;

    await act(async () => {
      renderer = ReactTestRenderer.create(
        <TestComponent />,
      );
    });
  });

  afterEach(async () => {
    await act(async () => {
      renderer?.unmount();
    });

    renderer = null;
  });

  test('inicia con estado idle y correo vacío', () => {
    const vm = getViewModel();

    expect(vm.email).toBe('');
    expect(vm.state).toBe('idle');
    expect(vm.error).toBeNull();
    expect(vm.isLoading).toBe(false);
    expect(vm.isSuccess).toBe(false);
  });

  test('rechaza un correo vacío sin llamar a la API', async () => {
    let result = true;

    await act(async () => {
      result = await getViewModel().requestPasswordReset();
    });

    expect(result).toBe(false);
    expect(getViewModel().state).toBe('error');
    expect(getViewModel().error).toBe(
      'Ingresa un correo electrónico válido.',
    );

    expect(repository.requestPasswordReset)
      .not.toHaveBeenCalled();
  });

  test('rechaza un correo con formato inválido', async () => {
    await act(async () => {
      getViewModel().updateEmail('correo-invalido');
    });

    let result = true;

    await act(async () => {
      result = await getViewModel().requestPasswordReset();
    });

    expect(result).toBe(false);
    expect(getViewModel().state).toBe('error');

    expect(repository.requestPasswordReset)
      .not.toHaveBeenCalled();
  });

  test('rechaza correos mayores a 150 caracteres', async () => {
    const email = `${'a'.repeat(145)}@test.com`;

    await act(async () => {
      getViewModel().updateEmail(email);
    });

    let result = true;

    await act(async () => {
      result = await getViewModel().requestPasswordReset();
    });

    expect(result).toBe(false);

    expect(repository.requestPasswordReset)
      .not.toHaveBeenCalled();
  });

  test('normaliza el correo y muestra éxito', async () => {
    repository.requestPasswordReset.mockResolvedValue();

    await act(async () => {
      getViewModel().updateEmail(
        '  USUARIO@EJEMPLO.COM  ',
      );
    });

    let result = false;

    await act(async () => {
      result = await getViewModel().requestPasswordReset();
    });

    expect(result).toBe(true);

    expect(repository.requestPasswordReset)
      .toHaveBeenCalledWith(
        'usuario@ejemplo.com',
      );

    expect(getViewModel().state).toBe('success');
    expect(getViewModel().isSuccess).toBe(true);
    expect(getViewModel().isLoading).toBe(false);
    expect(getViewModel().error).toBeNull();
  });

  test('muestra error cuando falla el servicio', async () => {
    repository.requestPasswordReset.mockRejectedValue(
      new Error('Error HTTP 500'),
    );

    await act(async () => {
      getViewModel().updateEmail(
        'usuario@ejemplo.com',
      );
    });

    let result = true;

    await act(async () => {
      result = await getViewModel().requestPasswordReset();
    });

    expect(result).toBe(false);
    expect(getViewModel().state).toBe('error');

    expect(getViewModel().error).toBe(
      'No fue posible procesar la solicitud. Verifica tu conexión e intenta nuevamente.',
    );

    expect(getViewModel().isLoading).toBe(false);
  });

  test('evita solicitudes simultáneas', async () => {
    let completarSolicitud: (() => void) | undefined;

    const solicitudPendiente = new Promise<void>(
      resolve => {
        completarSolicitud = resolve;
      },
    );

    repository.requestPasswordReset.mockReturnValue(
      solicitudPendiente,
    );

    await act(async () => {
      getViewModel().updateEmail(
        'usuario@ejemplo.com',
      );
    });

    let primeraSolicitud: Promise<boolean> | undefined;
    let segundaSolicitud: Promise<boolean> | undefined;

    await act(async () => {
      primeraSolicitud =
        getViewModel().requestPasswordReset();

      segundaSolicitud =
        getViewModel().requestPasswordReset();
    });

    expect(repository.requestPasswordReset)
      .toHaveBeenCalledTimes(1);

    expect(await segundaSolicitud).toBe(false);

    await act(async () => {
      completarSolicitud?.();
      await primeraSolicitud;
    });

    expect(getViewModel().state).toBe('success');
  });

  test('limpia el error cuando el usuario corrige su correo', async () => {
    await act(async () => {
      await getViewModel().requestPasswordReset();
    });

    expect(getViewModel().state).toBe('error');

    await act(async () => {
      getViewModel().updateEmail(
        'nuevo@ejemplo.com',
      );
    });

    expect(getViewModel().state).toBe('idle');
    expect(getViewModel().error).toBeNull();
    expect(getViewModel().email).toBe(
      'nuevo@ejemplo.com',
    );
  });
});
