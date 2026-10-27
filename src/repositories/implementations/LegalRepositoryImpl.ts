import {LegalDocument, LegalDocumentType} from '../../models/LegalDocument';
import {LegalService} from '../../services/contracts/LegalService';
import {LegalRepository} from '../contracts/LegalRepository';

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Repositorio de documentos legales.
 *
 * Valida la forma de la respuesta; los errores HTTP se propagan al ViewModel.
 */
export class LegalRepositoryImpl implements LegalRepository {
  constructor(private readonly service: LegalService) {}

  async obtener(tipo: LegalDocumentType): Promise<LegalDocument> {
    const response = await this.service.obtener(tipo);

    if (
      !response ||
      response.tipo !== tipo ||
      !isText(response.version) ||
      !isText(response.resumen) ||
      !isText(response.contenido) ||
      !isText(response.vigenteDesde)
    ) {
      throw new Error('El servidor no devolvió un documento legal válido.');
    }

    return {
      tipo: response.tipo,
      version: response.version,
      resumen: response.resumen,
      contenido: response.contenido,
      vigenteDesde: response.vigenteDesde,
    };
  }
}
