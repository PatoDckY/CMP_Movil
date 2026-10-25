import {
  LegalDocument,
  LegalDocumentType,
} from '../../models/LegalDocument';

export interface LegalRepository {
  // Siempre desde el backend: el texto legal no se guarda en el cliente.
  obtener(tipo: LegalDocumentType): Promise<LegalDocument>;
}
