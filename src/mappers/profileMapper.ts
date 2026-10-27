
import {
  Profile,
  UpdateProfileInput,
} from '../models/Profile';

import {
  ProfileDto,
  UpdateProfileRequestDto,
} from '../services/dto/ProfileDto';

/**
 * Convierte datos de CMP_Site al modelo
 * utilizado en CMP_Movil.
 */
export function mapProfileDtoToModel(
  dto: ProfileDto,
): Profile {
  if (!dto || !Number.isSafeInteger(dto.id) || dto.id <= 0 ||
      typeof dto.nombre !== 'string' || typeof dto.apellidoPaterno !== 'string' ||
      (dto.apellidoMaterno !== null && typeof dto.apellidoMaterno !== 'string') ||
      typeof dto.edad !== 'number' || !Number.isFinite(dto.edad) ||
      typeof dto.sexo !== 'string' || typeof dto.telefono !== 'string' ||
      typeof dto.correo !== 'string') {
    throw new Error('El servidor no devolvió un perfil válido.');
  }
  return {
    id: dto.id,
    firstName: dto.nombre,
    paternalLastName:
      dto.apellidoPaterno,
    maternalLastName:
      dto.apellidoMaterno,
    age: dto.edad,
    sex: dto.sexo,
    phone: dto.telefono,
    email: dto.correo,
  };
}

/**
 * Convierte los campos editables del
 * formulario al formato del backend.
 */
export function mapUpdateProfileToDto(
  input: UpdateProfileInput,
): UpdateProfileRequestDto {
  return {
    nombre: input.firstName.trim(),
    apellidoPaterno:
      input.paternalLastName.trim(),
    apellidoMaterno:
      input.maternalLastName?.trim() ||
      null,
    edad: input.age,
    sexo: input.sex,
    telefono: input.phone.trim(),
  };
}
