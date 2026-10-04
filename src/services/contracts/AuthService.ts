import {
  LoginRequestDto,
  LoginSuccessResponseDto,
  RegisterRequestDto,
  RegisterSuccessResponseDto,
  SessionResponseDto,
} from '../dto/AuthDto';

export interface AuthService {
  login(
    data: LoginRequestDto,
  ): Promise<LoginSuccessResponseDto>;

  register(
    data: RegisterRequestDto,
  ): Promise<RegisterSuccessResponseDto>;

  checkSession(): Promise<SessionResponseDto>;

  logout(): Promise<void>;
}