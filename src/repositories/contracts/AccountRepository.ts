import {
  AccountDeletionReceipt,
  AccountDeletionRequest,
} from '../../models/AccountDeletion';
export interface AccountRepository {
  requestDeletion(
    input: AccountDeletionRequest,
  ): Promise<AccountDeletionReceipt>;
}
