
import {
  ProfileService,
} from '../contracts/ProfileService';

import {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from '../dto/ProfileDto';

import {
  apiRequest,
} from '../http/httpClient';

/**
 * Servicio de datos personales.
 *
 * Consume el endpoint protegido
 * de CMP_Site:
 *
 * GET /api/profile
 * PUT /api/profile
 */
export const profileService: ProfileService = {
  getProfile(): Promise<ProfileResponseDto> {
    return apiRequest<ProfileResponseDto>(
      '/profile',
      {
        method: 'GET',
      },
    );
  },

  updateProfile(
    data: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    return apiRequest<ProfileResponseDto>(
      '/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
  },
};
