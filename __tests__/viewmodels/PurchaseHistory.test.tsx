import { usePurchaseHistoryViewModel } from '../../src/viewmodels/purchases/usePurchaseHistoryViewModel';
import { PurchaseRepository } from '../../src/repositories/contracts/PurchaseRepository';
import { purchase } from '../helpers/fixtures';
import { act, renderHook, deferred } from '../helpers/renderHook';

describe('A39/A61/A64 - historial de compras y consultas concurrentes', () => {
  test('carga única, resumen real, vacío y recuperación tras errores', async () => {
    const pending = deferred<(typeof purchase)[]>();
    const getPurchases = jest
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(new Error('Sin red'))
      .mockRejectedValueOnce(null)
      .mockResolvedValueOnce([purchase]);
    const vm = await renderHook(() =>
      usePurchaseHistoryViewModel({
        getPurchases,
      } as unknown as PurchaseRepository),
    );
    let loading!: Promise<void>;
    await act(async () => {
      loading = vm.current.loadPurchases();
      await vm.current.loadPurchases();
    });
    expect(getPurchases).toHaveBeenCalledTimes(1);
    expect(vm.current.isLoading).toBe(true);
    await act(async () => {
      pending.resolve([
        purchase,
        { ...purchase, id: 2, quantity: 2, total: 'incompatible' },
      ]);
      await loading;
    });
    expect(vm.current.summary).toEqual({
      totalPurchases: 2,
      totalPlaces: 3,
      totalAmount: 100,
    });
    await act(async () => {
      await vm.current.loadPurchases();
    });
    expect(vm.current.isEmpty).toBe(true);
    await act(async () => {
      await vm.current.loadPurchases();
    });
    expect(vm.current.error).toBe('Sin red');
    expect(vm.current.purchases).toEqual([]);
    await act(async () => {
      await vm.current.loadPurchases();
    });
    expect(vm.current.error).toContain('historial');
    await act(async () => {
      await vm.current.loadPurchases();
    });
    expect(vm.current.state).toBe('success');
    await vm.unmount();
  });
  test.each(['resolve', 'reject'])(
    'una respuesta %s después de desmontar no publica datos',
    async outcome => {
      const pending = deferred<(typeof purchase)[]>();
      const repository = {
        getPurchases: jest.fn(() => pending.promise),
      } as unknown as PurchaseRepository;
      const vm = await renderHook(() =>
        usePurchaseHistoryViewModel(repository),
      );
      let loading!: Promise<void>;
      await act(async () => {
        loading = vm.current.loadPurchases();
      });
      await vm.unmount();
      await act(async () => {
        if (outcome === 'resolve') {
          pending.resolve([purchase]);
        } else {
          pending.reject(new Error('tarde'));
        }
        await loading;
      });
      expect(vm.current.purchases).toEqual([]);
    },
  );
});
