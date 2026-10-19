import { PasswordRecoveryRepository } from '../contracts/PasswordRecoveryRepository';

import { PasswordRecoveryService } from '../../services/contracts/PasswordRecoveryService';

export class PasswordRecoveryRepositoryImpl
  implements PasswordRecoveryRepository
{
  constructor(private readonly service: PasswordRecoveryService) {}
  async requestPasswordReset(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    await this.service.requestPasswordReset(normalizedEmail);
  }
}
