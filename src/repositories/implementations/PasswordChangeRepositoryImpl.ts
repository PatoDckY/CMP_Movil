import {
  PasswordChangeService,
} from '../../services/contracts/PasswordChangeService';

import {
  PasswordChangeRepository,
} from '../contracts/PasswordChangeRepository';

/**
 * Repositorio de cambio de contraseña.
 *
 * No hay modelo de dominio que mapear: solo éxito (mensaje) o error.
 * Las contraseñas no se validan ni se registran aquí; el servidor es
 * la fuente de verdad de la política.
 */
export class PasswordChangeRepositoryImpl
  implements PasswordChangeRepository {

  constructor(
    private readonly service: PasswordChangeService,
  ) {}

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<string> {
    const response = await this.service.changePassword({
      contrasenaActual: currentPassword,
      contrasenaNueva: newPassword,
      confirmarContrasenaNueva: confirmNewPassword,
    });

    return typeof response?.message === 'string' && response.message
      ? response.message
      : 'Contraseña actualizada correctamente. Vuelve a iniciar sesión.';
  }
}
