
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
import {validatePurchase} from '../../models/purchaseValidation';
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
    if (!Number.isSafeInteger(purchaseId) || purchaseId <= 0) {
      throw new Error('El identificador de la compra no es válido.');
    }
    const response =
      await this.purchaseService.getPurchaseDetail(
        purchaseId,
      );

    if (response?.compra?.idCompra !== purchaseId) {
      throw new Error('El servidor no confirmó el detalle de esta compra.');
    }
    return mapPurchaseDetailDtoToModel(
      response,
    );
  }

  async createPurchase(
    data: CreatePurchaseInput,
  ): Promise<Purchase> {
    const issue = validatePurchase(data);
    if (issue) { throw new Error(issue.message); }
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

    if (response?.pago?.idCompra !== purchaseId) {
      throw new Error('No fue posible verificar el reporte de esta compra. Consulta el historial antes de reintentar.');
    }
    return mapPaymentDtoToModel(
      response.pago,
    );
  }
}
