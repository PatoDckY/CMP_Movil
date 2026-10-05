import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AuthenticatedStackParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'PurchaseDetail'
>;

export function PurchaseDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {purchaseId} = route.params;

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
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumber}>
            <Text style={styles.sectionNumberText}>
              01
            </Text>
          </View>

          <View>
            <Text style={styles.sectionEyebrow}>
              INFORMACIÓN
            </Text>

            <Text style={styles.sectionTitle}>
              Datos de la compra
            </Text>
          </View>
        </View>

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
        <View style={styles.sectionHeader}>
          <View style={styles.sectionNumber}>
            <Text style={styles.sectionNumberText}>
              02
            </Text>
          </View>

          <View>
            <Text style={styles.sectionEyebrow}>
              CONTENIDO
            </Text>

            <Text style={styles.sectionTitle}>
              Cursos adquiridos
            </Text>
          </View>
        </View>

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

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>
            i
          </Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Información de tu compra
          </Text>

          <Text style={styles.infoText}>
            Esta pantalla mostrará únicamente la información
            perteneciente a la compra seleccionada desde tu
            historial.
          </Text>
        </View>
      </View>

      <Pressable
        style={({pressed}) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
        onPress={() =>
          navigation.navigate('PurchaseHistory')
        }>
        <Text style={styles.backButtonText}>
          Volver al historial
        </Text>

        <Text style={styles.backButtonArrow}>
          →
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.footerLogo}>
          <Text style={styles.footerLogoText}>
            CMP
          </Text>
        </View>

        <Text style={styles.footerTitle}>
          Centro Médico Pichardo
        </Text>

        <Text style={styles.footerText}>
          Sistema Integral de Gestión Médica
        </Text>
      </View>
    </ScrollView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function DetailRow({
  label,
  value,
  last = false,
}: DetailRowProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.detailRow,
        last && styles.detailRowLast,
      ]}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 42,
  },

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  purchaseIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  purchaseIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  purchaseHeaderInfo: {
    flex: 1,
  },

  purchaseLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  purchaseNumber: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  purchaseStatus: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 17,
    marginTop: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    marginBottom: 4,
  },

  sectionNumber: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionNumberText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },

  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },

  detailLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },

  emptyCourses: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },

  emptyCoursesIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCoursesIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  emptyCoursesTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 13,
  },

  emptyCoursesText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  totalCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 18,
    padding: 17,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  totalValue: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },

  totalIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalIconText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    padding: 15,
    marginTop: 14,
  },

  infoIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  infoIconText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },

  backButton: {
    minHeight: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },

  backButtonArrow: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '900',
  },

  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.75,
  },
});