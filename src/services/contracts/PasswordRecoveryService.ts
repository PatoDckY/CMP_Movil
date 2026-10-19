export interface PasswordRecoveryService {
  requestPasswordReset(email: string): Promise<{ message: string }>;
}
