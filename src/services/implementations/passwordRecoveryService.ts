
import {apiRequest} from '../http/httpClient';
import {PasswordRecoveryService} from '../contracts/PasswordRecoveryService';

interface PasswordRecoveryResponse {
  message: string;
}

export const passwordRecoveryService: PasswordRecoveryService = {
  requestPasswordReset(
    email: string,
  ): Promise<PasswordRecoveryResponse> {
    return apiRequest<PasswordRecoveryResponse>(
      '/auth/password-reset/request',
      {
        method: 'POST',
        body: JSON.stringify({
          correo: email,
        }),
      },
      {timeoutMs: 15_000},
    );
  },
};
