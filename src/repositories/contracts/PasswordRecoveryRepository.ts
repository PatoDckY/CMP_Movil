
export interface PasswordRecoveryRepository {
  requestPasswordReset(
    email: string,
  ): Promise<void>;
}
