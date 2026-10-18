import {User} from '../models/User';
import {UserDto} from '../services/dto/UserDto';

export function mapUserDtoToModel(dto: UserDto): User {
  if (!dto || !Number.isSafeInteger(dto.id) || dto.id <= 0 ||
      typeof dto.nombre !== 'string' || typeof dto.nombreCompleto !== 'string' ||
      typeof dto.correo !== 'string' || !dto.correo ||
      typeof dto.rol !== 'string' || !dto.rol ||
      (dto.apellidoPaterno !== null && typeof dto.apellidoPaterno !== 'string') ||
      (dto.apellidoMaterno !== null && typeof dto.apellidoMaterno !== 'string')) {
    throw new Error('El servidor no devolvió una identidad de usuario válida.');
  }
  return {
    id: dto.id,
    firstName: dto.nombre,
    paternalLastName: dto.apellidoPaterno,
    maternalLastName: dto.apellidoMaterno,
    fullName: dto.nombreCompleto,
    email: dto.correo,
    role: dto.rol,
  };
}
