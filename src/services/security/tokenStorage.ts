import * as Keychain from 'react-native-keychain';
import {LogoutError} from '../../models/LogoutError';
import {sessionEvents} from './sessionEvents';

const TOKEN_SERVICE = 'cmp_mobile_auth';
const TOKEN_USERNAME = 'mobile_session';

// Invalida operaciones pendientes al cerrar sesión. Las mutaciones de
// Keychain se serializan para que un guardado anterior no sobreviva al borrado.
let sessionVersion = 0;
let blocked = false;
let mutation: Promise<unknown> = Promise.resolve();

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutation.then(operation);
  mutation = result.catch(() => undefined);
  return result;
}

function removeTokens(captureAccessToken: boolean): Promise<string | null> {
  sessionVersion += 1;
  blocked = true;
  sessionEvents.invalidate();
  return serialize(async () => {
    let accessToken: string | null = null;
    let captureFailed = false;
    if (captureAccessToken) {
      // Un fallo de lectura no debe impedir el intento de borrado.
      try {
        const credentials = await Keychain.getGenericPassword({
          service: TOKEN_SERVICE,
        });
        if (credentials) {
          const value: unknown = JSON.parse(credentials.password);
          if (isStoredTokens(value)) {
            accessToken = value.accessToken;
          } else {
            captureFailed = true;
          }
        }
      } catch {
        captureFailed = true;
      }
    }
    const removed = await Keychain.resetGenericPassword({service: TOKEN_SERVICE});
    const remaining = await Keychain.getGenericPassword({service: TOKEN_SERVICE});
    if (!removed || remaining) {
      throw new Error('No se pudo verificar la limpieza de credenciales locales.');
    }
    if (captureFailed) {
      throw new LogoutError('remote');
    }
    return accessToken;
  });
}

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
    /^\S+$/.test(tokens.accessToken) &&
    typeof tokens.refreshToken ===
      'string' &&
    /^\S+$/.test(tokens.refreshToken)
  );
}

async function persistTokens(tokens: StoredTokens): Promise<void> {
  try {
    const saved = await Keychain.setGenericPassword(
      TOKEN_USERNAME, JSON.stringify(tokens), {service: TOKEN_SERVICE},
    );
    const credentials = saved ? await Keychain.getGenericPassword({service: TOKEN_SERVICE}) : false;
    const stored: unknown = credentials ? JSON.parse(credentials.password) : null;
    if (!isStoredTokens(stored) || stored.accessToken !== tokens.accessToken || stored.refreshToken !== tokens.refreshToken) {
      throw new Error('Persistencia no confirmada.');
    }
  } catch {
    // Un guardado incierto no puede dejar una identidad confiable en memoria.
    blocked = true;
    sessionVersion += 1;
    sessionEvents.invalidate();
    try {
      const removed = await Keychain.resetGenericPassword({service: TOKEN_SERVICE});
      const remaining = await Keychain.getGenericPassword({service: TOKEN_SERVICE});
      if (!removed || remaining) { throw new Error('Limpieza no confirmada.'); }
    } catch {
      throw new Error('El acceso quedó bloqueado: no se pudo verificar ni limpiar el almacenamiento seguro.');
    }
    throw new Error('No se pudo verificar el guardado seguro. Las credenciales locales fueron retiradas.');
  }
}

export const tokenStorage = {
  getSessionVersion(): number {
    return sessionVersion;
  },

  clearTokensForLogout(): Promise<string | null> {
    return removeTokens(true);
  },

  async saveTokens(
    tokens: StoredTokens,
    expectedVersion = sessionVersion,
  ): Promise<number> {
    if (!isStoredTokens(tokens)) {
      throw new Error('La respuesta de autenticación no contiene credenciales válidas.');
    }
    return serialize(async () => {
      if (expectedVersion !== sessionVersion) {
        throw new Error('La sesión cambió durante la autenticación.');
      }
      await persistTokens(tokens);
      if (expectedVersion !== sessionVersion) {
        throw new Error('La sesión cambió durante la autenticación.');
      }
      sessionVersion += 1;
      blocked = false;
      return sessionVersion;
    });
  },

  async getTokens():
    Promise<StoredTokens | null> {
    const version = sessionVersion;
    if (blocked) {
      return null;
    }
    const credentials =
      await Keychain.getGenericPassword({
        service: TOKEN_SERVICE,
      });

    if (!credentials || blocked || version !== sessionVersion) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(credentials.password);
    } catch {
      parsed = null;
    }
    if (!isStoredTokens(parsed)) {
      await this.clearTokens();
      return null;
    }
    return parsed;
  },

  async getAccessToken():
    Promise<string | null> {
    const tokens = await this.getTokens();

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
    expectedVersion = sessionVersion,
  ): Promise<boolean> {
    return serialize(async () => {
      if (blocked || expectedVersion !== sessionVersion) {
        return false;
      }
      const credentials = await Keychain.getGenericPassword({service: TOKEN_SERVICE});
      const parsed: unknown = credentials ? JSON.parse(credentials.password) : null;
      const tokens = isStoredTokens(parsed) ? parsed : null;

      if (!tokens || blocked || expectedVersion !== sessionVersion) {
        return false;
      }

      await persistTokens({...tokens, accessToken});
      return !blocked && expectedVersion === sessionVersion;
    });
  },

  async clearTokens():
    Promise<void> {
    await removeTokens(false);
  },
};
