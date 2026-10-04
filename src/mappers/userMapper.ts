import {User} from '../models/User';
import {UserDto} from '../services/dto/UserDto';

export function mapUserDtoToModel(dto: UserDto): User {
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