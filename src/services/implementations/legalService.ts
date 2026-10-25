import {LegalService} from '../contracts/LegalService';
import {
  LegalDocumentDto,
  LegalDocumentType,
} from '../dto/LegalDocumentDto';
import {apiRequest} from '../http/httpClient';

/**
 * Servicio de documentos legales.
 *
 * Consume el endpoint público de CMP_Site:
 *
 * GET /api/legal/{tipo}
 */
export const legalService: LegalService = {
  obtener(tipo: LegalDocumentType): Promise<LegalDocumentDto> {
    return apiRequest<LegalDocumentDto>(
      `/legal/${tipo}`,
      {method: 'GET'},
      {timeoutMs: 15_000},
    );
  },
};
