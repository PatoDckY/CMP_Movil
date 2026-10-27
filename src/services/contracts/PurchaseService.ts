import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
  PaymentMethodsResponseDto,
  PurchaseDetailResponseDto,
  PurchaseListResponseDto,
  ReportPaymentRequestDto,
  ReportPaymentResponseDto,
} from '../dto/PurchaseDto';

export interface PurchaseService {
  getPurchases(): Promise<PurchaseListResponseDto>;

  getPurchaseDetail(
    purchaseId: number,
  ): Promise<PurchaseDetailResponseDto>;

  createPurchase(
    data: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseResponseDto>;

  getPaymentMethods(): Promise<PaymentMethodsResponseDto>;

  reportPayment(
    purchaseId: number,
    data: ReportPaymentRequestDto,
  ): Promise<ReportPaymentResponseDto>;
}