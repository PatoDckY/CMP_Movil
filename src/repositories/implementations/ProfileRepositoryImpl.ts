
import {
  Profile,
  UpdateProfileInput,
} from '../../models/Profile';

import {
  mapProfileDtoToModel,
  mapUpdateProfileToDto,
} from '../../mappers/profileMapper';

import {
  ProfileService,
} from '../../services/contracts/ProfileService';

import {
  ProfileRepository,
} from '../contracts/ProfileRepository';

/**
 * Repositorio de datos personales.
 *
 * Separa los servicios HTTP de
 * la lógica utilizada por MVVM.
 */
export class ProfileRepositoryImpl
  implements ProfileRepository {

  constructor(
    private readonly service: ProfileService,
  ) {}

  async getProfile(): Promise<Profile> {
    const response =
      await this.service.getProfile();

    return mapProfileDtoToModel(
      response.profile,
    );
  }

  async updateProfile(
    data: UpdateProfileInput,
  ): Promise<Profile> {
    const requestDto =
      mapUpdateProfileToDto(data);

    const response =
      await this.service.updateProfile(
        requestDto,
      );

    return mapProfileDtoToModel(
      response.profile,
    );
  }
}
