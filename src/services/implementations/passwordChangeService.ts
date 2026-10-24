
import {
  PasswordChangeService,
} from '../contracts/PasswordChangeService';

import {
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
} from '../dto/ChangePasswordDto';

import {
  apiRequest,
} from '../http/httpClient';

/**
 * Servicio de cambio de contraseña.
 *
 * Consume el endpoint protegido
 * de CMP_Site:
 *
 * PUT /api/profile/password
 */
export const passwordChangeService: PasswordChangeService = {
  changePassword(
    data: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto> {
    return apiRequest<ChangePasswordResponseDto>(
      '/profile/password',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      {
        requireAuthentication: true,
        timeoutMs: 15_000,
        // 401 también significa "contraseña actual incorrecta": no debe cerrar la sesión.
        preserveSessionOnUnauthorized: true,
      },
    );
  },
};
