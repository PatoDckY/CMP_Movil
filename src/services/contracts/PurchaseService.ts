import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
  PaymentMethodsResponseDto,
  PurchaseListResponseDto,
  ReportPaymentRequestDto,
  ReportPaymentResponseDto,
} from '../dto/PurchaseDto';

export interface PurchaseService {
  getPurchases(): Promise<PurchaseListResponseDto>;

  createPurchase(
    data: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseResponseDto>;

  getPaymentMethods(): Promise<PaymentMethodsResponseDto>;

  reportPayment(
    purchaseId: number,
    data: ReportPaymentRequestDto,
  ): Promise<ReportPaymentResponseDto>;
}