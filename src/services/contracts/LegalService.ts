import {
  LegalDocumentDto,
  LegalDocumentType,
} from '../dto/LegalDocumentDto';

/**
 * Contrato del servicio de documentos legales.
 *
 * GET público (sin Bearer): el texto vigente vive en CMP_Site.
 */
export interface LegalService {
  obtener(tipo: LegalDocumentType): Promise<LegalDocumentDto>;
}
