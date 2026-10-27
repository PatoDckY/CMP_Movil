import {validatePurchase} from '../../models/purchaseValidation';

import {useCallback, useRef, useState} from 'react';

import {
  CreatePurchaseInput,
  Purchase,
} from '../../models/Purchase';

import {PurchaseRepository} from '../../repositories/contracts/PurchaseRepository';

export type PurchaseState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export function usePurchaseViewModel(
  repository: PurchaseRepository,
) {
  const [purchase, setPurchase] =
    useState<Purchase | null>(null);

  const [state, setState] =
    useState<PurchaseState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const submittingRef = useRef(false);

  const completedPurchaseRef =
    useRef<Purchase | null>(null);

  const createPurchase = useCallback(
    async (
      data: CreatePurchaseInput,
    ): Promise<Purchase | null> => {
      if (submittingRef.current) {
        return null;
      }

      // Evita crear otra compra por una segunda
      // pulsación después de una respuesta exitosa.
      if (completedPurchaseRef.current) {
        return completedPurchaseRef.current;
      }

      const validationError =
        validatePurchase(data);

      if (validationError) {
        setError(validationError.message);
        setState('error');
        return null;
      }

      submittingRef.current = true;

      try {
        setState('loading');
        setError(null);
        setPurchase(null);

        const result =
          await repository.createPurchase(data);

        completedPurchaseRef.current = result;

        setPurchase(result);
        setState('success');

        return result;
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message} Consulta el historial antes de reintentar para evitar reservas duplicadas.`
            : 'No fue posible confirmar la compra. Consulta el historial antes de reintentar.',
        );

        setState('error');
        return null;
      } finally {
        submittingRef.current = false;
      }
    },
    [repository],
  );

  const resetPurchase = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    completedPurchaseRef.current = null;
    setPurchase(null);
    setError(null);
    setState('idle');
  }, []);

  return {
    purchase,
    state,
    error,
    isLoading: state === 'loading',
    createPurchase,
    resetPurchase,
  };
}
