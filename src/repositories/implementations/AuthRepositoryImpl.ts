import {mapUserDtoToModel} from '../../mappers/userMapper';
import {
  LoginResult,
  RegisterUserInput,
  RegistrationOtpResult,
  User,
} from '../../models/User';
import {AuthService} from '../../services/contracts/AuthService';
import {ApiError} from '../../services/http/httpClient';
import {
  StoredTokens,
  tokenStorage,
} from '../../services/security/tokenStorage';
import {AuthRepository} from '../contracts/AuthRepository';

type MfaErrorData = {
  message?: string;
  requireMfa?: boolean;
  email?: string;
};

interface AuthTokenStorage {
  saveTokens(
    tokens: StoredTokens,
  ): Promise<void>;

  clearTokens(): Promise<void>;
}

export class AuthRepositoryImpl
  implements AuthRepository
{
  constructor(
    private readonly service: AuthService,
    private readonly storage:
      AuthTokenStorage = tokenStorage,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<LoginResult> {
    try {
      const response =
        await this.service.login({
          correo: email
            .trim()
            .toLowerCase(),
          contrasena: password,
        });

      if ('usuario' in response) {
        await this.storage.saveTokens({
          accessToken:
            response.accessToken,
          refreshToken:
            response.refreshToken,
        });

        return {
          status: 'authenticated',
          user: mapUserDtoToModel(
            response.usuario,
          ),
        };
      }

      return {
        status: 'mfa_required',
        email: response.email,
        message: response.message,
      };
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 403 &&
        typeof error.data ===
          'object' &&
        error.data !== null
      ) {
        const data =
          error.data as MfaErrorData;

        if (
          data.requireMfa === true &&
          data.email
        ) {
          return {
            status: 'mfa_required',
            email: data.email,
            message:
              data.message ??
              'Autenticación de dos factores requerida',
          };
        }
      }

      throw error;
    }
  }

  async sendRegistrationOtp(
    email: string,
    name: string,
  ): Promise<RegistrationOtpResult> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const response =
      await this.service
        .sendRegistrationOtp({
          email: normalizedEmail,
          nombre: name.trim(),
        });

    return {
      message: response.message,
      email: response.email,
      emailSent:
        response.emailEnviado,
    };
  }

  async register(
    data: RegisterUserInput,
  ): Promise<void> {
    await this.service.register({
      nombre: data.firstName,
      apellidoPaterno:
        data.paternalLastName,
      apellidoMaterno:
        data.maternalLastName,
      edad: data.age,
      sexo: data.sex,
      telefono: data.phone,
      correo: data.email
        .trim()
        .toLowerCase(),
      contrasena: data.password,
      codigoVerificacion:
        data.verificationCode,
    });
  }

  async getCurrentUser():
    Promise<User | null> {
    try {
      const response =
        await this.service
          .checkSession();

      if (
        !response.ok ||
        !response.usuario
      ) {
        return null;
      }

      return mapUserDtoToModel(
        response.usuario,
      );
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        return null;
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.service.logout();
    } finally {
      await this.storage.clearTokens();
    }
  }
}