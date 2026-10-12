
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

function validatePurchase(
  data: CreatePurchaseInput,
): string | null {
  if (
    !Number.isSafeInteger(data.courseId) ||
    data.courseId <= 0
  ) {
    return 'Selecciona un curso válido.';
  }

  if (
    !Number.isSafeInteger(data.quantity) ||
    data.quantity < 1 ||
    data.quantity > 20
  ) {
    return 'La cantidad de cupos debe estar entre 1 y 20.';
  }

  if (
    !Array.isArray(data.participants) ||
    data.participants.length !== data.quantity
  ) {
    return 'Debe existir un participante por cada cupo.';
  }

  const existingIds = new Set<number>();

  for (let i = 0; i < data.participants.length; i++) {
    const item = data.participants[i];

    if ('participantId' in item) {
      if (
        !Number.isSafeInteger(item.participantId) ||
        item.participantId <= 0
      ) {
        return `El participante ${i + 1} no es válido.`;
      }

      if (existingIds.has(item.participantId)) {
        return 'No puedes seleccionar dos veces al mismo participante.';
      }

      existingIds.add(item.participantId);
      continue;
    }

    const participant = item.participant;

    if (
      !participant.firstName.trim() ||
      !participant.paternalLastName.trim()
    ) {
      return `Completa el nombre y apellido paterno del participante ${i + 1}.`;
    }
  }

  if (
    data.userNotes !== null &&
    data.userNotes.length > 1000
  ) {
    return 'Las observaciones no deben superar los 1000 caracteres.';
  }

  return null;
}

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
        setError(validationError);
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
            ? err.message
            : 'No fue posible crear la compra.',
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
