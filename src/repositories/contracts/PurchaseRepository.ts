import {
  CoursePayment,
  CreatePurchaseInput,
  PaymentMethod,
  Purchase,
  PurchaseDetail,
  ReportPaymentInput,
} from '../../models/Purchase';

export interface PurchaseRepository {
  getPurchases(): Promise<Purchase[]>;

  getPurchaseDetail(
    purchaseId: number,
  ): Promise<PurchaseDetail>;

  createPurchase(
    data: CreatePurchaseInput,
  ): Promise<Purchase>;

  getPaymentMethods(): Promise<PaymentMethod[]>;

  reportPayment(
    purchaseId: number,
    data: ReportPaymentInput,
  ): Promise<CoursePayment>;
}