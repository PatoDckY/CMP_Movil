import {useCallback, useEffect, useRef, useState} from 'react';
import {MaterialsStatus} from '../../models/CourseMaterials';
import {CourseMaterialsRepository} from '../../repositories/contracts/CourseMaterialsRepository';
import {ApiError} from '../../services/http/httpClient';

export interface MaterialsSessionScope {
  version(): number;
  subscribe(listener: () => void): () => void;
}

export function useCourseMaterialsViewModel(repository: CourseMaterialsRepository,
  enrollmentId: number, courseId: number, accountId: number | null,
  openLink: (url: string) => Promise<unknown>, scope: MaterialsSessionScope) {
  const [status, setStatus] = useState<MaterialsStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  const pending = useRef(false);
  const mounted = useRef(true);
  const current = useRef('');
  const key = `${accountId}:${enrollmentId}:${courseId}`;
  current.current = key;
  const cancel = useCallback(() => {generation.current += 1; pending.current = false;}, []);
  useEffect(() => {
    mounted.current = true;
    cancel(); setStatus(null); setError(null); setBusy(false);
    const unsubscribe = scope.subscribe(() => {
      cancel(); setStatus(null); setError(null); setBusy(false);
    });
    return () => {mounted.current = false; cancel(); unsubscribe();};
  }, [key, scope, cancel]);

  const request = useCallback(async (open: boolean) => {
    if (!accountId || pending.current || !mounted.current) {return;}
    pending.current = true;
    const id = ++generation.current;
    const version = scope.version();
    const isCurrent = () => mounted.current && generation.current === id && current.current === key && scope.version() === version;
    setBusy(true); setStatus(null); setError(null);
    try {
      // A fresh authorization request is mandatory for every press; no URL in state/storage.
      const result = await repository.getMaterials(enrollmentId);
      if (!isCurrent()) {return;}
      if (result.courseId !== courseId || result.enrollmentId !== enrollmentId) {throw new Error('Curso distinto');}
      setStatus(result.status);
      if (open && result.status === 'disponible' && result.url && isCurrent()) {
        await openLink(result.url);
      }
    } catch (failure) {
      if (!isCurrent()) {return;}
      setStatus(null);
      setError(failure instanceof ApiError && [401, 403, 404].includes(failure.status)
        ? 'No tienes autorización para consultar estos materiales. Verifica tu sesión e inscripción.'
        : 'No fue posible consultar o abrir los materiales. Revisa tu conexión e inténtalo nuevamente.');
    } finally {
      if (mounted.current && generation.current === id && current.current === key) {
        pending.current = false; setBusy(false);
        if (scope.version() !== version) {setStatus(null);}
      }
    }
  }, [accountId, courseId, enrollmentId, key, repository, scope, openLink]);
  const reload = useCallback(() => request(false), [request]);
  const openMaterials = useCallback(() => request(true), [request]);
  return {status, error, busy, reload, openMaterials, cancel};
}
