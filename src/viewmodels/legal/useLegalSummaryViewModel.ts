import {useEffect, useState} from 'react';

import {LegalRepository} from '../../repositories/contracts/LegalRepository';

/**
 * Resumen de respaldo para cuando no hay conexión durante el registro.
 * Es solo un resumen corto; el texto completo siempre viene del backend.
 */
export const FALLBACK_LEGAL_SUMMARY =
  'Usaremos tus datos para crear y administrar tu cuenta y prestarte el ' +
  'servicio. Consulta el Aviso de privacidad y los Términos y condiciones ' +
  'completos antes de aceptar.';

export function useLegalSummaryViewModel(repository: LegalRepository) {
  const [summary, setSummary] = useState(FALLBACK_LEGAL_SUMMARY);
  const [isFallback, setIsFallback] = useState(true);

  useEffect(() => {
    let active = true;
    repository
      .obtener('aviso_privacidad')
      .then(document => {
        if (!active) {return;}
        setSummary(document.resumen);
        setIsFallback(false);
      })
      .catch(() => {
        // Sin conexión: se conserva el resumen de respaldo.
      });
    return () => {
      active = false;
    };
  }, [repository]);

  return {summary, isFallback};
}
