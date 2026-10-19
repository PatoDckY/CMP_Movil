import { usePurchaseViewModel } from '../../src/viewmodels/purchases/usePurchaseViewModel';
import { usePurchaseDetailViewModel } from '../../src/viewmodels/purchases/usePurchaseDetailViewModel';
import { PurchaseRepository } from '../../src/repositories/contracts/PurchaseRepository';
import { Purchase } from '../../src/models/Purchase';
import {
  purchase,
  purchaseInput,
  purchaseDetail,
  paymentInput,
} from '../helpers/fixtures';
import { act, renderHook, deferred } from '../helpers/renderHook';
function repository(): jest.Mocked<PurchaseRepository> {
  return {
    getPurchases: jest.fn(),
    getPurchaseDetail: jest.fn(),
    createPurchase: jest.fn(),
    getPaymentMethods: jest.fn(),
    reportPayment: jest.fn(),
  };
}
describe('Reserva y reportes de pago', () => {
  test.each([
    { ...purchaseInput, courseId: 0 },
    { ...purchaseInput, quantity: 21 },
    { ...purchaseInput, participants: [] },
    {
      ...purchaseInput,
      quantity: 2,
      participants: [{ participantId: 5 }, { participantId: 5 }],
    },
  ])('rechaza entradas inválidas antes de reservar', async input => {
    const repo = repository();
    const vm = await renderHook(() => usePurchaseViewModel(repo));
    await act(async () => {
      expect(await vm.current.createPurchase(input)).toBeNull();
    });
    expect(repo.createPurchase).not.toHaveBeenCalled();
    await vm.unmount();
  });
  test('reserva pendiente: previene duplicados durante y después del envío', async () => {
    const pending = deferred<Purchase>();
    const repo = repository();
    repo.createPurchase.mockReturnValue(pending.promise);
    const vm = await renderHook(() => usePurchaseViewModel(repo));
    let first!: Promise<Purchase | null>;
    await act(async () => {
      first = vm.current.createPurchase(purchaseInput);
      await vm.current.createPurchase(purchaseInput);
    });
    await act(async () => {
      pending.resolve(purchase);
      await first;
      await vm.current.createPurchase(purchaseInput);
    });
    expect(repo.createPurchase).toHaveBeenCalledTimes(1);
    expect(vm.current.purchase?.status).toBe('Pendiente de pago');
    await vm.unmount();
  });
  test.each(['0', '100.01', '1.001', '-1'])(
    'rechaza monto %s fuera de contrato',
    async amount => {
      const repo = repository();
      repo.getPurchaseDetail.mockResolvedValue(purchaseDetail);
      const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
      await act(async () => {
        await vm.current.loadPurchaseDetail(1);
      });
      await act(async () => {
        expect(
          await vm.current.reportPayment(1, { ...paymentInput, amount }),
        ).toBe(false);
      });
      expect(repo.reportPayment).not.toHaveBeenCalled();
      await vm.unmount();
    },
  );
  test('no reporta comprobante sin confirmar envío por WhatsApp', async () => {
    const repo = repository();
    repo.getPurchaseDetail.mockResolvedValue(purchaseDetail);
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => {
      await vm.current.loadPurchaseDetail(1);
    });
    await act(async () => {
      await vm.current.reportPayment(1, {
        ...paymentInput,
        receiptConfirmed: false,
      });
    });
    expect(repo.reportPayment).not.toHaveBeenCalled();
    expect(vm.current.reportError).toContain('confirmar');
    await vm.unmount();
  });
  test('reporte aceptado no implica pago validado ni se repite si falla actualizar detalle', async () => {
    const repo = repository();
    repo.getPurchaseDetail
      .mockResolvedValueOnce(purchaseDetail)
      .mockRejectedValueOnce(new Error('Sin conexión'));
    repo.reportPayment.mockResolvedValue({
      ...paymentInput,
      id: 8,
      purchaseId: 1,
      paymentMethodName: 'Transferencia',
      reportDate: '2026-10-17',
      status: 'Reportado',
      rejectionReason: null,
    });
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => {
      await vm.current.loadPurchaseDetail(1);
    });
    await act(async () => {
      expect(await vm.current.reportPayment(1, paymentInput)).toBe(true);
    });
    expect(vm.current.refreshWarning).not.toBeNull();
    expect(vm.current.lastReportedPayment?.status).toBe('Reportado');
    await act(async () => {
      expect(await vm.current.reportPayment(1, paymentInput)).toBe(false);
    });
    await act(async () => {
      expect(await vm.current.reportPayment(1, paymentInput)).toBe(false);
    });
    await act(async () => { vm.current.clearReportFeedback(); });
    await act(async () => {
      expect(await vm.current.reportPayment(1, paymentInput)).toBe(false);
    });
    expect(repo.reportPayment).toHaveBeenCalledTimes(1);
    await vm.unmount();
  });
  test('una consulta manual exitosa habilita un siguiente reporte legítimo', async () => {
    const repo = repository();
    repo.getPurchaseDetail.mockResolvedValue(purchaseDetail);
    repo.reportPayment.mockResolvedValue({...paymentInput, id: 8, purchaseId: 1,
      paymentMethodName: 'Transferencia', reportDate: '2026-10-17', status: 'Reportado', rejectionReason: null});
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => { await vm.current.loadPurchaseDetail(1); });
    await act(async () => { expect(await vm.current.reportPayment(1, paymentInput)).toBe(true); });
    repo.getPurchaseDetail.mockResolvedValue({...purchaseDetail, paymentSummary: {...purchaseDetail.paymentSummary, totalReported: '25.00', pendingBalance: '75.00'}});
    await act(async () => { await vm.current.loadPurchaseDetail(1); });
    await act(async () => { expect(await vm.current.reportPayment(1, paymentInput)).toBe(true); });
    expect(repo.reportPayment).toHaveBeenCalledTimes(2);
    await vm.unmount();
  });
});
