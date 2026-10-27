export interface AccountDeletionRequest {
  password: string;
  confirmed: boolean;
}
export interface AccountDeletionReceipt {
  message: string;
  requestId: number;
  status: 'pendiente' | 'respondida';
  deletionCompleted: false;
}

export class AccountDeletionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountDeletionError';
  }
}
