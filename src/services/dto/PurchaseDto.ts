export type ParticipantGenderDto =
  | 'Masculino'
  | 'Femenino'
  | 'Otro'
  | 'Prefiere no indicar';

export type PurchaseStatusDto =
  | 'Borrador'
  | 'Pendiente de pago'
  | 'Pago reportado'
  | 'En validación'
  | 'Pago validado'
  | 'Inscripciones generadas'
  | 'Rechazada'
  | 'Cancelada'
  | 'Expirada';

export type ReceiptChannelDto =
  | 'Imagen'
  | 'URL'
  | 'WhatsApp'
  | 'Sin comprobante';

export interface CreateParticipantDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;

  fechaNacimiento: string | null;
  sexo: ParticipantGenderDto | null;

  telefono: string | null;
  correo: string | null;
}

export interface ExistingParticipantPurchaseDto {
  participanteId: number;
}

export interface NewParticipantPurchaseDto {
  participante: CreateParticipantDto;
}

export type PurchaseParticipantInputDto =
  | ExistingParticipantPurchaseDto
  | NewParticipantPurchaseDto;

export interface CreatePurchaseRequestDto {
  cursoId: number;
  cantidadCupos: number;

  participantes: PurchaseParticipantInputDto[];

  observacionesUsuario: string | null;
}

export interface ParticipantDto {
  idParticipante: number;
  usuarioId: number | null;

  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;

  fechaNacimiento: string | null;
  sexo: ParticipantGenderDto | null;

  telefono: string | null;
  correo: string | null;

  activo: boolean;
}

export interface PurchaseParticipantSummaryDto {
  idCompraParticipante: number;
  numeroCupo: number;
  estado: string;
  observaciones: string | null;

  participante: ParticipantDto;
}

export interface PurchaseSummaryDto {
  idCompra: number;
  folioCompra: string;

  usuarioId: number;
  cursoId: number;
  tituloCurso: string;

  cantidadCupos: number;

  precioUnitario: string;
  subtotal: string;
  descuento: string;
  total: string;

  estado: PurchaseStatusDto | string;

  fechaCompra: string;
  fechaLimitePago: string;
}

export interface CreatePurchaseResponseDto {
  compra: PurchaseSummaryDto;
  participantes: PurchaseParticipantSummaryDto[];
}

export interface PurchaseListItemDto extends PurchaseSummaryDto {
  observaciones: string | null;
  pagoVencido: boolean;
}

export interface PurchaseListResponseDto {
  compras: PurchaseListItemDto[];
  total: number;
}

export interface PaymentMethodDto {
  idMetodoPago: number;
  nombre: string;
  descripcion: string | null;

  requiereComprobante: boolean;
  instrucciones: string | null;
}

export interface PaymentMethodsResponseDto {
  metodos: PaymentMethodDto[];
}

export interface ReportPaymentRequestDto {
  idMetodoPago: number;

  monto: string;
  fechaPago: string;
  referencia: string | null;

  canalComprobante: ReceiptChannelDto;

  rutaComprobante: string | null;
  nombreArchivoOriginal: string | null;
  tipoArchivo: string | null;

  comprobanteConfirmado: boolean;
  fechaEnvioWhatsapp: string | null;

  observaciones: string | null;
}

export interface PaymentSummaryDto {
  idPago: number;
  idCompra: number;
  idMetodoPago: number;
  metodoPago: string;

  monto: string;
  fechaPago: string;
  fechaReporte: string;

  referencia: string | null;

  canalComprobante: ReceiptChannelDto;

  rutaComprobante: string | null;
  nombreArchivoOriginal: string | null;
  tipoArchivo: string | null;

  comprobanteConfirmado: boolean;
  fechaEnvioWhatsapp: string | null;

  estado: string;
  motivoRechazo: string | null;
  observaciones: string | null;
}

export interface ReportPaymentResponseDto {
  message: string;
  pago: PaymentSummaryDto;
  estadoCompra: string;
}