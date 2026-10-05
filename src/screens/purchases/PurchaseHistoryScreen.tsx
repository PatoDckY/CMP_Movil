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
  'PurchaseHistory'
>;

export function PurchaseHistoryScreen({
  navigation,
}: Props): React.JSX.Element {
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
          Consulta las compras realizadas desde tu cuenta
          y revisa el detalle de cada operación.
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

      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>
            $
          </Text>
        </View>

        <Text style={styles.emptyTitle}>
          Aún no hay compras para mostrar
        </Text>

        <Text style={styles.emptyDescription}>
          Cuando conectemos tu sesión y existan compras
          asociadas a tu cuenta, aparecerán aquí
          automáticamente.
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.catalogButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('Catalog')
          }>
          <Text style={styles.catalogButtonText}>
            Explorar cursos
          </Text>

          <Text style={styles.catalogButtonArrow}>
            →
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>
            i
          </Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Detalle de cada compra
          </Text>

          <Text style={styles.infoText}>
            Podrás consultar la fecha de compra, cursos
            incluidos, importe total y estado de la operación.
          </Text>
        </View>
      </View>

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

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 27,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryNumber: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '900',
  },

  summaryLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 16,
  },

  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 7,
  },

  catalogButton: {
    width: '100%',
    minHeight: 50,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  catalogButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },

  catalogButtonArrow: {
    color: colors.primary,
    fontSize: 20,
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