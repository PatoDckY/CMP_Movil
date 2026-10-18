import {isValidAmount, isValidPaymentDate} from '../../models/purchaseValidation';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import {
  AppFooter,
} from '../../components/common/AppFooter';

import {
  DetailRow,
} from '../../components/common/DetailRow';

import {
  InfoCard,
} from '../../components/common/InfoCard';

import {
  PrimaryButton,
} from '../../components/common/PrimaryButton';

import {
  SectionHeader,
} from '../../components/common/SectionHeader';

import {
  purchaseRepository,
} from '../../config/dependencies';

import {
  ReportPaymentInput,
} from '../../models/Purchase';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {colors} from '../../theme/colors';

import {
  usePurchaseDetailViewModel,
} from '../../viewmodels/purchases/usePurchaseDetailViewModel';

import {
  styles,
} from './PurchaseDetailScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'PurchaseDetail'
>;

/*
 * DATOS BANCARIOS
 *
 * Reflejan los datos publicados
 * actualmente en CMP_Site.
 *
 * Deben verificarse con el Centro
 * Médico antes de recibir pagos reales.
 */
const BANK_DETAILS = {
  beneficiary:
    'Dr. Francisco Javier Moreno Pichardo',
  bank: 'BBVA',
  clabe: '012180015602037361',
} as const;

/*
 * WHATSAPP DE RECEPCIÓN
 *
 * Número temporal autorizado
 * para el desarrollo de SIMG-CMP.
 *
 * Reemplazar por el institucional
 * antes de publicar la aplicación.
 */
const PAYMENT_WHATSAPP = '527717205499';

const PAYMENT_WHATSAPP_LABEL =
  '+52 771 720 5499';

// Formatear cantidades en pesos mexicanos.
function formatMoney(
  value: string,
): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Formatear fechas recibidas del backend.
function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// Presentar la CLABE con espacios visuales.
// Al copiarla se utilizará su valor original.
function formatClabe(
  value: string,
): string {
  return [
    value.slice(0, 3),
    value.slice(3, 6),
    value.slice(6, 17),
    value.slice(17),
  ].join(' ');
}

function formatPaymentDay(
  date: Date,
): string {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatPaymentTime(
  date: Date,
): string {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Validación inicial del monto.
// El ViewModel y el backend realizan
// también sus propias validaciones.
export function PurchaseDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {purchaseId} = route.params;

  const {
    detail,
    state,
    error,
    loadPurchaseDetail,

    reportPayment,
    reportState,
    reportError,
    isReporting,

    lastReportedPayment,
    refreshWarning,
    clearReportFeedback,
  } = usePurchaseDetailViewModel(
    purchaseRepository,
  );

  const confirmationOpen = useRef(false);

  // Formulario de reporte.
  const [
    showReportForm,
    setShowReportForm,
  ] = useState(false);

  const [
    paymentMethodId,
    setPaymentMethodId,
  ] = useState<number | null>(null);

  const [amount, setAmount] =
    useState('');

  const [
    paymentDate,
    setPaymentDate,
  ] = useState(new Date());

  const [
    reference,
    setReference,
  ] = useState('');

  const [
    observations,
    setObservations,
  ] = useState('');

  // Seguimiento de apertura de WhatsApp.
  // Esto no verifica automáticamente
  // que se haya enviado el archivo.
  const [
    whatsappOpened,
    setWhatsappOpened,
  ] = useState(false);

  const [
    whatsappConfirmed,
    setWhatsappConfirmed,
  ] = useState(false);

  // Cargar el detalle al abrir la pantalla.
  useEffect(() => {
    void loadPurchaseDetail(purchaseId);
  }, [
    purchaseId,
    loadPurchaseDetail,
  ]);

  // Preparar el formulario después
  // de obtener o actualizar la compra.
  useEffect(() => {
    if (!detail) {
      return;
    }

    setAmount(
      detail.paymentSummary.pendingBalance,
    );

    setPaymentMethodId(current => {
      const existing =
        detail.paymentMethods.find(
          method => method.id === current,
        );

      return existing
        ? existing.id
        : detail.paymentMethods[0]?.id ??
            null;
    });

    setWhatsappOpened(false);
    setWhatsappConfirmed(false);
  }, [detail]);

  const goToPurchaseHistory = () => {
    navigation.navigate(
      'PurchaseHistory',
    );
  };

  // Actualización manual del detalle.
  const refreshDetail = () => {
    if (isReporting) {
      return;
    }

    setShowReportForm(false);
    setWhatsappOpened(false);
    setWhatsappConfirmed(false);

    clearReportFeedback();

    void loadPurchaseDetail(purchaseId);
  };

  // Copiar la CLABE completa.
  const copyClabe = () => {
    Clipboard.setString(
      BANK_DETAILS.clabe,
    );

    Alert.alert(
      'CLABE copiada',
      'Los 18 dígitos se copiaron al portapapeles, sin espacios.',
    );
  };

  // Selector de fecha.
  const openDatePicker = () => {
    if (isReporting) {
      return;
    }

    Keyboard.dismiss();

    DateTimePickerAndroid.open({
      value: paymentDate,
      mode: 'date',
      display: 'calendar',
      maximumDate: new Date(),

      onChange: (
        event,
        selectedDate,
      ) => {
        if (
          event.type !== 'set' ||
          !selectedDate
        ) {
          return;
        }

        setPaymentDate(current => {
          const updated = new Date(
            current,
          );

          updated.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );

          return updated;
        });
      },
    });
  };

  // Selector de hora.
  const openTimePicker = () => {
    if (isReporting) {
      return;
    }

    Keyboard.dismiss();

    DateTimePickerAndroid.open({
      value: paymentDate,
      mode: 'time',
      is24Hour: true,

      onChange: (
        event,
        selectedDate,
      ) => {
        if (
          event.type !== 'set' ||
          !selectedDate
        ) {
          return;
        }

        setPaymentDate(current => {
          const updated = new Date(
            current,
          );

          updated.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
            0,
            0,
          );

          return updated;
        });
      },
    });
  };

  // Si cambia el monto, debemos
  // volver a preparar el mensaje.
  const updateAmount = (
    value: string,
  ) => {
    setAmount(value);

    setWhatsappOpened(false);
    setWhatsappConfirmed(false);
  };

  // Si cambia el método de pago,
  // invalidamos la confirmación anterior.
  const updateMethod = (
    methodId: number,
  ) => {
    setPaymentMethodId(methodId);

    setWhatsappOpened(false);
    setWhatsappConfirmed(false);
  };

  // Abrir WhatsApp con los datos
  // asociados a la compra real.
  const openWhatsApp = async () => {
    if (
      !detail ||
      isReporting ||
      reportState === 'success'
    ) {
      return;
    }

    const selectedMethod =
      detail.paymentMethods.find(
        method =>
          method.id === paymentMethodId,
      );

    if (!selectedMethod) {
      Alert.alert(
        'Método de pago',
        'Selecciona un método de pago.',
      );

      return;
    }

    if (
      !isValidAmount(
        amount,
        detail.paymentSummary.pendingBalance,
      )
    ) {
      Alert.alert(
        'Monto inválido',
        'Ingresa un monto válido que no supere el saldo pendiente.',
      );

      return;
    }

    const message = [
      'Hola, envío mi comprobante de pago.',
      '',
      `Folio de compra: ${detail.purchase.folio}`,
      `Curso: ${detail.purchase.courseTitle}`,
      `Monto reportado: ${formatMoney(
        amount.trim(),
      )}`,
    ].join('\n');

    const url =
      `https://wa.me/${PAYMENT_WHATSAPP}` +
      `?text=${encodeURIComponent(message)}`;

    try {
      Keyboard.dismiss();

      setWhatsappOpened(false);
      setWhatsappConfirmed(false);

      await Linking.openURL(url);

      // Solo indica que el enlace se abrió.
      // El usuario debe adjuntar y enviar
      // su comprobante manualmente.
      setWhatsappOpened(true);
    } catch {
      Alert.alert(
        'No fue posible abrir WhatsApp',
        'Verifica que WhatsApp esté instalado o que el enlace pueda abrirse en tu dispositivo.',
      );
    }
  };

  // Reportar el pago a CMP_Site.
  const submitPaymentReport = () => {
    if (
      !detail ||
      isReporting ||
      confirmationOpen.current ||
      reportState === 'success'
    ) {
      return;
    }

    const selectedMethod =
      detail.paymentMethods.find(
        method =>
          method.id === paymentMethodId,
      );

    if (!selectedMethod) {
      Alert.alert(
        'Método de pago',
        'Selecciona un método de pago válido.',
      );

      return;
    }

    if (
      !isValidAmount(
        amount,
        detail.paymentSummary.pendingBalance,
      )
    ) {
      Alert.alert(
        'Monto inválido',
        'El monto debe ser mayor que cero, tener máximo dos decimales y no superar el saldo pendiente.',
      );

      return;
    }

    if (!isValidPaymentDate(paymentDate)) {
      Alert.alert(
        'Fecha inválida',
        'La fecha y hora del pago no pueden estar en el futuro.',
      );

      return;
    }

    if (
      !whatsappOpened ||
      !whatsappConfirmed
    ) {
      Alert.alert(
        'Comprobante requerido',
        'Primero abre WhatsApp, adjunta y envía tu comprobante. Después confirma el envío en la aplicación.',
      );

      return;
    }

    const payload: ReportPaymentInput = {
      paymentMethodId:
        selectedMethod.id,

      amount: amount.trim(),

      paymentDate:
        paymentDate.toISOString(),

      reference:
        reference.trim() || null,

      // Canal admitido por CMP_Site.
      receiptChannel: 'WhatsApp',

      // WhatsApp no requiere
      // URL ni archivo en el POST.
      receiptPath: null,
      originalFileName: null,
      fileType: null,

      // Declaración explícita del usuario
      // de que envió el comprobante.
      receiptConfirmed: true,

      // El servidor genera la fecha
      // del reporte de WhatsApp.
      whatsappSentAt: null,

      observations:
        observations.trim() || null,
    };

    confirmationOpen.current = true;

    Alert.alert(
      'Confirmar reporte de pago',

      `Folio: ${detail.purchase.folio}\n\n` +
        `Curso: ${detail.purchase.courseTitle}\n` +
        `Monto: ${formatMoney(amount.trim())}\n` +
        `Método: ${selectedMethod.name}\n` +
        `Comprobante: WhatsApp\n\n` +
        'Al confirmar se registrará este reporte en CMP_Site. La administración deberá verificar el comprobante y validar el pago.',

      [
        {
          text: 'Cancelar',
          style: 'cancel',

          onPress: () => {
            confirmationOpen.current =
              false;
          },
        },

        {
          text: 'Reportar pago',

          onPress: () => {
            confirmationOpen.current =
              false;

            void (async () => {
              const success =
                await reportPayment(
                  purchaseId,
                  payload,
                );

              if (success) {
                setShowReportForm(false);
                setWhatsappOpened(false);
                setWhatsappConfirmed(false);
              }
            })();
          },
        },
      ],

      {
        cancelable: false,
      },
    );
  };

  // Pantalla de carga.
  if (
    state === 'idle' ||
    state === 'loading'
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingTitle}>
          Cargando compra...
        </Text>

        <Text style={styles.loadingText}>
          Consultando la información
          de tu compra en CMP_Site.
        </Text>
      </View>
    );
  }

  // Pantalla de error.
  if (
    state === 'error' ||
    detail === null
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No fue posible cargar la compra
        </Text>

        <Text style={styles.loadingText}>
          {error ??
            'La información no está disponible.'}
        </Text>

        <View style={styles.fullWidth}>
          <PrimaryButton
            label="Reintentar"
            onPress={refreshDetail}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.secondaryAction}
          onPress={goToPurchaseHistory}>

          <Text style={styles.secondaryText}>
            Volver al historial
          </Text>
        </Pressable>
      </View>
    );
  }

  const {
    purchase,
    participants,
    paymentMethods,
    payments,
    paymentSummary,
  } = detail;

  const deadlineTime = Date.parse(
    purchase.paymentDeadline,
  );

  const deadlinePassed =
    !Number.isFinite(deadlineTime) ||
    deadlineTime <= Date.now();

  const allowedStatus =
    purchase.status ===
      'Pendiente de pago' ||
    purchase.status ===
      'Pago reportado';

  const pendingAmount = Number(
    paymentSummary.pendingBalance,
  );

  const canReportPayment =
    allowedStatus &&
    !deadlinePassed &&
    !paymentSummary.fullPaymentReported &&
    Number.isFinite(pendingAmount) &&
    pendingAmount > 0 &&
    paymentMethods.length > 0;

  const hasEnrollment =
    purchase.status ===
    'Inscripciones generadas';

  const paymentReported =
    purchase.status ===
      'Pago reportado' ||
    purchase.status ===
      'En validación' ||
    paymentSummary.fullPaymentReported;

  let paymentMessage =
    'Tu compra está pendiente de pago. Una vez realizado, debes enviar el comprobante por WhatsApp y registrar el reporte para su validación.';

  if (hasEnrollment) {
    paymentMessage =
      'El pago fue validado y se generaron las inscripciones correspondientes.';
  } else if (
    purchase.status === 'Expirada'
  ) {
    paymentMessage =
      'La compra expiró y ya no admite reportes de pago.';
  } else if (paymentReported) {
    paymentMessage =
      'Hay un pago reportado que debe ser revisado por la administración.';
  } else if (deadlinePassed) {
    paymentMessage =
      'El plazo para reportar el pago ha vencido.';
  } else if (!canReportPayment) {
    paymentMessage =
      'Esta compra no admite nuevos reportes de pago.';
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}>

      {/* ENCABEZADO */}

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          DETALLE DE OPERACIÓN
        </Text>

        <Text style={styles.title}>
          Detalle de compra
        </Text>

        <Text style={styles.description}>
          Consulta tu reserva, el saldo
          pendiente y los pagos reportados.
        </Text>
      </View>

      {/* FOLIO DE COMPRA */}

      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseIcon}>
          <Text style={styles.purchaseIconText}>
            $
          </Text>
        </View>

        <View style={styles.purchaseHeaderInfo}>
          <Text style={styles.purchaseLabel}>
            FOLIO DE COMPRA
          </Text>

          <Text
            selectable
            style={styles.purchaseNumber}>
            {purchase.folio}
          </Text>

          <Text style={styles.purchaseStatus}>
            {purchase.status}
          </Text>
        </View>
      </View>

      {/* RESUMEN DE COMPRA */}

      <View style={styles.section}>
        <SectionHeader
          number="01"
          eyebrow="INFORMACIÓN"
          title="Resumen de compra"
        />

        <DetailRow
          label="Curso"
          value={purchase.courseTitle}
        />

        <DetailRow
          label="Cupos"
          value={String(purchase.quantity)}
        />

        <DetailRow
          label="Precio por cupo"
          value={formatMoney(
            purchase.unitPrice,
          )}
        />

        <DetailRow
          label="Fecha de compra"
          value={formatDate(
            purchase.purchaseDate,
          )}
        />

        <DetailRow
          label="Límite de pago"
          value={formatDate(
            purchase.paymentDeadline,
          )}
        />

        <DetailRow
          label="Estado"
          value={purchase.status}
          last
        />

        {purchase.observations && (
          <View style={styles.observationsBox}>
            <Text style={styles.smallHeading}>
              Observaciones
            </Text>

            <Text style={styles.bodyText}>
              {purchase.observations}
            </Text>
          </View>
        )}
      </View>

      {/* PARTICIPANTES */}

      <View style={styles.section}>
        <SectionHeader
          number="02"
          eyebrow="PARTICIPANTES"
          title="Personas registradas"
        />

        {participants.length === 0 ? (
          <Text style={styles.mutedText}>
            No hay participantes registrados.
          </Text>
        ) : (
          participants.map(item => {
            const person =
              item.participant;

            const fullName = [
              person.firstName,
              person.paternalLastName,
              person.maternalLastName,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <View
                key={item.purchaseParticipantId}
                style={styles.participantCard}>

                <View style={styles.participantRow}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>
                      {item.slotNumber}
                    </Text>
                  </View>

                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {fullName}
                    </Text>

                    <Text
                      style={styles.participantStatus}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {person.phone && (
                  <Text style={styles.personDetail}>
                    Teléfono: {person.phone}
                  </Text>
                )}

                {person.email && (
                  <Text style={styles.personDetail}>
                    Correo: {person.email}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* RESUMEN DEL PAGO */}

      <View style={styles.section}>
        <SectionHeader
          number="03"
          eyebrow="ESTADO DE PAGO"
          title="Resumen del pago"
        />

        <DetailRow
          label="Total"
          value={formatMoney(
            paymentSummary.totalPurchase,
          )}
        />

        <DetailRow
          label="Reportado"
          value={formatMoney(
            paymentSummary.totalReported,
          )}
        />

        <DetailRow
          label="Saldo pendiente"
          value={formatMoney(
            paymentSummary.pendingBalance,
          )}
          last
        />
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalInformation}>
          <Text style={styles.totalEyebrow}>
            SALDO PENDIENTE
          </Text>

          <Text style={styles.totalValue}>
            {formatMoney(
              paymentSummary.pendingBalance,
            )}
          </Text>
        </View>

        <View style={styles.totalIcon}>
          <Text style={styles.totalIconText}>
            $
          </Text>
        </View>
      </View>

      {/* ESTADO DE VALIDACIÓN */}

      <View style={styles.noticeContainer}>
        <InfoCard
          icon="i"
          title={
            hasEnrollment
              ? 'Inscripciones generadas'
              : paymentReported
                ? 'Pago reportado'
                : purchase.status === 'Expirada'
                  ? 'Compra expirada'
                  : 'Información de pago'
          }
          description={paymentMessage}
        />
      </View>

      {/* DATOS PARA TRANSFERENCIA */}

      {canReportPayment && (
        <View style={styles.section}>
          <SectionHeader
            number="04"
            eyebrow="TRANSFERENCIA"
            title="Datos para pagar"
          />

          <Text style={styles.bodyText}>
            Verifica que los datos
            bancarios coincidan con
            los oficiales del Centro
            Médico antes de transferir.
          </Text>

          <View style={styles.bankCard}>
            <Text style={styles.smallHeading}>
              BENEFICIARIO
            </Text>

            <Text style={styles.bankValue}>
              {BANK_DETAILS.beneficiary}
            </Text>

            <View style={styles.bankDivider} />

            <Text style={styles.smallHeading}>
              BANCO
            </Text>

            <Text style={styles.bankValue}>
              {BANK_DETAILS.bank}
            </Text>

            <View style={styles.bankDivider} />

            <Text style={styles.smallHeading}>
              CLABE INTERBANCARIA
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copiar CLABE interbancaria"
              onPress={copyClabe}
              style={styles.clabeButton}>

              <Text style={styles.clabeText}>
                {formatClabe(
                  BANK_DETAILS.clabe,
                )}
              </Text>

              <Text style={styles.copyHint}>
                Toca para copiar
              </Text>
            </Pressable>

            <View style={styles.bankDivider} />

            <Text style={styles.smallHeading}>
              IMPORTE PENDIENTE
            </Text>

            <Text style={styles.bankAmount}>
              {formatMoney(
                paymentSummary.pendingBalance,
              )}
            </Text>
          </View>

          <View style={styles.folioBox}>
            <Text style={styles.folioHeading}>
              CONCEPTO DE TRANSFERENCIA
            </Text>

            <Text style={styles.bodyText}>
              Escribe exactamente este
              folio en el concepto
              de la transferencia.
            </Text>

            <Text
              selectable
              style={styles.folioText}>
              {purchase.folio}
            </Text>
          </View>
        </View>
      )}

      {/* CONFIRMACIÓN DEL BACKEND */}

      {reportState === 'success' && (
        <View style={styles.reportSuccess}>
          <Text style={styles.reportSuccessTitle}>
            Pago reportado correctamente
          </Text>

          <Text style={styles.reportSuccessText}>
            {lastReportedPayment
              ? `Reporte #${lastReportedPayment.id} recibido. `
              : 'Reporte recibido. '}
            Tu pago fue registrado
            para revisión administrativa.
            La administración verificará
            el comprobante enviado
            por WhatsApp.
          </Text>

          {refreshWarning && (
            <Text style={styles.reportSuccessText}>
              {refreshWarning}
            </Text>
          )}
        </View>
      )}

      {/* REPORTE DE PAGO */}

      {canReportPayment && (
        <View style={styles.section}>
          <SectionHeader
            number="05"
            eyebrow="REPORTE DE PAGO"
            title="¿Ya realizaste tu pago?"
          />

          <View style={styles.reportNotice}>
            <Text style={styles.reportNoticeText}>
              Si ya realizaste la
              transferencia, debes enviar
              el comprobante por WhatsApp
              y registrar el pago
              para su revisión.
            </Text>
          </View>

          {!showReportForm &&
            reportState !== 'success' && (
              <Pressable
                accessibilityRole="button"
                disabled={isReporting}
                style={[
                  styles.reportButton,
                  isReporting &&
                    styles.reportButtonDisabled,
                ]}
                onPress={() => {
                  clearReportFeedback();
                  setPaymentDate(new Date());
                  setShowReportForm(true);
                }}>

                <Text style={styles.reportButtonText}>
                  Ya realicé mi pago
                </Text>
              </Pressable>
            )}

          {showReportForm &&
            reportState !== 'success' && (
              <View style={styles.formSection}>
                <Text style={styles.formTitle}>
                  Reportar un pago
                </Text>

                <Text style={styles.formDescription}>
                  Completa los datos
                  de la operación realizada.
                  El comprobante se enviará
                  únicamente por WhatsApp.
                </Text>

                {/* MÉTODO DE PAGO */}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Método de pago *
                  </Text>

                  {paymentMethods.map(method => {
                    const selected =
                      paymentMethodId ===
                      method.id;

                    return (
                      <Pressable
                        key={method.id}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected,
                        }}
                        disabled={isReporting}
                        onPress={() =>
                          updateMethod(method.id)
                        }
                        style={[
                          styles.methodChoice,
                          selected &&
                            styles.methodChoiceSelected,
                        ]}>

                        <View style={styles.choiceHeader}>
                          <View
                            style={[
                              styles.choiceCircle,
                              selected &&
                                styles.choiceCircleSelected,
                            ]}
                          />

                          <Text
                            style={[
                              styles.choiceText,
                              selected &&
                                styles.choiceTextSelected,
                            ]}>
                            {method.name}
                          </Text>
                        </View>

                        {method.description && (
                          <Text style={styles.formHelp}>
                            {method.description}
                          </Text>
                        )}

                        {selected &&
                          method.instructions && (
                            <Text style={styles.instructions}>
                              {method.instructions}
                            </Text>
                          )}
                      </Pressable>
                    );
                  })}
                </View>

                {/* MONTO */}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Monto pagado (MXN) *
                  </Text>

                  <TextInput
                    style={styles.formInput}
                    value={amount}
                    onChangeText={updateAmount}
                    placeholder="0.00"
                    placeholderTextColor={
                      colors.textSecondary
                    }
                    keyboardType="decimal-pad"
                    maxLength={16}
                    editable={!isReporting}
                  />

                  <Text style={styles.formHelp}>
                    Saldo pendiente:
                    {' '}
                    {formatMoney(
                      paymentSummary.pendingBalance,
                    )}
                    . Se permiten pagos parciales.
                  </Text>
                </View>

                {/* FECHA DEL PAGO */}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Fecha y hora del pago *
                  </Text>

                  <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeColumn}>
                      <Pressable
                        accessibilityRole="button"
                        disabled={isReporting}
                        style={styles.dateTimeButton}
                        onPress={openDatePicker}>

                        <Text style={styles.dateTimeValue}>
                          {formatPaymentDay(
                            paymentDate,
                          )}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={styles.dateTimeColumn}>
                      <Pressable
                        accessibilityRole="button"
                        disabled={isReporting}
                        style={styles.dateTimeButton}
                        onPress={openTimePicker}>

                        <Text style={styles.dateTimeValue}>
                          {formatPaymentTime(
                            paymentDate,
                          )}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <Text style={styles.formHelp}>
                    Indica cuándo realizaste
                    el pago. No puede ser
                    una fecha futura.
                  </Text>
                </View>

                {/* REFERENCIA */}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Referencia (opcional)
                  </Text>

                  <TextInput
                    style={styles.formInput}
                    value={reference}
                    onChangeText={setReference}
                    placeholder="Número de operación o rastreo"
                    placeholderTextColor={
                      colors.textSecondary
                    }
                    editable={!isReporting}
                    maxLength={100}
                    autoCapitalize="none"
                  />
                </View>

                {/* ENVÍO POR WHATSAPP */}

                <View style={styles.whatsappCard}>
                  <Text style={styles.formTitle}>
                    Enviar comprobante por WhatsApp
                  </Text>

                  <Text style={styles.bodyText}>
                    El mensaje incluirá
                    automáticamente el folio,
                    el curso y el monto reportado.
                  </Text>

                  <Text style={styles.whatsappNumber}>
                    {PAYMENT_WHATSAPP_LABEL}
                  </Text>

                  <Text style={styles.formHelp}>
                    Contacto temporal configurado
                    para recibir los comprobantes.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    disabled={isReporting}
                    onPress={() => {
                      void openWhatsApp();
                    }}
                    style={[
                      styles.whatsappButton,
                      isReporting &&
                        styles.reportButtonDisabled,
                    ]}>

                    <Text style={styles.whatsappButtonText}>
                      Abrir WhatsApp
                    </Text>
                  </Pressable>

                  {/* ADVERTENCIA PRINCIPAL */}

                  <View style={styles.whatsappWarning}>
                    <Text
                      style={styles.whatsappWarningTitle}>
                      ¡IMPORTANTE!
                    </Text>

                    <Text
                      style={styles.whatsappWarningText}>
                      DEBES ENVIAR TU
                      COMPROBANTE DE PAGO
                      POR WHATSAPP.
                    </Text>

                    <Text
                      style={styles.whatsappWarningText}>
                      Adjunta la fotografía
                      o el PDF de tu
                      comprobante y envíalo
                      al número indicado.
                    </Text>

                    <Text
                      style={styles.whatsappWarningText}>
                      Abrir WhatsApp NO significa
                      que el comprobante
                      se haya enviado.
                    </Text>

                    <Text
                      style={styles.whatsappWarningText}>
                      Después de enviarlo,
                      regresa a SIMG-CMP,
                      marca la confirmación
                      y registra tu pago.
                    </Text>
                  </View>

                  {/* CONFIRMACIÓN DEL USUARIO */}

                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked:
                        whatsappConfirmed,

                      disabled:
                        !whatsappOpened ||
                        isReporting,
                    }}
                    disabled={
                      !whatsappOpened ||
                      isReporting
                    }
                    onPress={() =>
                      setWhatsappConfirmed(
                        current => !current,
                      )
                    }
                    style={styles.checkboxRow}>

                    <View
                      style={[
                        styles.checkboxBox,

                        whatsappConfirmed &&
                          styles.checkboxSelected,
                      ]}>

                      {whatsappConfirmed && (
                        <Text
                          style={styles.checkboxMark}>
                          ✓
                        </Text>
                      )}
                    </View>

                    <Text style={styles.checkboxLabel}>
                      Ya envié mi comprobante
                      de pago por WhatsApp
                      al número indicado.
                    </Text>
                  </Pressable>
                </View>

                {/* OBSERVACIONES */}

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Observaciones (opcional)
                  </Text>

                  <TextInput
                    style={[
                      styles.formInput,
                      styles.formTextarea,
                    ]}
                    value={observations}
                    onChangeText={setObservations}
                    multiline
                    textAlignVertical="top"
                    editable={!isReporting}
                    maxLength={1000}
                    placeholder="Información adicional del pago"
                    placeholderTextColor={
                      colors.textSecondary
                    }
                  />
                </View>

                {/* ERROR DEL REPORTE */}

                {reportState === 'error' &&
                  reportError && (
                    <View style={styles.reportError}>
                      <Text style={styles.reportErrorText}>
                        {reportError}
                      </Text>
                    </View>
                  )}

                {/* ENVÍO REAL A CMP_SITE */}

                <Pressable
                  accessibilityRole="button"
                  disabled={
                    isReporting ||
                    !whatsappOpened ||
                    !whatsappConfirmed
                  }
                  onPress={submitPaymentReport}
                  style={[
                    styles.submitButton,

                    (
                      isReporting ||
                      !whatsappOpened ||
                      !whatsappConfirmed
                    ) &&
                      styles.reportButtonDisabled,
                  ]}>

                  {isReporting ? (
                    <View style={styles.submittingRow}>
                      <ActivityIndicator
                        size="small"
                        color={colors.surface}
                      />

                      <Text style={styles.submittingText}>
                        Registrando pago...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Confirmar reporte de pago
                    </Text>
                  )}
                </Pressable>

                <Text style={styles.formHelp}>
                  Al confirmar se enviará
                  un reporte real a CMP_Site.
                  El pago quedará sujeto
                  a validación administrativa.
                </Text>

                {/* CANCELAR FORMULARIO */}

                <Pressable
                  accessibilityRole="button"
                  disabled={isReporting}
                  style={styles.cancelButton}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowReportForm(false);
                  }}>

                  <Text style={styles.cancelButtonText}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            )}
        </View>
      )}

      {/* PAGOS REGISTRADOS */}

      {payments.length > 0 && (
        <View style={styles.section}>
          <SectionHeader
            number="06"
            eyebrow="MOVIMIENTOS"
            title="Pagos reportados"
          />

          {payments.map(payment => (
            <View
              key={payment.id}
              style={styles.paymentCard}>

              <View style={styles.paymentRow}>
                <Text style={styles.methodName}>
                  {payment.paymentMethodName}
                </Text>

                <Text style={styles.paymentAmount}>
                  {formatMoney(
                    payment.amount,
                  )}
                </Text>
              </View>

              <Text style={styles.personDetail}>
                Estado: {payment.status}
              </Text>

              <Text style={styles.personDetail}>
                Fecha de pago:{' '}
                {formatDate(
                  payment.paymentDate,
                )}
              </Text>

              <Text style={styles.personDetail}>
                Canal: {payment.receiptChannel}
              </Text>

              {payment.reference && (
                <Text style={styles.personDetail}>
                  Referencia: {payment.reference}
                </Text>
              )}

              {payment.rejectionReason && (
                <Text style={styles.rejectionText}>
                  Motivo de rechazo:{' '}
                  {payment.rejectionReason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ACTUALIZAR DETALLE */}

      <Pressable
        accessibilityRole="button"
        disabled={isReporting}
        style={styles.refreshAction}
        onPress={refreshDetail}>

        <Text style={styles.refreshActionText}>
          ↻ Actualizar información
        </Text>
      </Pressable>

      {/* REGRESAR AL HISTORIAL */}

      <View style={styles.backButtonContainer}>
        <PrimaryButton
          label="Volver al historial"
          onPress={goToPurchaseHistory}
          disabled={isReporting}
          showArrow
        />
      </View>

      <AppFooter />
    </KeyboardAwareScrollView>
  );
}
