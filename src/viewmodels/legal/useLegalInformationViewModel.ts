import {useCallback, useEffect, useRef, useState} from 'react';

import {LegalDocument} from '../../models/LegalDocument';
import {LegalRepository} from '../../repositories/contracts/LegalRepository';

export type LegalInformationState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export function useLegalInformationViewModel(
  repository: LegalRepository,
) {
  const [privacyNotice, setPrivacyNotice] =
    useState<LegalDocument | null>(null);
  const [terms, setTerms] = useState<LegalDocument | null>(null);
  const [state, setState] = useState<LegalInformationState>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setState('loading');
    setError(null);
    try {
      const [notice, conditions] = await Promise.all([
        repository.obtener('aviso_privacidad'),
        repository.obtener('terminos_condiciones'),
      ]);
      if (current !== requestId.current || !mounted.current) {return;}
      setPrivacyNotice(notice);
      setTerms(conditions);
      setState('success');
    } catch (err) {
      if (current !== requestId.current || !mounted.current) {return;}
      setPrivacyNotice(null);
      setTerms(null);
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'No fue posible cargar los documentos legales.',
      );
      setState('error');
    }
  }, [repository]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  return {
    privacyNotice,
    terms,
    state,
    error,
    isLoading: state === 'loading' || state === 'idle',
    retry: load,
  };
}
