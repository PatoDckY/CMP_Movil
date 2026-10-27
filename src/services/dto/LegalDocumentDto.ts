export type LegalDocumentType =
  | 'aviso_privacidad'
  | 'terminos_condiciones';

export interface LegalDocumentDto {
  tipo: LegalDocumentType;
  version: string;
  resumen: string;
  contenido: string;
  vigenteDesde: string;
}
