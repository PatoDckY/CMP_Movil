
import {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from '../dto/ProfileDto';

/**
 * Contrato del servicio de perfil.
 *
 * GET: Derecho de Acceso.
 * PUT: Derecho de Rectificación.
 */
export interface ProfileService {
  getProfile(): Promise<ProfileResponseDto>;

  updateProfile(
    data: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto>;
}
