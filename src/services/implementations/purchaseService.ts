
import {PurchaseService} from '../contracts/PurchaseService';
import {
  CreatePurchaseRequestDto,
  CreatePurchaseResponseDto,
  PaymentMethodsResponseDto,
  PurchaseDetailResponseDto,
  PurchaseListResponseDto,
  ReportPaymentRequestDto,
  ReportPaymentResponseDto,
} from '../dto/PurchaseDto';
import {apiRequest} from '../http/httpClient';

export const purchaseService: PurchaseService = {
  getPurchases(): Promise<PurchaseListResponseDto> {
    return apiRequest<PurchaseListResponseDto>(
      '/compras-cursos',
      {},
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  getPurchaseDetail(
    purchaseId: number,
  ): Promise<PurchaseDetailResponseDto> {
    return apiRequest<PurchaseDetailResponseDto>(
      `/compras-cursos/${purchaseId}`,
      {},
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  createPurchase(
    data: CreatePurchaseRequestDto,
  ): Promise<CreatePurchaseResponseDto> {
    return apiRequest<CreatePurchaseResponseDto>(
      '/compras-cursos',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  getPaymentMethods(): Promise<PaymentMethodsResponseDto> {
    return apiRequest<PaymentMethodsResponseDto>(
      '/metodos-pago-cursos',
      {},
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },

  reportPayment(
    purchaseId: number,
    data: ReportPaymentRequestDto,
  ): Promise<ReportPaymentResponseDto> {
    return apiRequest<ReportPaymentResponseDto>(
      `/compras-cursos/${purchaseId}/pagos`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      {requireAuthentication: true, timeoutMs: 15_000},
    );
  },
};
