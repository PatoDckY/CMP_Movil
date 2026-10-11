import {AuthService} from '../contracts/AuthService';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterSuccessResponseDto,
  SendOtpRequestDto,
  SendOtpResponseDto,
  SessionResponseDto,
} from '../dto/AuthDto';
import {apiRequest} from '../http/httpClient';

export const authService: AuthService = {
  login(
    data: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return apiRequest<LoginResponseDto>(
      '/auth/mobile/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
  },

  sendRegistrationOtp(
    data: SendOtpRequestDto,
  ): Promise<SendOtpResponseDto> {
    return apiRequest<SendOtpResponseDto>(
      '/auth/send-otp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
  },

  register(
    data: RegisterRequestDto,
  ): Promise<RegisterSuccessResponseDto> {
    return apiRequest<RegisterSuccessResponseDto>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
  },

  checkSession(): Promise<SessionResponseDto> {
    return apiRequest<SessionResponseDto>(
      '/auth/check-session',
      {
        method: 'GET',
      },
    );
  },

  async logout(): Promise<void> {
    await apiRequest<{
      message: string;
    }>('/auth/mobile/logout', {
      method: 'POST',
    });
  },
};