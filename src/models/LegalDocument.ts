import {LegalDocumentType} from '../services/dto/LegalDocumentDto';

export type {LegalDocumentType};

export interface LegalDocument {
  tipo: LegalDocumentType;
  version: string;
  resumen: string;
  contenido: string;
  vigenteDesde: string;
}
