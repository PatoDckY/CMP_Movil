
import {
  ChangePasswordRequestDto,
  ChangePasswordResponseDto,
} from '../dto/ChangePasswordDto';

/**
 * Contrato del servicio de cambio de contraseña autenticado.
 *
 * Un cambio exitoso invalida la sesión actual en el servidor.
 */
export interface PasswordChangeService {
  changePassword(
    data: ChangePasswordRequestDto,
  ): Promise<ChangePasswordResponseDto>;
}
