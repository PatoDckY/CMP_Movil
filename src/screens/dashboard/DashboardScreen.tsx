import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ActionCard} from '../../components/dashboard/ActionCard';
import {AppFooter} from '../../components/common/AppFooter';
import {InfoCard} from '../../components/common/InfoCard';
import {AuthenticatedStackParamList} from '../../navigation/types';
import {styles} from './DashboardScreen.styles';

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
            Administra tus cursos y consulta tu actividad desde un solo lugar.
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
          Desde aquí podrás consultar tus cursos, revisar tus compras y descubrir nuevas capacitaciones.
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

      <InfoCard
        icon="i"
        title="Tu información en un solo lugar"
        description="Cuando conectemos la sesión real, aquí aparecerán automáticamente tus cursos, compras y actividad personal."
        variant="dashboard"
      />

      <View style={styles.accountCard}>
        <View>
          <Text style={styles.accountEyebrow}>
            PERFIL
          </Text>

          <Text style={styles.accountTitle}>
            Administra tu cuenta
          </Text>

          <Text style={styles.accountDescription}>
            Consulta la información relacionada con tu perfil.
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

      <AppFooter />
    </ScrollView>
  );
}