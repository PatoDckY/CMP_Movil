import React from 'react';
import {
  Pressable,
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
import {styles} from './AccountScreen.styles';

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
        <SectionHeader
          number="01"
          eyebrow="INFORMACIÓN"
          title="Datos personales"
        />

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
        <SectionHeader
          number="02"
          eyebrow="ACTIVIDAD"
          title="Mi formación"
        />

        <Pressable
          style={({pressed}) => [
            styles.optionButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('MyCourses')
          }>
          <View style={styles.optionContent}>
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
            navigation.navigate(
              'PurchaseHistory',
            )
          }>
          <View style={styles.optionContent}>
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

      <InfoCard
        icon="S"
        title="Seguridad de la cuenta"
        description="La gestión real de sesión y credenciales se conectará en la siguiente etapa."
      />

      <View style={styles.logoutContainer}>
        <PrimaryButton
          label="Cerrar sesión"
          onPress={handleLogout}
          variant="dangerOutline"
        />
      </View>

      <Text style={styles.logoutHelper}>
        El cierre de sesión será funcional cuando integremos
        la autenticación real.
      </Text>

      <AppFooter />
    </ScrollView>
  );
}