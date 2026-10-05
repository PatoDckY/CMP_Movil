import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppFooter} from '../../components/common/AppFooter';
import {StepCard} from '../../components/home/StepCard';
import {PublicStackParamList} from '../../navigation/types';
import {styles} from './HomeScreen.styles';

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
            Descubre los cursos disponibles del Centro Médico
            Pichardo y encuentra la capacitación ideal para ti.
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
            Consulta la oferta académica antes de iniciar sesión y
            conoce cada curso con detalle.
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
              Conoce fechas, costos, cupos, instructor y modalidad.
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
              Encuentra los cursos disponibles organizados por
              categoría.
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
              Explora la oferta académica directamente desde tu
              dispositivo sin necesidad de iniciar sesión.
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
            Inicia sesión para acceder a las funciones personales de
            tu cuenta.
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

        <AppFooter variant="home" />
      </ScrollView>
    </SafeAreaView>
  );
}