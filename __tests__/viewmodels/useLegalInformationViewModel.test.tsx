import { LegalDocument } from '../../src/models/LegalDocument';
import { LegalRepository } from '../../src/repositories/contracts/LegalRepository';
import { useLegalInformationViewModel } from '../../src/viewmodels/legal/useLegalInformationViewModel';
import {
  FALLBACK_LEGAL_SUMMARY,
  useLegalSummaryViewModel,
} from '../../src/viewmodels/legal/useLegalSummaryViewModel';
import { act, renderHook } from '../helpers/renderHook';

const doc = (tipo: LegalDocument['tipo']): LegalDocument => ({
  tipo,
  version: '1.0',
  resumen: `Resumen ${tipo}`,
  contenido: `# ${tipo}`,
  vigenteDesde: '2026-10-24T21:01:12.147Z',
});

describe('Documentos legales - ViewModels', () => {
  let repository: jest.Mocked<LegalRepository>;

  beforeEach(() => {
    repository = { obtener: jest.fn(async tipo => doc(tipo)) };
  });

  test('carga ambos documentos al montar', async () => {
    const hook = await renderHook(() => useLegalInformationViewModel(repository));
    expect(repository.obtener).toHaveBeenCalledWith('aviso_privacidad');
    expect(repository.obtener).toHaveBeenCalledWith('terminos_condiciones');
    expect(hook.current.state).toBe('success');
    expect(hook.current.privacyNotice?.tipo).toBe('aviso_privacidad');
    expect(hook.current.terms?.tipo).toBe('terminos_condiciones');
    await hook.unmount();
  });

  test('expone error y permite reintentar con éxito', async () => {
    repository.obtener.mockRejectedValueOnce(new Error('Sin conexión'));
    const hook = await renderHook(() => useLegalInformationViewModel(repository));
    expect(hook.current.state).toBe('error');
    expect(hook.current.error).toBe('Sin conexión');
    expect(hook.current.privacyNotice).toBeNull();

    await act(async () => hook.current.retry());
    expect(hook.current.state).toBe('success');
    expect(hook.current.error).toBeNull();
    expect(hook.current.terms).not.toBeNull();
    await hook.unmount();
  });

  test('el resumen usa el del backend', async () => {
    const hook = await renderHook(() => useLegalSummaryViewModel(repository));
    expect(hook.current.summary).toBe('Resumen aviso_privacidad');
    expect(hook.current.isFallback).toBe(false);
    await hook.unmount();
  });

  test('el resumen conserva el respaldo si la llamada falla', async () => {
    repository.obtener.mockRejectedValue(new Error('offline'));
    const hook = await renderHook(() => useLegalSummaryViewModel(repository));
    expect(hook.current.summary).toBe(FALLBACK_LEGAL_SUMMARY);
    expect(hook.current.isFallback).toBe(true);
    await hook.unmount();
  });
});
