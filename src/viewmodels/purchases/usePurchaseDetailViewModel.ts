import {amountToCents, isValidPaymentDate} from '../../models/purchaseValidation';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CoursePayment,
  PurchaseDetail,
  ReportPaymentInput,
} from '../../models/Purchase';

import {
  PurchaseRepository,
} from '../../repositories/contracts/PurchaseRepository';

export type PurchaseDetailState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export type PaymentReportState =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'error';

function centsToAmount(
  cents: number,
): string {
  const pesos = Math.floor(
    cents / 100,
  );

  const centavos = String(
    cents % 100,
  ).padStart(2, '0');

  return `${pesos}.${centavos}`;
}

function isHttpsUrl(
  value: string,
): boolean {
  return /^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(
    value,
  );
}

export function usePurchaseDetailViewModel(
  repository: PurchaseRepository,
) {
  const [detail, setDetail] =
    useState<PurchaseDetail | null>(null);

  const [state, setState] =
    useState<PurchaseDetailState>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const [reportState, setReportState] =
    useState<PaymentReportState>('idle');

  const [reportError, setReportError] =
    useState<string | null>(null);

  const [
    refreshWarning,
    setRefreshWarning,
  ] = useState<string | null>(null);

  const [
    lastReportedPayment,
    setLastReportedPayment,
  ] = useState<CoursePayment | null>(null);

  const requestId = useRef(0);

  const mountedRef = useRef(true);

  const submittingRef = useRef(false);
  const completedReport = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestId.current += 1;
    };
  }, []);

  const loadPurchaseDetail = useCallback(
    async (purchaseId: number) => {
      const currentRequestId =
        ++requestId.current;

      if (
        !Number.isSafeInteger(purchaseId) ||
        purchaseId <= 0
      ) {
        setDetail(null);
        setError(
          'El identificador de la compra no es válido.',
        );
        setState('error');
        return;
      }

      try {
        setState('loading');
        setError(null);

        const result =
          await repository.getPurchaseDetail(
            purchaseId,
          );

        if (
          !mountedRef.current ||
          currentRequestId !==
            requestId.current
        ) {
          return;
        }

        completedReport.current = false;
        setReportState('idle');
        setReportError(null);
        setDetail(result);
        setState('success');
        setRefreshWarning(null);
      } catch (err) {
        if (
          !mountedRef.current ||
          currentRequestId !==
            requestId.current
        ) {
          return;
        }

        setDetail(null);

        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible consultar la compra.',
        );

        setState('error');
      }
    },
    [repository],
  );

  const clearReportFeedback =
    useCallback(() => {
      if (submittingRef.current) {
        return;
      }

      setReportState('idle');
      setReportError(null);
      setRefreshWarning(null);
      setLastReportedPayment(null);
    }, []);

  const reportPayment = useCallback(
    async (
      purchaseId: number,
      input: ReportPaymentInput,
    ): Promise<boolean> => {
      if (submittingRef.current) {
        return false;
      }
      if (completedReport.current) {
        setReportError('El reporte ya fue aceptado. Consulta nuevamente el detalle antes de enviar otro.');
        return false;
      }

      const fail = (
        message: string,
      ): boolean => {
        if (mountedRef.current) {
          setReportError(message);
          setReportState('error');
        }

        return false;
      };

      setReportError(null);
      setRefreshWarning(null);

      if (
        !Number.isSafeInteger(purchaseId) ||
        purchaseId <= 0
      ) {
        return fail(
          'El identificador de la compra no es válido.',
        );
      }

      if (
        !detail ||
        detail.purchase.id !== purchaseId ||
        state !== 'success'
      ) {
        return fail(
          'Primero debes consultar una compra válida.',
        );
      }

      if (reportState === 'success') {
        return fail(
          'Ya se registró un reporte. Actualiza el detalle antes de enviar otro.',
        );
      }

      const {
        purchase,
        paymentMethods,
        paymentSummary,
      } = detail;

      const allowedStatus =
        purchase.status ===
          'Pendiente de pago' ||
        purchase.status ===
          'Pago reportado';

      if (!allowedStatus) {
        return fail(
          'Esta compra no permite reportar pagos en su estado actual.',
        );
      }

      const deadline = Date.parse(
        purchase.paymentDeadline,
      );

      if (
        !Number.isFinite(deadline) ||
        deadline <= Date.now()
      ) {
        return fail(
          'El plazo para reportar el pago ya venció.',
        );
      }

      if (
        paymentSummary.fullPaymentReported
      ) {
        return fail(
          'Ya se reportó el importe completo de esta compra.',
        );
      }

      const method =
        paymentMethods.find(
          item =>
            item.id === input.paymentMethodId,
        );

      if (!method) {
        return fail(
          'Selecciona un método de pago disponible.',
        );
      }

      const amountCents =
        amountToCents(input.amount);

      const balanceCents =
        amountToCents(
          paymentSummary.pendingBalance,
        );

      if (
        amountCents === null ||
        amountCents <= 0
      ) {
        return fail(
          'El monto debe ser mayor que cero y tener máximo dos decimales.',
        );
      }

      if (
        balanceCents === null ||
        balanceCents <= 0
      ) {
        return fail(
          'No hay saldo pendiente disponible para reportar.',
        );
      }

      if (
        amountCents > balanceCents
      ) {
        return fail(
          'El monto no puede superar el saldo pendiente de la compra.',
        );
      }

      const paymentDate = Date.parse(
        input.paymentDate,
      );

      if (!isValidPaymentDate(input.paymentDate)) {
        return fail(
          'La fecha del pago no es válida o está en el futuro.',
        );
      }

      const reference =
        input.reference?.trim() || null;

      const observations =
        input.observations?.trim() || null;

      const receiptPath =
        input.receiptPath?.trim() || null;

      const originalFileName =
        input.originalFileName?.trim() ||
        null;

      const fileType =
        input.fileType?.trim() || null;

      if (
        reference &&
        reference.length > 100
      ) {
        return fail(
          'La referencia no puede superar los 100 caracteres.',
        );
      }

      if (
        observations &&
        observations.length > 1000
      ) {
        return fail(
          'Las observaciones no pueden superar los 1000 caracteres.',
        );
      }

      const channel =
        input.receiptChannel;

      if (
        method.requiresReceipt &&
        channel === 'Sin comprobante'
      ) {
        return fail(
          'El método de pago seleccionado requiere comprobante.',
        );
      }

      if (channel === 'Imagen') {
        if (
          !receiptPath ||
          !originalFileName ||
          !fileType
        ) {
          return fail(
            'Primero debes cargar una imagen válida del comprobante.',
          );
        }

        if (
          !isHttpsUrl(receiptPath)
        ) {
          return fail(
            'La imagen del comprobante debe tener una URL HTTPS válida.',
          );
        }

        if (
          ![
            'image/jpeg',
            'image/png',
            'image/webp',
          ].includes(fileType)
        ) {
          return fail(
            'El comprobante debe ser JPG, PNG o WEBP.',
          );
        }

        if (
          originalFileName.length > 255
        ) {
          return fail(
            'El nombre del archivo es demasiado largo.',
          );
        }
      }

      if (channel === 'URL') {
        if (
          !receiptPath ||
          !isHttpsUrl(receiptPath)
        ) {
          return fail(
            'Ingresa una URL HTTPS válida del comprobante.',
          );
        }

        if (
          originalFileName ||
          fileType
        ) {
          return fail(
            'El comprobante por URL no debe incluir datos de archivo.',
          );
        }
      }

      if (channel === 'WhatsApp') {
        if (
          input.receiptConfirmed !== true
        ) {
          return fail(
            'Debes confirmar que ya enviaste el comprobante por WhatsApp.',
          );
        }

        if (
          receiptPath ||
          originalFileName ||
          fileType
        ) {
          return fail(
            'El reporte por WhatsApp no debe incluir archivos ni URL.',
          );
        }
      }

      if (channel === 'Sin comprobante') {
        if (
          receiptPath ||
          originalFileName ||
          fileType
        ) {
          return fail(
            'Esta opción no debe incluir datos del comprobante.',
          );
        }
      }

      if (
        ![
          'Imagen',
          'URL',
          'WhatsApp',
          'Sin comprobante',
        ].includes(channel)
      ) {
        return fail(
          'Selecciona un canal de comprobante válido.',
        );
      }

      const payload: ReportPaymentInput = {
        paymentMethodId:
          input.paymentMethodId,

        amount:
          centsToAmount(amountCents),

        paymentDate:
          new Date(paymentDate)
            .toISOString(),

        reference,

        receiptChannel: channel,

        receiptPath,

        originalFileName,

        fileType,

        receiptConfirmed:
          input.receiptConfirmed,

        whatsappSentAt: null,

        observations,
      };

      submittingRef.current = true;
      const reportRequestId = requestId.current;
      setReportState('submitting');
      setReportError(null);

      try {
        const registeredPayment =
          await repository.reportPayment(
            purchaseId,
            payload,
          );

        if (!mountedRef.current || reportRequestId !== requestId.current) {
          return true;
        }
        completedReport.current = true;

        setLastReportedPayment(
          registeredPayment,
        );

        setReportState('success');

        // El reporte ya fue aceptado.
        // Intentamos actualizar el detalle
        // sin volver a enviar el pago.
        const currentRequestId =
          ++requestId.current;

        try {
          const updatedDetail =
            await repository.getPurchaseDetail(
              purchaseId,
            );

          if (
            mountedRef.current &&
            currentRequestId ===
              requestId.current
          ) {
            setDetail(updatedDetail);
            setState('success');
            setError(null);
          }
        } catch {
          if (mountedRef.current) {
            setRefreshWarning(
              'El pago se reportó correctamente, pero no fue posible actualizar el detalle. Consulta nuevamente el historial antes de enviar otro reporte.',
            );
          }
        }

        return true;
      } catch (err) {
        if (!mountedRef.current || reportRequestId !== requestId.current) {return false;}
        return fail(
          err instanceof Error
            ? `${err.message}. Verifica el historial antes de reintentar para evitar reportes duplicados.`
            : 'No fue posible confirmar el reporte. Verifica el historial antes de reintentar.',
        );
      } finally {
        submittingRef.current = false;
      }
    },
    [
      repository,
      detail,
      state,
      reportState,
    ],
  );

  return {
    detail,
    state,
    error,

    isLoading:
      state === 'loading',

    loadPurchaseDetail,

    // Reporte de pago
    reportPayment,

    reportState,
    reportError,

    isReporting:
      reportState === 'submitting',

    lastReportedPayment,
    refreshWarning,

    clearReportFeedback,
  };
}
