import { DEFAULT_OPT_OUT_PREFERENCES } from '../../src/models/OptOutPreferences';
import { OptOutPreferencesRepository } from '../../src/repositories/contracts/OptOutPreferencesRepository';
import { OptOutPreferencesRepositoryImpl } from '../../src/repositories/implementations/OptOutPreferencesRepositoryImpl';
import { useOptOutViewModel } from '../../src/viewmodels/account/useOptOutViewModel';
import { act, deferred, renderHook } from '../helpers/renderHook';

describe('A66 - Derecho de oposición (Opt-Out)', () => {
  let repository: jest.Mocked<OptOutPreferencesRepository>;

  beforeEach(() => {
    repository = {
      load: jest.fn().mockResolvedValue({ ...DEFAULT_OPT_OUT_PREFERENCES }),
      save: jest.fn().mockResolvedValue(undefined),
    };
  });

  test('carga las preferencias del usuario, por defecto sin oposición', async () => {
    const hook = await renderHook(() => useOptOutViewModel(repository, 7));
    expect(repository.load).toHaveBeenCalledWith(7);
    expect(hook.current.preferences).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
    expect(hook.current.isLoading).toBe(false);
    await hook.unmount();
  });

  test('activar un switch persiste solo esa preferencia', async () => {
    const hook = await renderHook(() => useOptOutViewModel(repository, 7));
    let ok = false;
    await act(async () => {
      ok = await hook.current.setOptOut('analytics', true);
    });
    expect(ok).toBe(true);
    expect(hook.current.preferences).toEqual({
      ...DEFAULT_OPT_OUT_PREFERENCES,
      analytics: true,
    });
    expect(repository.save).toHaveBeenCalledWith(7, {
      ...DEFAULT_OPT_OUT_PREFERENCES,
      analytics: true,
    });
    await hook.unmount();
  });

  test('revierte y muestra error si no se pudo guardar', async () => {
    repository.save.mockRejectedValue(new Error('fallo'));
    const hook = await renderHook(() => useOptOutViewModel(repository, 7));
    let ok = true;
    await act(async () => {
      ok = await hook.current.setOptOut('shareProgress', true);
    });
    expect(ok).toBe(false);
    expect(hook.current.preferences.shareProgress).toBe(false);
    expect(hook.current.error).toBe(
      'No fue posible guardar tu preferencia. Intenta de nuevo.',
    );
    await hook.unmount();
  });

  test('muestra error si falla la carga y conserva valores por defecto', async () => {
    repository.load.mockRejectedValue(new Error('fallo'));
    const hook = await renderHook(() => useOptOutViewModel(repository, 7));
    expect(hook.current.error).toBe(
      'No fue posible consultar tus preferencias de privacidad.',
    );
    expect(hook.current.preferences).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
    await hook.unmount();
  });

  test('ignora cambios simultáneos mientras se guarda', async () => {
    const pending = deferred<void>();
    repository.save.mockReturnValue(pending.promise);
    const hook = await renderHook(() => useOptOutViewModel(repository, 7));
    let first!: Promise<boolean>;
    let second = true;
    await act(async () => {
      first = hook.current.setOptOut('analytics', true);
      second = await hook.current.setOptOut('shareProgress', true);
    });
    expect(second).toBe(false);
    expect(repository.save).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve();
      await first;
    });
    expect(hook.current.isSaving).toBe(false);
    await hook.unmount();
  });

  test('sin usuario no carga ni guarda', async () => {
    const hook = await renderHook(() =>
      useOptOutViewModel(repository, undefined),
    );
    let ok = true;
    await act(async () => {
      ok = await hook.current.setOptOut('analytics', true);
    });
    expect(ok).toBe(false);
    expect(repository.load).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    await hook.unmount();
  });
});

describe('OptOutPreferencesRepositoryImpl', () => {
  function createStorage(initial?: string) {
    const data = new Map<string, string>();
    if (initial !== undefined) {
      data.set('optout_1', initial);
    }
    return {
      data,
      read: jest.fn(async (key: string) => data.get(key) ?? null),
      write: jest.fn(async (key: string, value: string) => {
        data.set(key, value);
      }),
    };
  }

  test('devuelve valores por defecto sin datos o con JSON corrupto', async () => {
    expect(
      await new OptOutPreferencesRepositoryImpl(createStorage()).load(1),
    ).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
    expect(
      await new OptOutPreferencesRepositoryImpl(
        createStorage('{no-json'),
      ).load(1),
    ).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
  });

  test('guarda y recupera por usuario, ignorando campos desconocidos', async () => {
    const storage = createStorage();
    const repo = new OptOutPreferencesRepositoryImpl(storage);
    await repo.save(1, { ...DEFAULT_OPT_OUT_PREFERENCES, analytics: true });
    expect((await repo.load(1)).analytics).toBe(true);
    expect((await repo.load(2)).analytics).toBe(false);
    storage.data.set(
      'optout_1',
      JSON.stringify({ analytics: 'yes', extra: true }),
    );
    expect(await repo.load(1)).toEqual(DEFAULT_OPT_OUT_PREFERENCES);
  });
});
