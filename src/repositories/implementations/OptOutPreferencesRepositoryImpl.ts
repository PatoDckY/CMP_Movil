import {
  DEFAULT_OPT_OUT_PREFERENCES,
  OptOutPreferences,
  parseOptOutPreferences,
} from '../../models/OptOutPreferences';
import { PreferencesStorage } from '../../storage/keychainPreferencesStorage';
import { OptOutPreferencesRepository } from '../contracts/OptOutPreferencesRepository';

// TODO(A66): CMP_Site no expone un endpoint para preferencias de Opt-Out
// (ver docs/quality/BACKEND_CONTRACTS.md). Mientras tanto la preferencia es
// solo local por usuario y dispositivo; migrar a un Service HTTP cuando exista.
export class OptOutPreferencesRepositoryImpl
  implements OptOutPreferencesRepository
{
  constructor(private readonly storage: PreferencesStorage) {}

  private keyFor(userId: number): string {
    return `optout_${userId}`;
  }

  async load(userId: number): Promise<OptOutPreferences> {
    const raw = await this.storage.read(this.keyFor(userId));
    if (!raw) {
      return { ...DEFAULT_OPT_OUT_PREFERENCES };
    }
    try {
      return parseOptOutPreferences(JSON.parse(raw));
    } catch {
      return { ...DEFAULT_OPT_OUT_PREFERENCES };
    }
  }

  async save(userId: number, preferences: OptOutPreferences): Promise<void> {
    await this.storage.write(
      this.keyFor(userId),
      JSON.stringify(parseOptOutPreferences(preferences)),
    );
  }
}
