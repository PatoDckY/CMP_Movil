import {
  CoursePayment,
  CreatePurchaseInput,
  PaymentMethod,
  Purchase,
  ReportPaymentInput,
} from '../models/Purchase';

import {
  CreatePurchaseRequestDto,
  PaymentMethodDto,
  PaymentSummaryDto,
  PurchaseSummaryDto,
  ReportPaymentRequestDto,
} from '../services/dto/PurchaseDto';

export function mapPurchaseDtoToModel(
  dto: PurchaseSummaryDto,
): Purchase {
  return {
    id: dto.idCompra,
    folio: dto.folioCompra,

    userId: dto.usuarioId,
    courseId: dto.cursoId,
    courseTitle: dto.tituloCurso,

    quantity: dto.cantidadCupos,

    unitPrice: dto.precioUnitario,
    subtotal: dto.subtotal,
    discount: dto.descuento,
    total: dto.total,

    status: dto.estado,

    purchaseDate: dto.fechaCompra,
    paymentDeadline: dto.fechaLimitePago,
  };
}

export function mapPaymentMethodDtoToModel(
  dto: PaymentMethodDto,
): PaymentMethod {
  return {
    id: dto.idMetodoPago,
    name: dto.nombre,
    description: dto.descripcion,

    requiresReceipt: dto.requiereComprobante,
    instructions: dto.instrucciones,
  };
}

export function mapPaymentDtoToModel(
  dto: PaymentSummaryDto,
): CoursePayment {
  return {
    id: dto.idPago,
    purchaseId: dto.idCompra,

    paymentMethodId: dto.idMetodoPago,
    paymentMethodName: dto.metodoPago,

    amount: dto.monto,
    paymentDate: dto.fechaPago,
    reportDate: dto.fechaReporte,

    reference: dto.referencia,

    status: dto.estado,

    rejectionReason: dto.motivoRechazo,
    observations: dto.observaciones,
  };
}

export function mapCreatePurchaseInputToDto(
  input: CreatePurchaseInput,
): CreatePurchaseRequestDto {
  return {
    cursoId: input.courseId,
    cantidadCupos: input.quantity,

    participantes: input.participants.map(participant => {
      if ('participantId' in participant) {
        return {
          participanteId: participant.participantId,
        };
      }

      return {
        participante: {
          nombre: participant.participant.firstName,
          apellidoPaterno:
            participant.participant.paternalLastName,
          apellidoMaterno:
            participant.participant.maternalLastName,

          fechaNacimiento:
            participant.participant.birthDate,

          sexo: participant.participant.gender,

          telefono: participant.participant.phone,
          correo: participant.participant.email,
        },
      };
    }),

    observacionesUsuario: input.userNotes,
  };
}

export function mapReportPaymentInputToDto(
  input: ReportPaymentInput,
): ReportPaymentRequestDto {
  return {
    idMetodoPago: input.paymentMethodId,

    monto: input.amount,
    fechaPago: input.paymentDate,
    referencia: input.reference,

    canalComprobante: input.receiptChannel,

    rutaComprobante: input.receiptPath,
    nombreArchivoOriginal: input.originalFileName,
    tipoArchivo: input.fileType,

    comprobanteConfirmado: input.receiptConfirmed,
    fechaEnvioWhatsapp: input.whatsappSentAt,

    observaciones: input.observations,
  };
}