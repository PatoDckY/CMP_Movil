import {UserDto} from './UserDto';

export interface LoginRequestDto {
  correo: string;
  contrasena: string;
}

export interface LoginSuccessResponseDto {
  message: string;
  usuario: UserDto;
}

export interface LoginMfaRequiredResponseDto {
  message: string;
  requireMfa: true;
  email: string;
}

export type LoginResponseDto =
  | LoginSuccessResponseDto
  | LoginMfaRequiredResponseDto;

export interface SendOtpRequestDto {
  email: string;
  nombre: string;
}

export interface SendOtpResponseDto {
  success: true;
  message: string;
  email: string;
  emailEnviado: boolean;
}

export interface AuthErrorResponseDto {
  message: string;
  bloqueado?: boolean;
}

export interface SessionResponseDto {
  ok: boolean;
  usuario?: UserDto;
  message?: string;
}

export interface RegisterRequestDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;

  edad: number;
  sexo: string;
  telefono: string;

  correo: string;
  contrasena: string;

  codigoVerificacion: string;
}

export interface RegisteredUserDto {
  id: number;

  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;

  edad: number;
  sexo: string;
  telefono: string;

  correo: string;

  rolId: number;
  activo: boolean;
}

export interface RegisterSuccessResponseDto {
  mensaje: string;
  usuario: RegisteredUserDto;
}