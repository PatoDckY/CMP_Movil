import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {PublicStackParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'Home'
>;

export function HomeScreen({
  navigation,
}: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                CMP
              </Text>
            </View>

            <View>
              <Text style={styles.brandTop}>
                Centro Médico
              </Text>

              <Text style={styles.brandName}>
                Pichardo
              </Text>
            </View>
          </View>

          <View style={styles.systemBadge}>
            <View style={styles.systemDot} />

            <Text style={styles.systemText}>
              SIMG-CMP
            </Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCircleLarge} />
          <View style={styles.heroCircleSmall} />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              FORMACIÓN Y SALUD
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Tu formación, en un solo lugar
          </Text>

          <Text style={styles.heroDescription}>
            Descubre los cursos disponibles del Centro
            Médico Pichardo y encuentra la capacitación
            ideal para ti.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.heroButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate('Catalog')
            }>
            <Text style={styles.heroButtonText}>
              Explorar cursos
            </Text>

            <Text style={styles.heroButtonArrow}>
              →
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            CONOCE LA PLATAFORMA
          </Text>

          <Text style={styles.sectionTitle}>
            Una forma sencilla de comenzar
          </Text>

          <Text style={styles.sectionDescription}>
            Consulta la oferta académica antes de iniciar
            sesión y conoce cada curso con detalle.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <StepCard
            number="01"
            title="Explora"
            description="Consulta los cursos disponibles, sus fechas, modalidad, costo y cupo."
          />

          <View style={styles.stepConnector} />

          <StepCard
            number="02"
            title="Elige"
            description="Revisa la información completa de cada curso antes de tomar una decisión."
          />

          <View style={styles.stepConnector} />

          <StepCard
            number="03"
            title="Accede"
            description="Inicia sesión o crea una cuenta cuando necesites utilizar funciones personales."
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>
            PENSADO PARA TI
          </Text>

          <Text style={styles.sectionTitle}>
            Todo claro desde el inicio
          </Text>
        </View>

        <View style={styles.benefitsRow}>
          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitIconText}>
                i
              </Text>
            </View>

            <Text style={styles.benefitTitle}>
              Información clara
            </Text>

            <Text style={styles.benefitDescription}>
              Conoce fechas, costos, cupos, instructor y
              modalidad.
            </Text>
          </View>

          <View style={styles.benefitCard}>
            <View
              style={[
                styles.benefitIcon,
                styles.benefitIconAccent,
              ]}>
              <Text style={styles.benefitIconText}>
                C
              </Text>
            </View>

            <Text style={styles.benefitTitle}>
              Consulta sencilla
            </Text>

            <Text style={styles.benefitDescription}>
              Encuentra los cursos disponibles organizados
              por categoría.
            </Text>
          </View>
        </View>

        <View style={styles.fullBenefitCard}>
          <View style={styles.fullBenefitIcon}>
            <Text style={styles.fullBenefitIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.fullBenefitContent}>
            <Text style={styles.fullBenefitTitle}>
              Consulta desde cualquier lugar
            </Text>

            <Text style={styles.fullBenefitDescription}>
              Explora la oferta académica directamente desde
              tu dispositivo sin necesidad de iniciar sesión.
            </Text>
          </View>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountBadge}>
            <Text style={styles.accountBadgeText}>
              TU CUENTA
            </Text>
          </View>

          <Text style={styles.accountTitle}>
            ¿Ya formas parte de CMP?
          </Text>

          <Text style={styles.accountDescription}>
            Inicia sesión para acceder a las funciones
            personales de tu cuenta.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate('Login')
            }>
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          </Pressable>

          <View style={styles.registerRow}>
            <Text style={styles.registerQuestion}>
              ¿Aún no tienes cuenta?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate('Register')
              }>
              <Text style={styles.registerLink}>
                Crear cuenta
              </Text>
            </Pressable>
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
    </SafeAreaView>
  );
}

type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

function StepCard({
  number,
  title,
  description,
}: StepCardProps): React.JSX.Element {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>
          {title}
        </Text>

        <Text style={styles.stepDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  logoText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },

  brandTop: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  brandName: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  systemDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  systemText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 34,
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primaryLight,
    right: -55,
    top: -65,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    right: 55,
    bottom: -55,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '900',
    marginTop: 18,
    maxWidth: '90%',
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: '94%',
  },

  heroButton: {
    minHeight: 52,
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingHorizontal: 17,
    marginTop: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  heroButtonArrow: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: '800',
  },

  sectionHeader: {
    marginBottom: 17,
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    marginTop: 5,
  },

  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  stepsContainer: {
    marginBottom: 34,
  },

  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },

  stepNumber: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  stepNumberText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  stepDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  stepConnector: {
    width: 2,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 21,
  },

  benefitsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  benefitCard: {
    flex: 1,
    minHeight: 175,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 15,
  },

  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  benefitIconAccent: {
    backgroundColor: colors.accentSoft,
  },

  benefitIconText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  benefitTitle: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },

  benefitDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },

  fullBenefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 34,
  },

  fullBenefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  fullBenefitIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  fullBenefitContent: {
    flex: 1,
  },

  fullBenefitTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  fullBenefitDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  accountCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 30,
  },

  accountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  accountBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  accountTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 15,
  },

  accountDescription: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  loginButton: {
    minHeight: 49,
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  registerQuestion: {
    color: colors.primarySoft,
    fontSize: 11,
    marginRight: 5,
  },

  registerLink: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 4,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.75,
  },
});