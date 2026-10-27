
import React, {useCallback} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AppFooter,
} from '../../components/common/AppFooter';

import {
  EmptyState,
} from '../../components/common/EmptyState';

import {
  InfoCard,
} from '../../components/common/InfoCard';

import {
  purchaseRepository,
} from '../../config/dependencies';

import {
  Purchase,
} from '../../models/Purchase';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {
  colors,
} from '../../theme/colors';

import {
  usePurchaseHistoryViewModel,
} from '../../viewmodels/purchases/usePurchaseHistoryViewModel';

import {
  styles,
} from './PurchaseHistoryScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'PurchaseHistory'
>;

function formatMoney(
  value: number | string,
): string {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 'No disponible';
  }

  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isPendingStatus(
  status: string,
): boolean {
  return (
    status === 'Borrador' ||
    status === 'Pendiente de pago' ||
    status === 'Pago reportado' ||
    status === 'En validación'
  );
}

function isSuccessfulStatus(
  status: string,
): boolean {
  return (
    status === 'Pago validado' ||
    status === 'Inscripciones generadas'
  );
}

function isErrorStatus(
  status: string,
): boolean {
  return (
    status === 'Rechazada' ||
    status === 'Cancelada' ||
    status === 'Expirada'
  );
}

export function PurchaseHistoryScreen({
  navigation,
}: Props): React.JSX.Element {
  const {
    purchases,
    state,
    error,
    isLoading,
    isEmpty,
    summary,
    loadPurchases,
  } = usePurchaseHistoryViewModel(
    purchaseRepository,
  );

  const refreshPurchases = useCallback(() => {
    void loadPurchases();
  }, [loadPurchases]);

  // Actualizar las compras cuando esta
  // pantalla vuelva a recibir el foco.
  useFocusEffect(
    useCallback(() => {
      void loadPurchases();
    }, [loadPurchases]),
  );

  const goToCatalog = () => {
    navigation.navigate('Catalog');
  };

  const goToPurchaseDetail = (
    purchaseId: number,
  ) => {
    navigation.navigate('PurchaseDetail', {
      purchaseId,
    });
  };

  const hasSummary =
    state === 'success' ||
    state === 'empty';

  const renderPurchase = (
    purchase: Purchase,
  ): React.JSX.Element => {
    const pending = isPendingStatus(
      purchase.status,
    );

    const successful = isSuccessfulStatus(
      purchase.status,
    );

    const rejected = isErrorStatus(
      purchase.status,
    );

    return (
      <View
        key={purchase.id}
        style={styles.purchaseCard}>

        <View style={styles.purchaseContent}>
          <View style={styles.cardTopRow}>
            <View style={styles.folioContainer}>
              <Text style={styles.folioLabel}>
                FOLIO DE COMPRA
              </Text>

              <Text
                selectable
                style={styles.folioText}>
                {purchase.folio}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                pending &&
                  styles.statusPending,

                successful &&
                  styles.statusSuccess,

                rejected &&
                  styles.statusError,
              ]}>

              <Text
                style={[
                  styles.statusText,

                  pending &&
                    styles.statusPendingText,

                  successful &&
                    styles.statusSuccessText,

                  rejected &&
                    styles.statusErrorText,
                ]}>
                {purchase.status}
              </Text>
            </View>
          </View>

          <Text style={styles.courseTitle}>
            {purchase.courseTitle}
          </Text>

          <View style={styles.purchaseMeta}>
            <Text style={styles.metaLabel}>
              Fecha de compra
            </Text>

            <Text style={styles.metaValue}>
              {formatDate(
                purchase.purchaseDate,
              )}
            </Text>
          </View>

          <View style={styles.purchaseMeta}>
            <Text style={styles.metaLabel}>
              Cupos solicitados
            </Text>

            <Text style={styles.metaValue}>
              {purchase.quantity}
            </Text>
          </View>

          <View style={styles.purchaseMeta}>
            <Text style={styles.metaLabel}>
              Límite de pago
            </Text>

            <Text style={styles.metaValue}>
              {formatDate(
                purchase.paymentDeadline,
              )}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.totalLabel}>
                IMPORTE TOTAL
              </Text>

              <Text style={styles.totalValue}>
                {formatMoney(
                  purchase.total,
                )}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                `Ver detalle de la compra ${purchase.folio}`
              }
              onPress={() =>
                goToPurchaseDetail(
                  purchase.id,
                )
              }
              style={({pressed}) => [
                styles.detailsButton,
                pressed && {opacity: 0.85},
              ]}>

              <Text
                style={styles.detailsButtonText}>
                Ver detalle
              </Text>

              <Text
                style={styles.detailsArrow}>
                →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MI ACTIVIDAD
        </Text>

        <Text style={styles.title}>
          Historial de compras
        </Text>

        <Text style={styles.description}>
          Consulta las compras registradas
          en tu cuenta, revisa su estado
          y accede a la información de pago.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? summary.totalPurchases
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            Compras
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? summary.totalPlaces
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            Cupos
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? formatMoney(
                  summary.totalAmount,
                )
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            Importe acumulado
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>
          COMPRAS
        </Text>

        <Text style={styles.sectionTitle}>
          Tus movimientos
        </Text>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Consultando tus compras
            en CMP_Site...
          </Text>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            No pudimos cargar tus compras
          </Text>

          <Text
            style={styles.errorDescription}>
            {error ??
              'Ocurrió un error al consultar el historial.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={refreshPurchases}>

            <Text style={styles.retryText}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      )}

      {isEmpty && (
        <View style={styles.emptyWrapper}>
          <EmptyState
            icon="$"
            title="Aún no hay compras para mostrar"
            description="Cuando tengas compras de cursos registradas en tu cuenta, aparecerán aquí."
            actionLabel="Explorar cursos"
            onAction={goToCatalog}
            actionVariant="accent"
            variant="large"
          />
        </View>
      )}

      {state === 'success' && (
        <View style={styles.purchasesList}>
          {purchases.map(renderPurchase)}
        </View>
      )}

      {(state === 'success' ||
        state === 'empty') && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Actualizar historial de compras"
          style={styles.refreshButton}
          onPress={refreshPurchases}>

          <Text style={styles.refreshText}>
            ↻ Actualizar historial
          </Text>
        </Pressable>
      )}

      {state === 'success' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Este historial incluye compras
            pendientes, reportadas,
            validadas, canceladas y
            expiradas. El importe acumulado
            no representa el total de pagos
            aprobados.
          </Text>
        </View>
      )}

      <InfoCard
        icon="i"
        title="Consulta tus compras"
        description="Selecciona Ver detalle para consultar el folio, los participantes, el importe pendiente y los pagos reportados. Las inscripciones se generan después de la validación correspondiente."
      />

      <AppFooter />
    </ScrollView>
  );
}
