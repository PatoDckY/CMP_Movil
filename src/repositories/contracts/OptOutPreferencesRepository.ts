import { OptOutPreferences } from '../../models/OptOutPreferences';

export interface OptOutPreferencesRepository {
  load(userId: number): Promise<OptOutPreferences>;
  save(userId: number, preferences: OptOutPreferences): Promise<void>;
}
