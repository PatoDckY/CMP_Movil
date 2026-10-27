
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {Purchase} from '../../models/Purchase';

import {
  PurchaseRepository,
} from '../../repositories/contracts/PurchaseRepository';

export type PurchaseHistoryState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

export interface PurchaseHistorySummary {
  totalPurchases: number;
  totalPlaces: number;
  totalAmount: number;
}

export function usePurchaseHistoryViewModel(
  repository: PurchaseRepository,
) {
  const [purchases, setPurchases] =
    useState<Purchase[]>([]);

  const [state, setState] =
    useState<PurchaseHistoryState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const requestId = useRef(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    return () => {
      requestId.current += 1;
      loadingRef.current = false;
    };
  }, []);

  const loadPurchases = useCallback(async () => {
    if (loadingRef.current) {return;}
    loadingRef.current = true;
    const currentRequestId =
      ++requestId.current;

    try {
      // Revalida en segundo plano: si ya hay historial visible se
      // conserva en pantalla en vez de mostrar un spinner completo.
      setState(current =>
        current === 'success' || current === 'empty'
          ? current
          : 'loading',
      );
      setError(null);

      const result =
        await repository.getPurchases();

      if (
        currentRequestId !== requestId.current
      ) {
        return;
      }

      setPurchases(result);

      setState(
        result.length === 0
          ? 'empty'
          : 'success',
      );
    } catch (err) {
      if (
        currentRequestId !== requestId.current
      ) {
        return;
      }

      setPurchases([]);

      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible cargar el historial de compras.',
      );

      setState('error');
    } finally {
      if (currentRequestId === requestId.current) {loadingRef.current = false;}
    }
  }, [repository]);

  const summary =
    useMemo<PurchaseHistorySummary>(() => {
      const totalPlaces = purchases.reduce(
        (total, purchase) =>
          total + purchase.quantity,
        0,
      );

      const totalAmount = purchases.reduce(
        (total, purchase) => {
          const amount = Number(purchase.total);

          return Number.isFinite(amount)
            ? total + amount
            : total;
        },
        0,
      );

      return {
        totalPurchases: purchases.length,
        totalPlaces,
        totalAmount,
      };
    }, [purchases]);

  return {
    purchases,
    state,
    error,
    isLoading: state === 'loading',
    isEmpty: state === 'empty',
    summary,
    loadPurchases,
  };
}
