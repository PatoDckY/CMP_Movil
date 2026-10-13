
import {
  Profile,
  UpdateProfileInput,
} from '../../models/Profile';

/**
 * Contrato del repositorio de perfil.
 *
 * La capa de presentación utiliza
 * este contrato sin depender de HTTP.
 */
export interface ProfileRepository {
  getProfile(): Promise<Profile>;

  updateProfile(
    data: UpdateProfileInput,
  ): Promise<Profile>;
}
