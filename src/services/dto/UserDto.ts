export interface UserDto {
  id: number;
  nombre: string;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  nombreCompleto: string;
  correo: string;
  email: string;
  rol: string;
}