import {
  CoursePayment,
  CreatePurchaseInput,
  PaymentMethod,
  Purchase,
  ReportPaymentInput,
} from '../../models/Purchase';

export interface PurchaseRepository {
  getPurchases(): Promise<Purchase[]>;

  createPurchase(
    data: CreatePurchaseInput,
  ): Promise<Purchase>;

  getPaymentMethods(): Promise<PaymentMethod[]>;

  reportPayment(
    purchaseId: number,
    data: ReportPaymentInput,
  ): Promise<CoursePayment>;
}