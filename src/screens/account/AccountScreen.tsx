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
  'Account'
>;

export function AccountScreen({
  navigation,
}: Props): React.JSX.Element {
  const handleLogout = () => {
    // En A14 aquí conectaremos el cierre de sesión real.
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          PERFIL
        </Text>

        <Text style={styles.title}>
          Mi cuenta
        </Text>

        <Text style={styles.description}>
          Consulta la información relacionada con tu perfil
          y administra el acceso a tu cuenta.
        </Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            U
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileEyebrow}>
            USUARIO
          </Text>

          <Text style={styles.profileName}>
            Información pendiente
          </Text>

          <Text style={styles.profileEmail}>
            Los datos se cargarán desde tu sesión.
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
              Datos personales
            </Text>
          </View>
        </View>

        <DetailRow
          label="Nombre"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Correo electrónico"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Teléfono"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Edad"
          value="Pendiente de conexión"
        />

        <DetailRow
          label="Sexo"
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
              ACTIVIDAD
            </Text>

            <Text style={styles.sectionTitle}>
              Mi formación
            </Text>
          </View>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.optionButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('MyCourses')
          }>
          <View>
            <Text style={styles.optionTitle}>
              Mis cursos
            </Text>

            <Text style={styles.optionDescription}>
              Consulta los cursos relacionados con tu cuenta.
            </Text>
          </View>

          <Text style={styles.optionArrow}>
            →
          </Text>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            styles.optionButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('PurchaseHistory')
          }>
          <View>
            <Text style={styles.optionTitle}>
              Historial de compras
            </Text>

            <Text style={styles.optionDescription}>
              Revisa las operaciones realizadas.
            </Text>
          </View>

          <Text style={styles.optionArrow}>
            →
          </Text>
        </Pressable>
      </View>

      <View style={styles.securityCard}>
        <View style={styles.securityIcon}>
          <Text style={styles.securityIconText}>
            S
          </Text>
        </View>

        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>
            Seguridad de la cuenta
          </Text>

          <Text style={styles.securityDescription}>
            La gestión real de sesión y credenciales se
            conectará en la siguiente etapa.
          </Text>
        </View>
      </View>

      <Pressable
        style={({pressed}) => [
          styles.logoutButton,
          pressed && styles.pressed,
        ]}
        onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>
          Cerrar sesión
        </Text>
      </Pressable>

      <Text style={styles.logoutHelper}>
        El cierre de sesión será funcional cuando integremos
        la autenticación real.
      </Text>

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

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
  },

  profileEyebrow: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  profileName: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  profileEmail: {
    color: colors.primarySoft,
    fontSize: 9,
    lineHeight: 14,
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

  optionButton: {
    minHeight: 67,
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 13,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  optionDescription: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
    maxWidth: 240,
  },

  optionArrow: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 10,
  },

  securityCard: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    padding: 15,
    marginTop: 14,
  },

  securityIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  securityIconText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  securityDescription: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },

  logoutButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  logoutButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '900',
  },

  logoutHelper: {
    color: colors.textSecondary,
    fontSize: 8,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
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