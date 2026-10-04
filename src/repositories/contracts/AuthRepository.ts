import {
  LoginResult,
  RegisterUserInput,
  User,
} from '../../models/User';

export interface AuthRepository {
  login(
    email: string,
    password: string,
  ): Promise<LoginResult>;

  register(
    data: RegisterUserInput,
  ): Promise<void>;

  getCurrentUser(): Promise<User | null>;

  logout(): Promise<void>;
}