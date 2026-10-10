import {AuthRepositoryImpl} from '../../src/repositories/implementations/AuthRepositoryImpl';
import {AuthService} from '../../src/services/contracts/AuthService';
import {ApiError} from '../../src/services/http/httpClient';

describe('AuthRepositoryImpl', () => {
  let service: jest.Mocked<AuthService>;
  let repository: AuthRepositoryImpl;

  const userDto = {
    id: 10,
    nombre: 'Luis',
    apellidoPaterno: 'Chavez',
    apellidoMaterno: 'Vargas',
    nombreCompleto:
      'Luis Chavez Vargas',
    correo: 'luis@example.com',
    email: 'luis@example.com',
    rol: 'Cliente',
  };

  beforeEach(() => {
    service = {
      login: jest.fn(),
      sendRegistrationOtp:
        jest.fn(),
      register: jest.fn(),
      checkSession: jest.fn(),
      logout: jest.fn(),
    };

    repository =
      new AuthRepositoryImpl(
        service,
      );
  });

  test(
    'normaliza el correo y devuelve usuario autenticado',
    async () => {
      service.login.mockResolvedValue({
        message:
          'Inicio de sesión exitoso',
        usuario: userDto,
      });

      const result =
        await repository.login(
          '  LUIS@EXAMPLE.COM  ',
          'Password#1',
        );

      expect(
        service.login,
      ).toHaveBeenCalledWith({
        correo: 'luis@example.com',
        contrasena: 'Password#1',
      });

      expect(result).toEqual({
        status: 'authenticated',
        user: {
          id: 10,
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
        },
      });
    },
  );

  test(
    'devuelve mfa_required cuando el backend solicita MFA',
    async () => {
      service.login.mockRejectedValue(
        new ApiError(
          'MFA requerido',
          403,
          {
            message:
              'Código MFA requerido',
            requireMfa: true,
            email:
              'luis@example.com',
          },
        ),
      );

      const result =
        await repository.login(
          'luis@example.com',
          'Password#1',
        );

      expect(result).toEqual({
        status: 'mfa_required',
        email:
          'luis@example.com',
        message:
          'Código MFA requerido',
      });
    },
  );

  test(
    'normaliza correo y nombre al enviar OTP',
    async () => {
      service
        .sendRegistrationOtp
        .mockResolvedValue({
          success: true,
          message:
            'Código enviado',
          email:
            'nuevo@example.com',
          emailEnviado: true,
        });

      const result =
        await repository
          .sendRegistrationOtp(
            '  NUEVO@EXAMPLE.COM  ',
            '  Luis  ',
          );

      expect(
        service
          .sendRegistrationOtp,
      ).toHaveBeenCalledWith({
        email:
          'nuevo@example.com',
        nombre: 'Luis',
      });

      expect(result).toEqual({
        message:
          'Código enviado',
        email:
          'nuevo@example.com',
        emailSent: true,
      });
    },
  );

  test(
    'transforma los datos de registro al formato del backend',
    async () => {
      service.register
        .mockResolvedValue(
          undefined as never,
        );

      await repository.register({
        firstName: 'Luis',
        paternalLastName:
          'Chavez',
        maternalLastName:
          'Vargas',
        age: 25,
        sex: 'masculino',
        phone: '7821234567',
        email:
          '  LUIS@EXAMPLE.COM  ',
        password:
          'Password#1',
        verificationCode:
          '123456',
      });

      expect(
        service.register,
      ).toHaveBeenCalledWith({
        nombre: 'Luis',
        apellidoPaterno:
          'Chavez',
        apellidoMaterno:
          'Vargas',
        edad: 25,
        sexo: 'masculino',
        telefono:
          '7821234567',
        correo:
          'luis@example.com',
        contrasena:
          'Password#1',
        codigoVerificacion:
          '123456',
      });
    },
  );

  test(
    'devuelve el usuario cuando existe una sesión activa',
    async () => {
      service
        .checkSession
        .mockResolvedValue({
          ok: true,
          usuario: userDto,
        });

      const result =
        await repository
          .getCurrentUser();

      expect(result).toEqual({
        id: 10,
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
      });
    },
  );

  test(
    'devuelve null cuando la sesión expiró',
    async () => {
      service
        .checkSession
        .mockRejectedValue(
          new ApiError(
            'No autorizado',
            401,
            {
              message:
                'No hay sesión activa',
            },
          ),
        );

      const result =
        await repository
          .getCurrentUser();

      expect(result).toBeNull();
    },
  );

  test(
    'propaga errores distintos de 401 al consultar la sesión',
    async () => {
      service
        .checkSession
        .mockRejectedValue(
          new ApiError(
            'Error interno',
            500,
            {},
          ),
        );

      await expect(
        repository
          .getCurrentUser(),
      ).rejects.toThrow(
        'Error interno',
      );
    },
  );

  test(
    'ejecuta el cierre de sesión mediante el servicio',
    async () => {
      service.logout
        .mockResolvedValue(
          undefined,
        );

      await repository.logout();

      expect(
        service.logout,
      ).toHaveBeenCalledTimes(
        1,
      );
    },
  );
});