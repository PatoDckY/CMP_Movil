import {
  CoursePayment,
  CreatePurchaseInput,
  PaymentMethod,
  Purchase,
  PurchaseDetail,
  PurchaseParticipant,
  ReportPaymentInput,
} from '../models/Purchase';

import {
  CreatePurchaseRequestDto,
  PaymentMethodDto,
  PaymentSummaryDto,
  PurchaseDetailResponseDto,
  PurchaseParticipantSummaryDto,
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

    receiptChannel: dto.canalComprobante,

    receiptPath: dto.rutaComprobante,
    originalFileName: dto.nombreArchivoOriginal,
    fileType: dto.tipoArchivo,

    receiptConfirmed: dto.comprobanteConfirmado,
    whatsappSentAt: dto.fechaEnvioWhatsapp,

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

function mapPurchaseParticipantDtoToModel(
  dto: PurchaseParticipantSummaryDto,
): PurchaseParticipant {
  return {
    purchaseParticipantId:
      dto.idCompraParticipante,

    slotNumber: dto.numeroCupo,

    status: dto.estado,

    observations: dto.observaciones,

    participant: {
      id: dto.participante.idParticipante,

      userId: dto.participante.usuarioId,

      firstName: dto.participante.nombre,

      paternalLastName:
        dto.participante.apellidoPaterno,

      maternalLastName:
        dto.participante.apellidoMaterno,

      birthDate:
        dto.participante.fechaNacimiento,

      gender: dto.participante.sexo,

      phone: dto.participante.telefono,

      email: dto.participante.correo,

      active: dto.participante.activo,
    },
  };
}

export function mapPurchaseDetailDtoToModel(
  dto: PurchaseDetailResponseDto,
): PurchaseDetail {
  return {
    purchase: {
      ...mapPurchaseDtoToModel(dto.compra),

      observations:
        dto.compra.observaciones,
    },

    participants:
      dto.participantes.map(
        mapPurchaseParticipantDtoToModel,
      ),

    paymentMethods:
      dto.metodosPago.map(
        mapPaymentMethodDtoToModel,
      ),

    payments:
      dto.pagos.map(
        mapPaymentDtoToModel,
      ),

    paymentSummary: {
      totalPurchase:
        dto.resumenPago.totalCompra,

      totalReported:
        dto.resumenPago.totalReportado,

      pendingBalance:
        dto.resumenPago.saldoPendiente,

      fullPaymentReported:
        dto.resumenPago.pagoCompletoReportado,
    },
  };
}