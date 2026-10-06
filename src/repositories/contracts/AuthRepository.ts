import {
  LoginResult,
  RegisterUserInput,
  RegistrationOtpResult,
  User,
} from '../../models/User';

export interface AuthRepository {
  login(
    email: string,
    password: string,
  ): Promise<LoginResult>;

  sendRegistrationOtp(
    email: string,
    name: string,
  ): Promise<RegistrationOtpResult>;

  register(
    data: RegisterUserInput,
  ): Promise<void>;

  getCurrentUser(): Promise<User | null>;

  logout(): Promise<void>;
}