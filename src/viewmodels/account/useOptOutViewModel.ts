import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_OPT_OUT_PREFERENCES,
  OptOutKey,
  OptOutPreferences,
} from '../../models/OptOutPreferences';
import { OptOutPreferencesRepository } from '../../repositories/contracts/OptOutPreferencesRepository';

export function useOptOutViewModel(
  repository: OptOutPreferencesRepository,
  userId: number | undefined,
) {
  const [preferences, setPreferences] = useState<OptOutPreferences>(
    DEFAULT_OPT_OUT_PREFERENCES,
  );
  const [isLoading, setIsLoading] = useState(userId !== undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef(preferences);
  const saving = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId === undefined) {
      setIsLoading(false);
      return;
    }
    let active = true;
    setIsLoading(true);
    repository
      .load(userId)
      .then(loaded => {
        if (active) {
          current.current = loaded;
          setPreferences(loaded);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError('No fue posible consultar tus preferencias de privacidad.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [repository, userId]);

  const setOptOut = useCallback(
    async (key: OptOutKey, value: boolean): Promise<boolean> => {
      if (userId === undefined || saving.current) {
        return false;
      }
      const previous = current.current;
      const next = { ...previous, [key]: value };
      saving.current = true;
      setIsSaving(true);
      setError(null);
      current.current = next;
      setPreferences(next);
      try {
        await repository.save(userId, next);
        return true;
      } catch {
        // Si no se pudo persistir, la pantalla no debe aparentar que sí.
        current.current = previous;
        if (mounted.current) {
          setPreferences(previous);
          setError('No fue posible guardar tu preferencia. Intenta de nuevo.');
        }
        return false;
      } finally {
        saving.current = false;
        if (mounted.current) {
          setIsSaving(false);
        }
      }
    },
    [repository, userId],
  );

  return { preferences, isLoading, isSaving, error, setOptOut };
}
