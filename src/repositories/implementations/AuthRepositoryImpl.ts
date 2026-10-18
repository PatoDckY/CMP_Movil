import {mapUserDtoToModel} from '../../mappers/userMapper';
import {LogoutError} from '../../models/LogoutError';
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
    expectedVersion?: number,
  ): Promise<number>;

  clearTokens(): Promise<void>;
  clearTokensForLogout(): Promise<string | null>;
  getSessionVersion(): number;
  getAccessToken(): Promise<string | null>;
}

export class AuthRepositoryImpl
  implements AuthRepository
{
  private logoutPromise: Promise<void> | null = null;

  constructor(
    private readonly service: AuthService,
    private readonly storage:
      AuthTokenStorage = tokenStorage,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<LoginResult> {
    if (this.logoutPromise) {
      throw new Error('Espera a que termine el cierre de sesión.');
    }
    const version = this.storage.getSessionVersion();
    try {
      const response =
        await this.service.login({
          correo: email
            .trim()
            .toLowerCase(),
          contrasena: password,
        });

      if (version !== this.storage.getSessionVersion()) {
        throw new Error('La sesión cambió durante la autenticación.');
      }

      if (!response || typeof response !== 'object') {
        throw new Error('La respuesta de autenticación no es válida.');
      }
      if ('usuario' in response) {
        const user = mapUserDtoToModel(response.usuario);
        const savedVersion = await this.storage.saveTokens(
          {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          },
          version,
        );

        if (savedVersion !== this.storage.getSessionVersion()) {
          throw new Error('La sesión cambió durante la autenticación.');
        }

        return {
          status: 'authenticated',
          user,
        };
      }

      if (response.requireMfa !== true || typeof response.email !== 'string' || !response.email) {
        throw new Error('La respuesta de autenticación no es válida.');
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
    const version = this.storage.getSessionVersion();
    if (
      !(await this.storage.getAccessToken()) ||
      version !== this.storage.getSessionVersion()
    ) {
      return null;
    }
    try {
      const response =
        await this.service
          .checkSession();

      if (
        version !== this.storage.getSessionVersion() ||
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

  logout(): Promise<void> {
    if (this.logoutPromise) {
      return this.logoutPromise;
    }
    this.logoutPromise = this.performLogout().finally(() => {
      this.logoutPromise = null;
    });
    return this.logoutPromise;
  }

  private async performLogout(): Promise<void> {
    let accessToken: string | null;
    try {
      accessToken = await this.storage.clearTokensForLogout();
    } catch (error) {
      if (error instanceof LogoutError) {
        throw error;
      }
      throw new LogoutError('local');
    }
    if (!accessToken) {
      return;
    }
    try {
      await this.service.logout(accessToken);
    } catch {
      throw new LogoutError('remote');
    }
  }
}
