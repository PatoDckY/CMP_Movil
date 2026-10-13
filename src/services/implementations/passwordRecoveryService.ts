
import {apiRequest} from '../http/httpClient';

interface PasswordRecoveryResponse {
  message: string;
}

export const passwordRecoveryService = {
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
    );
  },
};
