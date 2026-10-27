export interface PasswordChangeRepository {
  // Devuelve el mensaje del servidor. Los errores (ApiError con 400/401/409)
  // se propagan sin cambios: su mensaje ya está redactado para el usuario.
  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<string>;
}
