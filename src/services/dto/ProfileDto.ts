
export interface ProfileDto {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  edad: number;
  sexo: string;
  telefono: string;
  correo: string;
}

export interface ProfileResponseDto {
  profile: ProfileDto;
  message?: string;
}

export interface UpdateProfileRequestDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  edad: number;
  sexo: string;
  telefono: string;
}
