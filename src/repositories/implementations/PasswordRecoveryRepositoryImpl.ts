
import {
  PasswordRecoveryRepository,
} from '../contracts/PasswordRecoveryRepository';

import {
  passwordRecoveryService,
} from '../../services/implementations/passwordRecoveryService';

export class PasswordRecoveryRepositoryImpl
  implements PasswordRecoveryRepository
{
  async requestPasswordReset(
    email: string,
  ): Promise<void> {
    const normalizedEmail =
      email.trim().toLowerCase();

    await passwordRecoveryService
      .requestPasswordReset(
        normalizedEmail,
      );
  }
}
