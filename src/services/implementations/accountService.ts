import { AccountService } from '../contracts/AccountService';
import { AccountDeletionResponseDto } from '../dto/AccountDto';
import { apiRequest } from '../http/httpClient';
export const accountService: AccountService = {
  requestDeletion(input) {
    return apiRequest<AccountDeletionResponseDto>(
      '/account',
      {
        method: 'DELETE',
        body: JSON.stringify(input),
      },
      { requireAuthentication: true, expectedStatus: 202, timeoutMs: 15_000 },
    );
  },
};
