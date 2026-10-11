import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'cmp_mobile_auth';
const TOKEN_USERNAME = 'mobile_session';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

function isStoredTokens(
  value: unknown,
): value is StoredTokens {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false;
  }

  const tokens =
    value as Partial<StoredTokens>;

  return (
    typeof tokens.accessToken ===
      'string' &&
    tokens.accessToken.length > 0 &&
    typeof tokens.refreshToken ===
      'string' &&
    tokens.refreshToken.length > 0
  );
}

export const tokenStorage = {
  async saveTokens(
    tokens: StoredTokens,
  ): Promise<void> {
    await Keychain.setGenericPassword(
      TOKEN_USERNAME,
      JSON.stringify(tokens),
      {
        service: TOKEN_SERVICE,
      },
    );
  },

  async getTokens():
    Promise<StoredTokens | null> {
    const credentials =
      await Keychain.getGenericPassword({
        service: TOKEN_SERVICE,
      });

    if (!credentials) {
      return null;
    }

    try {
      const parsed: unknown =
        JSON.parse(
          credentials.password,
        );

      if (!isStoredTokens(parsed)) {
        await this.clearTokens();
        return null;
      }

      return parsed;
    } catch {
      await this.clearTokens();
      return null;
    }
  },

  async getAccessToken():
    Promise<string | null> {
    const tokens =
      await this.getTokens();

    return (
      tokens?.accessToken ?? null
    );
  },

  async getRefreshToken():
    Promise<string | null> {
    const tokens =
      await this.getTokens();

    return (
      tokens?.refreshToken ?? null
    );
  },

  async updateAccessToken(
    accessToken: string,
  ): Promise<void> {
    const tokens =
      await this.getTokens();

    if (!tokens) {
      return;
    }

    await this.saveTokens({
      ...tokens,
      accessToken,
    });
  },

  async clearTokens():
    Promise<void> {
    await Keychain.resetGenericPassword({
      service: TOKEN_SERVICE,
    });
  },
};