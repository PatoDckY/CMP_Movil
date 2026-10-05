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
  'Home'
>;

export function DashboardScreen({
  navigation,
}: Props): React.JSX.Element {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            SIMG-CMP
          </Text>

          <Text style={styles.title}>
            Mi formación
          </Text>

          <Text style={styles.subtitle}>
            Administra tus cursos y consulta tu
            actividad desde un solo lugar.
          </Text>
        </View>

        <Pressable
          style={styles.accountButton}
          onPress={() =>
            navigation.navigate('Account')
          }>
          <Text style={styles.accountButtonText}>
            Mi cuenta
          </Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            TU ESPACIO
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Continúa con tu formación
        </Text>

        <Text style={styles.heroDescription}>
          Desde aquí podrás consultar tus cursos,
          revisar tus compras y descubrir nuevas
          capacitaciones.
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.heroButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('MyCourses')
          }>
          <Text style={styles.heroButtonText}>
            Ver mis cursos
          </Text>

          <Text style={styles.heroButtonArrow}>
            →
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionEyebrow}>
        ACCESOS PRINCIPALES
      </Text>

      <Text style={styles.sectionTitle}>
        ¿Qué deseas consultar?
      </Text>

      <View style={styles.cards}>
        <ActionCard
          number="01"
          title="Mis cursos"
          description="Consulta los cursos que has adquirido y su información."
          buttonText="Ir a mis cursos"
          onPress={() =>
            navigation.navigate('MyCourses')
          }
        />

        <ActionCard
          number="02"
          title="Historial de compras"
          description="Revisa las compras realizadas desde tu cuenta."
          buttonText="Ver compras"
          onPress={() =>
            navigation.navigate(
              'PurchaseHistory',
            )
          }
        />

        <ActionCard
          number="03"
          title="Explorar catálogo"
          description="Encuentra nuevos cursos disponibles en Centro Médico Pichardo."
          buttonText="Ver catálogo"
          onPress={() =>
            navigation.navigate('Catalog')
          }
        />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>
            i
          </Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Tu información en un solo lugar
          </Text>

          <Text style={styles.infoDescription}>
            Cuando conectemos la sesión real, aquí
            aparecerán automáticamente tus cursos,
            compras y actividad personal.
          </Text>
        </View>
      </View>

      <View style={styles.accountCard}>
        <View>
          <Text style={styles.accountEyebrow}>
            PERFIL
          </Text>

          <Text style={styles.accountTitle}>
            Administra tu cuenta
          </Text>

          <Text style={styles.accountDescription}>
            Consulta la información relacionada con
            tu perfil.
          </Text>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.profileButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('Account')
          }>
          <Text style={styles.profileButtonText}>
            Mi cuenta
          </Text>

          <Text style={styles.profileButtonArrow}>
            →
          </Text>
        </Pressable>
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

type ActionCardProps = {
  number: string;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
};

function ActionCard({
  number,
  title,
  description,
  buttonText,
  onPress,
}: ActionCardProps): React.JSX.Element {
  return (
    <View style={styles.actionCard}>
      <View style={styles.actionTop}>
        <View style={styles.actionNumber}>
          <Text style={styles.actionNumberText}>
            {number}
          </Text>
        </View>

        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>
            {title}
          </Text>

          <Text style={styles.actionDescription}>
            {description}
          </Text>
        </View>
      </View>

      <Pressable
        style={({pressed}) => [
          styles.actionButton,
          pressed && styles.pressed,
        ]}
        onPress={onPress}>
        <Text style={styles.actionButtonText}>
          {buttonText}
        </Text>

        <Text style={styles.actionButtonArrow}>
          →
        </Text>
      </Pressable>
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

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: '90%',
  },

  accountButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 12,
  },

  accountButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 30,
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: colors.primaryLight,
    right: -50,
    top: -55,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: colors.primaryLight,
    left: -35,
    bottom: -45,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: 16,
    maxWidth: '90%',
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: '94%',
  },

  heroButton: {
    minHeight: 50,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },

  heroButtonArrow: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 15,
  },

  cards: {
    marginBottom: 4,
  },

  actionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: 16,
    marginBottom: 12,
  },

  actionTop: {
    flexDirection: 'row',
  },

  actionNumber: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  actionNumberText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  actionDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  actionButton: {
    minHeight: 42,
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 13,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  actionButtonArrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    padding: 15,
    marginTop: 5,
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
    fontSize: 12,
    fontWeight: '900',
  },

  infoDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  accountCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: 17,
    marginTop: 14,
  },

  accountEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  accountTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },

  accountDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  profileButton: {
    minHeight: 43,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 13,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  profileButtonArrow: {
    color: colors.primary,
    fontSize: 18,
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