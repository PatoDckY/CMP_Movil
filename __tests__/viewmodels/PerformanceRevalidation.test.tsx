import { MyCoursesRepository } from '../../src/repositories/contracts/MyCoursesRepository';
import { PurchaseRepository } from '../../src/repositories/contracts/PurchaseRepository';
import { useMyCoursesViewModel } from '../../src/viewmodels/myCourses/useMyCoursesViewModel';
import { usePurchaseHistoryViewModel } from '../../src/viewmodels/purchases/usePurchaseHistoryViewModel';
import { purchase } from '../helpers/fixtures';
import { act, deferred, renderHook } from '../helpers/renderHook';

describe('#96 - revalidación en segundo plano sin parpadeo de spinner', () => {
  test('el historial conserva su contenido mientras se vuelve a consultar', async () => {
    const second = deferred<(typeof purchase)[]>();
    const getPurchases = jest
      .fn()
      .mockResolvedValueOnce([purchase])
      .mockReturnValueOnce(second.promise);
    const vm = await renderHook(() =>
      usePurchaseHistoryViewModel({ getPurchases } as unknown as PurchaseRepository),
    );
    await act(async () => {
      await vm.current.loadPurchases();
    });
    expect(vm.current.state).toBe('success');
    let reload!: Promise<void>;
    await act(async () => {
      reload = vm.current.loadPurchases();
    });
    expect(vm.current.isLoading).toBe(false);
    expect(vm.current.purchases).toHaveLength(1);
    await act(async () => {
      second.resolve([purchase, { ...purchase, id: 2 }]);
      await reload;
    });
    expect(vm.current.purchases).toHaveLength(2);
    await vm.unmount();
  });

  test('Mis cursos muestra spinner en la primera carga y conserva la lista al revalidar', async () => {
    const result = { courses: [{ enrollmentId: 1 }], summary: { total: 1 } };
    const first = deferred<typeof result>();
    const second = deferred<typeof result>();
    const getMyCourses = jest
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const vm = await renderHook(() =>
      useMyCoursesViewModel({ getMyCourses } as unknown as MyCoursesRepository),
    );
    let load!: Promise<void>;
    await act(async () => {
      load = vm.current.loadMyCourses();
    });
    expect(vm.current.isLoading).toBe(true);
    await act(async () => {
      first.resolve(result);
      await load;
    });
    expect(vm.current.state).toBe('success');
    await act(async () => {
      load = vm.current.loadMyCourses();
    });
    expect(vm.current.isLoading).toBe(false);
    expect(vm.current.courses).toHaveLength(1);
    await act(async () => {
      second.resolve(result);
      await load;
    });
    await vm.unmount();
  });
});
