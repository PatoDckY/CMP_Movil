import { usePurchaseDetailViewModel } from '../../src/viewmodels/purchases/usePurchaseDetailViewModel';
import { PurchaseRepository } from '../../src/repositories/contracts/PurchaseRepository';
import { PurchaseDetail, ReportPaymentInput } from '../../src/models/Purchase';
import { purchaseDetail, paymentInput } from '../helpers/fixtures';
import { act, renderHook, deferred } from '../helpers/renderHook';

type Scenario = {
  name: string;
  input?: Partial<ReportPaymentInput>;
  detail?: PurchaseDetail;
  purchaseId?: number;
};
const invalidScenarios: Scenario[] = [
  { name: 'compra inválida', purchaseId: 0 },
  { name: 'otra compra', purchaseId: 999 },
  {
    name: 'estado no reportable',
    detail: {
      ...purchaseDetail,
      purchase: { ...purchaseDetail.purchase, status: 'Cancelada' },
    },
  },
  {
    name: 'plazo vencido',
    detail: {
      ...purchaseDetail,
      purchase: { ...purchaseDetail.purchase, paymentDeadline: '2000-01-01' },
    },
  },
  {
    name: 'plazo incompatible',
    detail: {
      ...purchaseDetail,
      purchase: { ...purchaseDetail.purchase, paymentDeadline: 'inválido' },
    },
  },
  {
    name: 'importe completo',
    detail: {
      ...purchaseDetail,
      paymentSummary: {
        ...purchaseDetail.paymentSummary,
        fullPaymentReported: true,
      },
    },
  },
  { name: 'método inexistente', input: { paymentMethodId: 999 } },
  {
    name: 'saldo cero',
    detail: {
      ...purchaseDetail,
      paymentSummary: {
        ...purchaseDetail.paymentSummary,
        pendingBalance: '0.00',
      },
    },
  },
  {
    name: 'saldo incompatible',
    detail: {
      ...purchaseDetail,
      paymentSummary: {
        ...purchaseDetail.paymentSummary,
        pendingBalance: 'no-numérico',
      },
    },
  },
  { name: 'fecha incompatible', input: { paymentDate: 'inválida' } },
  { name: 'fecha futura', input: { paymentDate: '2999-01-01T00:00:00Z' } },
  { name: 'referencia extensa', input: { reference: 'r'.repeat(101) } },
  { name: 'observaciones extensas', input: { observations: 'o'.repeat(1001) } },
  { name: 'comprobante exigido', input: { receiptChannel: 'Sin comprobante' } },
  {
    name: 'imagen incompleta',
    input: {
      receiptChannel: 'Imagen',
      receiptPath: 'https://example.com/receipt.png',
    },
  },
  {
    name: 'imagen insegura',
    input: {
      receiptChannel: 'Imagen',
      receiptPath: 'http://example.com/receipt.png',
      originalFileName: 'receipt.png',
      fileType: 'image/png',
    },
  },
  {
    name: 'tipo de archivo inválido',
    input: {
      receiptChannel: 'Imagen',
      receiptPath: 'https://example.com/receipt.svg',
      originalFileName: 'receipt.svg',
      fileType: 'image/svg+xml',
    },
  },
  {
    name: 'nombre de archivo extenso',
    input: {
      receiptChannel: 'Imagen',
      receiptPath: 'https://example.com/receipt.png',
      originalFileName: 'x'.repeat(256),
      fileType: 'image/png',
    },
  },
  {
    name: 'URL insegura',
    input: { receiptChannel: 'URL', receiptPath: 'http://example.com/receipt' },
  },
  { name: 'URL sin destino', input: { receiptChannel: 'URL' } },
  {
    name: 'URL con metadatos',
    input: {
      receiptChannel: 'URL',
      receiptPath: 'https://example.com/receipt',
      originalFileName: 'receipt.png',
    },
  },
  {
    name: 'WhatsApp con archivo',
    input: {
      receiptChannel: 'WhatsApp',
      receiptPath: 'https://example.com/receipt',
    },
  },
  {
    name: 'canal inexistente',
    input: {
      receiptChannel: 'Canal inventado' as ReportPaymentInput['receiptChannel'],
    },
  },
];

describe('A58/A63 - caja blanca de validaciones y respuestas tardías de pagos', () => {
  test.each(invalidScenarios)(
    '$name: no envía un reporte inválido ni muestra éxito',
    async scenario => {
      const repo = {
        getPurchaseDetail: jest.fn(
          async () => scenario.detail ?? purchaseDetail,
        ),
        reportPayment: jest.fn(),
      } as unknown as PurchaseRepository;
      const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
      await act(async () => {
        await vm.current.loadPurchaseDetail(1);
      });
      await act(async () => {
        expect(
          await vm.current.reportPayment(scenario.purchaseId ?? 1, {
            ...paymentInput,
            ...scenario.input,
          }),
        ).toBe(false);
      });
      expect(repo.reportPayment).not.toHaveBeenCalled();
      expect(vm.current.reportState).toBe('error');
      expect(vm.current.reportError).not.toBeNull();
      await vm.unmount();
    },
  );
  test('no reporta sin consultar antes el detalle', async () => {
    const repo = { reportPayment: jest.fn() } as unknown as PurchaseRepository;
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => {
      expect(await vm.current.reportPayment(1, paymentInput)).toBe(false);
    });
    expect(repo.reportPayment).not.toHaveBeenCalled();
    await vm.unmount();
  });
  test.each(['URL', 'Imagen', 'Sin comprobante'] as const)(
    'acepta %s solo con sus metadatos correctos',
    async receiptChannel => {
      const detail = {
        ...purchaseDetail,
        paymentMethods: purchaseDetail.paymentMethods.map(method => ({
          ...method,
          requiresReceipt: receiptChannel !== 'Sin comprobante',
        })),
      };
      const reportPayment = jest.fn(async () => ({ id: 1 }));
      const repo = {
        getPurchaseDetail: jest.fn(async () => detail),
        reportPayment,
      } as unknown as PurchaseRepository;
      const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
      await act(async () => {
        await vm.current.loadPurchaseDetail(1);
      });
      const input = {
        ...paymentInput,
        receiptChannel,
        receiptPath:
          receiptChannel === 'Sin comprobante'
            ? null
            : 'https://example.com/receipt.png',
        originalFileName: receiptChannel === 'Imagen' ? 'receipt.png' : null,
        fileType: receiptChannel === 'Imagen' ? 'image/png' : null,
      };
      await act(async () => {
        expect(await vm.current.reportPayment(1, input)).toBe(true);
      });
      expect(reportPayment).toHaveBeenCalledTimes(1);
      expect(vm.current.reportState).toBe('success');
      await vm.unmount();
    },
  );
  test('una opción sin comprobante no admite metadatos ocultos', async () => {
    const detail = {
      ...purchaseDetail,
      paymentMethods: purchaseDetail.paymentMethods.map(method => ({
        ...method,
        requiresReceipt: false,
      })),
    };
    const repo = {
      getPurchaseDetail: jest.fn(async () => detail),
      reportPayment: jest.fn(),
    } as unknown as PurchaseRepository;
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => {
      await vm.current.loadPurchaseDetail(1);
    });
    await act(async () => {
      expect(
        await vm.current.reportPayment(1, {
          ...paymentInput,
          receiptChannel: 'Sin comprobante',
          fileType: 'image/png',
        }),
      ).toBe(false);
    });
    expect(repo.reportPayment).not.toHaveBeenCalled();
    await vm.unmount();
  });
  test('un fallo tardío de reporte anterior no modifica el detalle de otra compra', async () => {
    const pending = deferred<never>();
    const repo = {
      getPurchaseDetail: jest
        .fn()
        .mockResolvedValueOnce(purchaseDetail)
        .mockResolvedValueOnce({
          ...purchaseDetail,
          purchase: { ...purchaseDetail.purchase, id: 2 },
        }),
      reportPayment: jest.fn(() => pending.promise),
    } as unknown as PurchaseRepository;
    const vm = await renderHook(() => usePurchaseDetailViewModel(repo));
    await act(async () => {
      await vm.current.loadPurchaseDetail(1);
    });
    let reporting!: Promise<boolean>;
    await act(async () => {
      reporting = vm.current.reportPayment(1, paymentInput);
    });
    await act(async () => {
      await vm.current.loadPurchaseDetail(2);
    });
    await act(async () => {
      pending.reject(new Error('Fallo anterior'));
      await reporting;
    });
    expect(vm.current.detail?.purchase.id).toBe(2);
    expect(vm.current.reportError).toBeNull();
    expect(vm.current.reportState).toBe('idle');
    await vm.unmount();
  });
});
