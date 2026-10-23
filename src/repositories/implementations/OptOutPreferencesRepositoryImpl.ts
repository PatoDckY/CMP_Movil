import {
  OptOutPreferences,
  parseOptOutPreferences,
} from '../../models/OptOutPreferences';
import { OptOutPreferencesService } from '../../services/contracts/OptOutPreferencesService';
import { OptOutPreferencesRepository } from '../contracts/OptOutPreferencesRepository';

// Decisiones de diseño:
// - Fallo de red/HTTP: load() y save() propagan el error, igual que
//   ProfileRepositoryImpl; useOptOutViewModel ya lo traduce a mensaje y revierte
//   el switch. No se cae a un default "sin oposición", porque mostraría como
//   inactiva una oposición que el usuario sí ejerció.
// - Sin caché local: el servidor es la única fuente de verdad (se eliminó el
//   almacenamiento Keychain) para no duplicar estado ni mostrar valores viejos.
// - userId se conserva por el contrato del ViewModel; el backend identifica al
//   usuario por el Bearer token.
export class OptOutPreferencesRepositoryImpl
  implements OptOutPreferencesRepository
{
  constructor(private readonly service: OptOutPreferencesService) {}

  async load(_userId: number): Promise<OptOutPreferences> {
    const response = await this.service.getPreferences();
    return parseOptOutPreferences(response.preferences);
  }

  async save(_userId: number, preferences: OptOutPreferences): Promise<void> {
    await this.service.updatePreferences(parseOptOutPreferences(preferences));
  }
}
