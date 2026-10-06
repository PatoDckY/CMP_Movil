import React from 'react';
import {
  Alert,
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
import {useSession} from '../../session/SessionContext';
import {styles} from './AccountScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'Account'
>;

export function AccountScreen({
  navigation,
}: Props): React.JSX.Element {
  const {
    user,
    logout,
  } = useSession();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No fue posible cerrar la sesión.',
      );
    }
  };

  const initial =
    user?.fullName?.charAt(0).toUpperCase() ??
    'U';

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
            {initial}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileEyebrow}>
            USUARIO
          </Text>

          <Text style={styles.profileName}>
            {user?.fullName ??
              'Usuario autenticado'}
          </Text>

          <Text style={styles.profileEmail}>
            {user?.email ??
              'Correo no disponible'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="01"
          eyebrow="INFORMACIÓN"
          title="Datos de la sesión"
        />

        <DetailRow
          label="ID de usuario"
          value={
            user
              ? String(user.id)
              : 'No disponible'
          }
        />

        <DetailRow
          label="Nombre"
          value={
            user?.fullName ??
            'No disponible'
          }
        />

        <DetailRow
          label="Correo electrónico"
          value={
            user?.email ??
            'No disponible'
          }
        />

        <DetailRow
          label="Rol"
          value={
            user?.role ??
            'No disponible'
          }
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

            <Text
              style={
                styles.optionDescription
              }>
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

            <Text
              style={
                styles.optionDescription
              }>
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
        title="Sesión protegida"
        description="Tu identidad se obtiene de la sesión autenticada validada por CMP-Site."
      />

      <View style={styles.logoutContainer}>
        <PrimaryButton
          label="Cerrar sesión"
          onPress={handleLogout}
          variant="dangerOutline"
        />
      </View>

      <Text style={styles.logoutHelper}>
        Al cerrar sesión se eliminará la sesión del servidor
        y volverás al área pública.
      </Text>

      <AppFooter />
    </ScrollView>
  );
}