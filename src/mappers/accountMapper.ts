import { AccountDeletionReceipt } from '../models/AccountDeletion';
import { AccountDeletionResponseDto } from '../services/dto/AccountDto';
export function mapAccountDeletionReceipt(
  dto: AccountDeletionResponseDto,
): AccountDeletionReceipt {
  if (
    !dto ||
    typeof dto.message !== 'string' ||
    !Number.isSafeInteger(dto.solicitudId) ||
    dto.solicitudId <= 0 ||
    !['pendiente', 'respondida'].includes(dto.estado) ||
    dto.eliminacionCompletada !== false
  ) {
    throw new Error(
      'No fue posible verificar el folio. Consulta tu solicitud antes de reintentar.',
    );
  }
  return {
    message: dto.message,
    requestId: dto.solicitudId,
    status: dto.estado,
    deletionCompleted: false,
  };
}
