
import {
  OptOutPreferencesResponseDto,
  UpdateOptOutPreferencesRequestDto,
} from '../dto/OptOutPreferencesDto';

/**
 * Contrato del servicio de preferencias de privacidad.
 *
 * GET y PUT: Derecho de Oposición (Opt-Out).
 */
export interface OptOutPreferencesService {
  getPreferences(): Promise<OptOutPreferencesResponseDto>;

  updatePreferences(
    data: UpdateOptOutPreferencesRequestDto,
  ): Promise<OptOutPreferencesResponseDto>;
}
