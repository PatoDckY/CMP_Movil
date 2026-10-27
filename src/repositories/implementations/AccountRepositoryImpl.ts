import { AccountRepository } from '../contracts/AccountRepository';
import { AccountService } from '../../services/contracts/AccountService';
import {
  AccountDeletionReceipt,
  AccountDeletionRequest,
  AccountDeletionError,
} from '../../models/AccountDeletion';
import { ApiError } from '../../services/http/httpClient';
import { mapAccountDeletionReceipt } from '../../mappers/accountMapper';
export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly service: AccountService) {}
  async requestDeletion(
    input: AccountDeletionRequest,
  ): Promise<AccountDeletionReceipt> {
    if (!input.confirmed || !input.password || input.password.length > 200) {
      throw new Error(
        'Confirma la solicitud e ingresa tu contraseña actual (máximo 200 caracteres).',
      );
    }
    try {
      const response = await this.service.requestDeletion({
        contrasena: input.password,
        confirmacion: true,
      });
      return mapAccountDeletionReceipt(response);
    } catch (error) {
      const messages: Record<number, string> = {
        400: 'Confirma la solicitud e ingresa una contraseña válida.',
        401: 'Tu sesión ya no es válida. Inicia sesión nuevamente.',
        403: 'La contraseña es incorrecta o tu cuenta requiere atención administrativa.',
        404: 'La cuenta no está disponible. Consulta al centro antes de reintentar.',
        423: 'La cuenta está bloqueada temporalmente por intentos incorrectos. Espera antes de reintentar.',
        500: 'El servidor no pudo confirmar la solicitud. Consulta su estado antes de reintentar.',
      };
      throw new AccountDeletionError(
        error instanceof ApiError && messages[error.status]
          ? messages[error.status]
          : 'No fue posible confirmar la solicitud. Revisa tu conexión. Si reintentas, el servidor devolverá el folio de una solicitud abierta existente.',
      );
    }
  }
}
