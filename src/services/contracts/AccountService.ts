import {
  AccountDeletionRequestDto,
  AccountDeletionResponseDto,
} from '../dto/AccountDto';
export interface AccountService {
  requestDeletion(
    input: AccountDeletionRequestDto,
  ): Promise<AccountDeletionResponseDto>;
}
