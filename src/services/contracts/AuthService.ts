import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterSuccessResponseDto,
  SendOtpRequestDto,
  SendOtpResponseDto,
  SessionResponseDto,
} from '../dto/AuthDto';

export interface AuthService {
  login(
    data: LoginRequestDto,
  ): Promise<LoginResponseDto>;

  sendRegistrationOtp(
    data: SendOtpRequestDto,
  ): Promise<SendOtpResponseDto>;

  register(
    data: RegisterRequestDto,
  ): Promise<RegisterSuccessResponseDto>;

  checkSession(): Promise<SessionResponseDto>;

  logout(): Promise<void>;
}