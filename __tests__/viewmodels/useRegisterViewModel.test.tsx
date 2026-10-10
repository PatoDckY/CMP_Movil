import React from 'react';
import ReactTestRenderer, {
  act,
} from 'react-test-renderer';

import {
  AuthRepository,
} from '../../src/repositories/contracts/AuthRepository';
import {
  useRegisterViewModel,
} from '../../src/viewmodels/auth/useRegisterViewModel';

type RegisterViewModel =
  ReturnType<
    typeof useRegisterViewModel
  >;

describe(
  'useRegisterViewModel',
  () => {
    let repository:
      jest.Mocked<AuthRepository>;

    let viewModel:
      RegisterViewModel | null =
        null;

    function TestComponent():
      React.JSX.Element {
      viewModel =
        useRegisterViewModel(
          repository,
        );

      return <></>;
    }

    function getViewModel():
      RegisterViewModel {
      if (!viewModel) {
        throw new Error(
          'El ViewModel no fue inicializado',
        );
      }

      return viewModel;
    }

    async function fillBasicData() {
      await act(async () => {
        const vm =
          getViewModel();

        vm.setFirstName(
          'Luis',
        );

        vm.setPaternalLastName(
          'Chavez',
        );

        vm.setMaternalLastName(
          'Vargas',
        );

        vm.setAge(
          '25',
        );

        vm.setSex(
          'masculino',
        );

        vm.setEmail(
          'LUIS@EXAMPLE.COM',
        );

        vm.setPhone(
          '7821234567',
        );
      });
    }

    async function fillPasswordData() {
      await act(async () => {
        const vm =
          getViewModel();

        vm.setPassword(
          'Seguro#8046',
        );

        vm.setConfirmPassword(
          'Seguro#8046',
        );
      });
    }

    beforeEach(
      async () => {
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
      },
    );

    test(
      'inicia con estado idle y campos vacíos',
      () => {
        const vm =
          getViewModel();

        expect(
          vm.firstName,
        ).toBe('');

        expect(
          vm.email,
        ).toBe('');

        expect(
          vm.state,
        ).toBe('idle');

        expect(
          vm.error,
        ).toBeNull();

        expect(
          vm.acceptTerms,
        ).toBe(false);

        expect(
          vm.otpSent,
        ).toBe(false);

        expect(
          vm.isSendingOtp,
        ).toBe(false);

        expect(
          vm.isRegistering,
        ).toBe(false);
      },
    );

    test(
      'rechaza enviar OTP cuando falta el nombre',
      async () => {
        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .sendOtp();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa tu nombre.',
        );

        expect(
          repository
            .sendRegistrationOtp,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'envía OTP con correo normalizado y cambia a otp_sent',
      async () => {
        repository
          .sendRegistrationOtp
          .mockResolvedValue({
            message:
              'Código enviado',
            email:
              'luis@example.com',
            emailSent: true,
          });

        await fillBasicData();

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .sendOtp();
        });

        expect(
          result,
        ).toBe(true);

        expect(
          repository
            .sendRegistrationOtp,
        ).toHaveBeenCalledWith(
          'luis@example.com',
          'Luis',
        );

        expect(
          getViewModel()
            .state,
        ).toBe(
          'otp_sent',
        );

        expect(
          getViewModel()
            .otpSent,
        ).toBe(true);

        expect(
          getViewModel()
            .message,
        ).toBe(
          'Código enviado',
        );
      },
    );

    test(
      'muestra error cuando el OTP no pudo enviarse',
      async () => {
        repository
          .sendRegistrationOtp
          .mockResolvedValue({
            message:
              'No fue posible enviar el código',
            email:
              'luis@example.com',
            emailSent: false,
          });

        await fillBasicData();

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .sendOtp();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'No fue posible enviar el código',
        );

        expect(
          getViewModel()
            .otpSent,
        ).toBe(false);
      },
    );

    test(
      'rechaza una contraseña con secuencia insegura',
      async () => {
        await fillBasicData();

        await act(async () => {
          const vm =
            getViewModel();

          vm.setPassword(
            'Abc123#Seguro',
          );

          vm.setConfirmPassword(
            'Abc123#Seguro',
          );

          vm.setVerificationCode(
            '654321',
          );

          vm.setAcceptTerms(
            true,
          );
        });

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .register();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'La contraseña contiene una secuencia no permitida.',
        );

        expect(
          repository.register,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'rechaza el registro cuando falta el código de verificación',
      async () => {
        await fillBasicData();
        await fillPasswordData();

        await act(async () => {
          getViewModel()
            .setAcceptTerms(
              true,
            );
        });

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .register();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Ingresa el código de verificación enviado a tu correo.',
        );

        expect(
          repository.register,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'rechaza el registro cuando no se acepta el aviso',
      async () => {
        await fillBasicData();
        await fillPasswordData();

        await act(async () => {
          getViewModel()
            .setVerificationCode(
              '654321',
            );
        });

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .register();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'Debes aceptar los términos y condiciones.',
        );

        expect(
          repository.register,
        ).not
          .toHaveBeenCalled();
      },
    );

    test(
      'registra correctamente y normaliza los datos',
      async () => {
        repository.register
          .mockResolvedValue(
            undefined,
          );

        await fillBasicData();
        await fillPasswordData();

        await act(async () => {
          const vm =
            getViewModel();

          vm.setVerificationCode(
            '654321',
          );

          vm.setAcceptTerms(
            true,
          );
        });

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .register();
        });

        expect(
          result,
        ).toBe(true);

        expect(
          repository.register,
        ).toHaveBeenCalledWith({
          firstName: 'Luis',
          paternalLastName:
            'Chavez',
          maternalLastName:
            'Vargas',
          age: 25,
          sex: 'masculino',
          phone:
            '7821234567',
          email:
            'luis@example.com',
          password:
            'Seguro#8046',
          verificationCode:
            '654321',
        });

        expect(
          getViewModel()
            .state,
        ).toBe('success');

        expect(
          getViewModel()
            .message,
        ).toBe(
          'Tu cuenta fue creada correctamente.',
        );
      },
    );

    test(
      'muestra error cuando falla el registro',
      async () => {
        repository.register
          .mockRejectedValue(
            new Error(
              'El correo ya está registrado',
            ),
          );

        await fillBasicData();
        await fillPasswordData();

        await act(async () => {
          const vm =
            getViewModel();

          vm.setVerificationCode(
            '654321',
          );

          vm.setAcceptTerms(
            true,
          );
        });

        let result:
          boolean | undefined;

        await act(async () => {
          result =
            await getViewModel()
              .register();
        });

        expect(
          result,
        ).toBe(false);

        expect(
          getViewModel()
            .state,
        ).toBe('error');

        expect(
          getViewModel()
            .error,
        ).toBe(
          'El correo ya está registrado',
        );
      },
    );

    test(
      'resetError limpia el error y vuelve a idle',
      async () => {
        await act(async () => {
          await getViewModel()
            .sendOtp();
        });

        expect(
          getViewModel()
            .state,
        ).toBe('error');

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