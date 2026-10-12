
import {
  CoursePayment,
  CreatePurchaseInput,
  PaymentMethod,
  Purchase,
  PurchaseDetail,
  ReportPaymentInput,
} from '../../models/Purchase';

import {
  mapCreatePurchaseInputToDto,
  mapPaymentDtoToModel,
  mapPaymentMethodDtoToModel,
  mapPurchaseDetailDtoToModel,
  mapPurchaseDtoToModel,
  mapReportPaymentInputToDto,
} from '../../mappers/purchaseMapper';

import {PurchaseService} from '../../services/contracts/PurchaseService';
import {PurchaseRepository} from '../contracts/PurchaseRepository';

export class PurchaseRepositoryImpl
  implements PurchaseRepository
{
  constructor(
    private readonly purchaseService: PurchaseService,
  ) {}

  async getPurchases(): Promise<Purchase[]> {
    const response =
      await this.purchaseService.getPurchases();

    return response.compras.map(
      mapPurchaseDtoToModel,
    );
  }

  async getPurchaseDetail(
    purchaseId: number,
  ): Promise<PurchaseDetail> {
    const response =
      await this.purchaseService.getPurchaseDetail(
        purchaseId,
      );

    return mapPurchaseDetailDtoToModel(
      response,
    );
  }

  async createPurchase(
    data: CreatePurchaseInput,
  ): Promise<Purchase> {
    const requestDto =
      mapCreatePurchaseInputToDto(data);

    const response =
      await this.purchaseService.createPurchase(
        requestDto,
      );

    return mapPurchaseDtoToModel(
      response.compra,
    );
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response =
      await this.purchaseService.getPaymentMethods();

    return response.metodos.map(
      mapPaymentMethodDtoToModel,
    );
  }

  async reportPayment(
    purchaseId: number,
    data: ReportPaymentInput,
  ): Promise<CoursePayment> {
    const requestDto =
      mapReportPaymentInputToDto(data);

    const response =
      await this.purchaseService.reportPayment(
        purchaseId,
        requestDto,
      );

    return mapPaymentDtoToModel(
      response.pago,
    );
  }
}
