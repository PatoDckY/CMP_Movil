export type PurchaseStatus =
  | 'Borrador'
  | 'Pendiente de pago'
  | 'Pago reportado'
  | 'En validación'
  | 'Pago validado'
  | 'Inscripciones generadas'
  | 'Rechazada'
  | 'Cancelada'
  | 'Expirada';

export type ParticipantGender =
  | 'Masculino'
  | 'Femenino'
  | 'Otro'
  | 'Prefiere no indicar';

export type ReceiptChannel =
  | 'Imagen'
  | 'URL'
  | 'WhatsApp'
  | 'Sin comprobante';

export interface NewPurchaseParticipant {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string | null;

  birthDate: string | null;
  gender: ParticipantGender | null;

  phone: string | null;
  email: string | null;
}

export type PurchaseParticipantInput =
  | {
      participantId: number;
    }
  | {
      participant: NewPurchaseParticipant;
    };

export interface CreatePurchaseInput {
  courseId: number;
  quantity: number;

  participants: PurchaseParticipantInput[];

  userNotes: string | null;
}

export interface Purchase {
  id: number;
  folio: string;

  userId: number;
  courseId: number;
  courseTitle: string;

  quantity: number;

  unitPrice: string;
  subtotal: string;
  discount: string;
  total: string;

  status: PurchaseStatus | string;

  purchaseDate: string;
  paymentDeadline: string;
}

export interface PurchaseParticipant {
  purchaseParticipantId: number;
  slotNumber: number;

  status: string;
  observations: string | null;

  participant: {
    id: number;
    userId: number | null;

    firstName: string;
    paternalLastName: string;
    maternalLastName: string | null;

    birthDate: string | null;
    gender: ParticipantGender | null;

    phone: string | null;
    email: string | null;

    active: boolean;
  };
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string | null;

  requiresReceipt: boolean;
  instructions: string | null;
}

export interface ReportPaymentInput {
  paymentMethodId: number;

  amount: string;
  paymentDate: string;
  reference: string | null;

  receiptChannel: ReceiptChannel;

  receiptPath: string | null;
  originalFileName: string | null;
  fileType: string | null;

  receiptConfirmed: boolean;
  whatsappSentAt: string | null;

  observations: string | null;
}

export interface CoursePayment {
  id: number;
  purchaseId: number;

  paymentMethodId: number;
  paymentMethodName: string;

  amount: string;

  paymentDate: string;
  reportDate: string;

  reference: string | null;

  receiptChannel: ReceiptChannel;

  receiptPath: string | null;
  originalFileName: string | null;
  fileType: string | null;

  receiptConfirmed: boolean;
  whatsappSentAt: string | null;

  status: string;

  rejectionReason: string | null;
  observations: string | null;
}

export interface PaymentSummary {
  totalPurchase: string;
  totalReported: string;
  pendingBalance: string;

  fullPaymentReported: boolean;
}

export interface PurchaseDetail {
  purchase: Purchase & {
    observations: string | null;
  };

  participants: PurchaseParticipant[];

  paymentMethods: PaymentMethod[];

  payments: CoursePayment[];

  paymentSummary: PaymentSummary;
}