import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppFooter} from '../../components/common/AppFooter';
import {EmptyState} from '../../components/common/EmptyState';
import {InfoCard} from '../../components/common/InfoCard';
import {AuthenticatedStackParamList} from '../../navigation/types';
import {styles} from './PurchaseHistoryScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'PurchaseHistory'
>;

export function PurchaseHistoryScreen({
  navigation,
}: Props): React.JSX.Element {
  const goToCatalog = () => {
    navigation.navigate('Catalog');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MI ACTIVIDAD
        </Text>

        <Text style={styles.title}>
          Historial de compras
        </Text>

        <Text style={styles.description}>
          Consulta las compras realizadas desde tu cuenta y
          revisa el detalle de cada operación.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            Compras
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            Cursos adquiridos
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            Total
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

      <EmptyState
        icon="$"
        title="Aún no hay compras para mostrar"
        description="Cuando conectemos tu sesión y existan compras asociadas a tu cuenta, aparecerán aquí automáticamente."
        actionLabel="Explorar cursos"
        onAction={goToCatalog}
        actionVariant="accent"
        variant="large"
      />

      <InfoCard
        icon="i"
        title="Detalle de cada compra"
        description="Podrás consultar la fecha de compra, cursos incluidos, importe total y estado de la operación."
      />

      <AppFooter />
    </ScrollView>
  );
}