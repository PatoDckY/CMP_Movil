
import {
  OptOutPreferencesService,
} from '../contracts/OptOutPreferencesService';

import {
  OptOutPreferencesResponseDto,
  UpdateOptOutPreferencesRequestDto,
} from '../dto/OptOutPreferencesDto';

import {
  apiRequest,
} from '../http/httpClient';

/**
 * Servicio de preferencias de Opt-Out.
 *
 * Consume el endpoint protegido
 * de CMP_Site:
 *
 * GET /api/profile/privacy-preferences
 * PUT /api/profile/privacy-preferences
 */
export const optOutPreferencesService: OptOutPreferencesService = {
  getPreferences(): Promise<OptOutPreferencesResponseDto> {
    return apiRequest<OptOutPreferencesResponseDto>(
      '/profile/privacy-preferences',
      {
        method: 'GET',
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  updatePreferences(
    data: UpdateOptOutPreferencesRequestDto,
  ): Promise<OptOutPreferencesResponseDto> {
    return apiRequest<OptOutPreferencesResponseDto>(
      '/profile/privacy-preferences',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },
};
