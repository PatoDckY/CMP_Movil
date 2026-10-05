import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppFooter} from '../../components/common/AppFooter';
import {DetailRow} from '../../components/common/DetailRow';
import {InfoCard} from '../../components/common/InfoCard';
import {PrimaryButton} from '../../components/common/PrimaryButton';
import {SectionHeader} from '../../components/common/SectionHeader';
import {AuthenticatedStackParamList} from '../../navigation/types';
import {styles} from './PurchaseDetailScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'PurchaseDetail'
>;

export function PurchaseDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {purchaseId} = route.params;

  const goToPurchaseHistory = () => {
    navigation.navigate('PurchaseHistory');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          DETALLE DE OPERACIÓN
        </Text>

        <Text style={styles.title}>
          Detalle de compra
        </Text>

        <Text style={styles.description}>
          Consulta la información relacionada con una compra
          realizada desde tu cuenta.
        </Text>
      </View>

      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseIcon}>
          <Text style={styles.purchaseIconText}>
            $
          </Text>
        </View>

        <View style={styles.purchaseHeaderInfo}>
          <Text style={styles.purchaseLabel}>
            COMPRA
          </Text>

          <Text style={styles.purchaseNumber}>
            #{purchaseId}
          </Text>

          <Text style={styles.purchaseStatus}>
            Información pendiente de cargar
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="01"
          eyebrow="INFORMACIÓN"
          title="Datos de la compra"
        />

        <DetailRow
          label="Fecha"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Estado"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Importe total"
          value="Pendiente de conexión"
          last
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="02"
          eyebrow="CONTENIDO"
          title="Cursos adquiridos"
        />

        <View style={styles.emptyCourses}>
          <View style={styles.emptyCoursesIcon}>
            <Text style={styles.emptyCoursesIconText}>
              C
            </Text>
          </View>

          <Text style={styles.emptyCoursesTitle}>
            Información pendiente
          </Text>

          <Text style={styles.emptyCoursesText}>
            Los cursos incluidos en esta compra aparecerán
            cuando conectemos el historial con la API.
          </Text>
        </View>
      </View>

      <View style={styles.totalCard}>
        <View>
          <Text style={styles.totalEyebrow}>
            TOTAL DE LA COMPRA
          </Text>

          <Text style={styles.totalValue}>
            —
          </Text>
        </View>

        <View style={styles.totalIcon}>
          <Text style={styles.totalIconText}>
            $
          </Text>
        </View>
      </View>

      <InfoCard
        icon="i"
        title="Información de tu compra"
        description="Esta pantalla mostrará únicamente la información perteneciente a la compra seleccionada desde tu historial."
      />

      <View style={styles.backButtonContainer}>
        <PrimaryButton
          label="Volver al historial"
          onPress={goToPurchaseHistory}
          showArrow
        />
      </View>

      <AppFooter />
    </ScrollView>
  );
}