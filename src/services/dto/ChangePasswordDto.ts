
export interface ChangePasswordRequestDto {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasenaNueva: string;
}

export interface ChangePasswordResponseDto {
  message: string;
}
