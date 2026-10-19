export interface AccountDeletionRequestDto {
  contrasena: string;
  confirmacion: true;
}
export interface AccountDeletionResponseDto {
  message: string;
  solicitudId: number;
  estado: 'pendiente' | 'respondida';
  eliminacionCompletada: false;
}
