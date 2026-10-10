import React from 'react';
import ReactTestRenderer, {
  act,
} from 'react-test-renderer';

import {
  LoginResult,
} from '../../src/models/User';
import {
  AuthRepository,
} from '../../src/repositories/contracts/AuthRepository';
import {
  useLoginViewModel,
} from '../../src/viewmodels/auth/useLoginViewModel';

type LoginViewModel =
  ReturnType<
    typeof useLoginViewModel
  >;

describe(
  'useLoginViewModel',
  () => {
    let repository:
      jest.Mocked<AuthRepository>;

    let viewModel:
      LoginViewModel | null =
        null;

    const authenticatedUser = {
      id: 1,
      firstName: 'Luis',
      paternalLastName:
        'Chavez',
      maternalLastName:
        'Vargas',
      fullName:
        'Luis Chavez Vargas',
      email:
        'luis@example.com',
      role: 'Cliente',
    };

    function TestComponent():
      React.JSX.Element {
      viewModel =
        useLoginViewModel(
          repository,
        );

      return <></>;
    }

    function getViewModel():
      LoginViewModel {
      if (!viewModel) {
        throw new Error(
          'El ViewModel no fue inicializado',
        );
      }

      return viewModel;
    }

    beforeEach(async () => {
      repository = {
        login: jest.fn(),
        sendRegistrationOtp:
          jest.fn(),
        register: jest.fn(),
        getCurrentUser:
          jest.fn(),
        logout: jest.fn(),
      };

      viewModel = null;

      await act(async () => {
        ReactTestRenderer.create(
          <TestComponent />,
        );
      });
    });

    test(
      'inicia con estado idle y campos vacíos',
      () => {
        const vm =
          getViewModel();

        expect(
          vm.email,
        ).toBe('');

        expect(
          vm.password,
        ).toBe('');

        expect(
          vm.state,
        ).toBe('idle');

        expect(
          vm.error,
        ).toBeNull();

        expect(
          vm.user,
        ).toBeNull();

        expect(
          vm.mfaEmail,
        ).toBeNull();

        expect(
          vm.isLoading,
        ).toBe(false);
      },
    );

    test(
      'rechaza el login cuando el correo está vacío',
      async () => {
        await act(async () => {
          getViewModel()
            .setPassword(
              'Password#1',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          result,
        ).toBeNull();

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa tu correo electrónico.',
        );

        expect(
          repository.login,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'rechaza un correo con formato inválido',
      async () => {
        await act(async () => {
          getViewModel()
            .setEmail(
              'correo-invalido',
            );

          getViewModel()
            .setPassword(
              'Password#1',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          result,
        ).toBeNull();

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa un correo electrónico válido.',
        );

        expect(
          repository.login,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'rechaza el login cuando la contraseña está vacía',
      async () => {
        await act(async () => {
          getViewModel()
            .setEmail(
              'luis@example.com',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          result,
        ).toBeNull();

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa tu contraseña.',
        );

        expect(
          repository.login,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'cambia a authenticated cuando el login es exitoso',
      async () => {
        repository.login
          .mockResolvedValue({
            status:
              'authenticated',
            user:
              authenticatedUser,
          });

        await act(async () => {
          getViewModel()
            .setEmail(
              'luis@example.com',
            );

          getViewModel()
            .setPassword(
              'Password#1',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          repository.login,
        ).toHaveBeenCalledWith(
          'luis@example.com',
          'Password#1',
        );

        expect(
          result,
        ).toEqual({
          status:
            'authenticated',
          user:
            authenticatedUser,
        });

        expect(
          getViewModel()
            .state,
        ).toBe(
          'authenticated',
        );

        expect(
          getViewModel()
            .user,
        ).toEqual(
          authenticatedUser,
        );

        expect(
          getViewModel()
            .error,
        ).toBeNull();
      },
    );

    test(
      'cambia a mfa_required cuando el repositorio solicita MFA',
      async () => {
        repository.login
          .mockResolvedValue({
            status:
              'mfa_required',
            email:
              'luis@example.com',
            message:
              'Autenticación MFA requerida',
          });

        await act(async () => {
          getViewModel()
            .setEmail(
              'luis@example.com',
            );

          getViewModel()
            .setPassword(
              'Password#1',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          result,
        ).toEqual({
          status:
            'mfa_required',
          email:
            'luis@example.com',
          message:
            'Autenticación MFA requerida',
        });

        expect(
          getViewModel()
            .state,
        ).toBe(
          'mfa_required',
        );

        expect(
          getViewModel()
            .mfaEmail,
        ).toBe(
          'luis@example.com',
        );

        expect(
          getViewModel()
            .user,
        ).toBeNull();
      },
    );

    test(
      'cambia a error cuando el repositorio falla',
      async () => {
        repository.login
          .mockRejectedValue(
            new Error(
              'Credenciales incorrectas',
            ),
          );

        await act(async () => {
          getViewModel()
            .setEmail(
              'luis@example.com',
            );

          getViewModel()
            .setPassword(
              'Password#1',
            );
        });

        let result:
          LoginResult |
          null |
          undefined;

        await act(async () => {
          result =
            await getViewModel()
              .login();
        });

        expect(
          result,
        ).toBeNull();

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Credenciales incorrectas',
        );

        expect(
          getViewModel()
            .user,
        ).toBeNull();
      },
    );

    test(
      'resetError limpia el error y regresa a idle',
      async () => {
        await act(async () => {
          await getViewModel()
            .login();
        });

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa tu correo electrónico.',
        );

        await act(async () => {
          getViewModel()
            .resetError();
        });

        expect(
          getViewModel()
            .state,
        ).toBe('idle');

        expect(
          getViewModel()
            .error,
        ).toBeNull();
      },
    );
  },
);