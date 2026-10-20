import * as Keychain from 'react-native-keychain';

export interface PreferencesStorage {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
}

const SERVICE_PREFIX = 'cmp_mobile_prefs_';

// Se usa Keychain porque ya es la única dependencia de almacenamiento nativo
// del proyecto; no se agrega AsyncStorage solo para tres banderas.
export const keychainPreferencesStorage: PreferencesStorage = {
  async read(key) {
    const credentials = await Keychain.getGenericPassword({
      service: `${SERVICE_PREFIX}${key}`,
    });
    return credentials ? credentials.password : null;
  },
  async write(key, value) {
    const saved = await Keychain.setGenericPassword('prefs', value, {
      service: `${SERVICE_PREFIX}${key}`,
    });
    if (!saved) {
      throw new Error('No se pudo guardar la preferencia.');
    }
  },
};
