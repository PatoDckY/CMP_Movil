
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
