import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AppFooter} from '../../components/common/AppFooter';
import {EmptyState} from '../../components/common/EmptyState';
import {InfoCard} from '../../components/common/InfoCard';
import {AuthenticatedStackParamList} from '../../navigation/types';
import {styles} from './MyCoursesScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'MyCourses'
>;

export function MyCoursesScreen({
  navigation,
}: Props): React.JSX.Element {
  const goToCatalog = () => {
    navigation.navigate('Catalog');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MI FORMACIÓN
        </Text>

        <Text style={styles.title}>
          Mis cursos
        </Text>

        <Text style={styles.description}>
          Aquí podrás consultar los cursos que hayas
          adquirido o en los que estés inscrito.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            Cursos
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            En progreso
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            —
          </Text>

          <Text style={styles.summaryLabel}>
            Finalizados
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>
          TUS CURSOS
        </Text>

        <Text style={styles.sectionTitle}>
          Continúa aprendiendo
        </Text>
      </View>

      <EmptyState
        icon="C"
        title="Tus cursos aparecerán aquí"
        description="Cuando conectemos tu sesión, esta pantalla mostrará automáticamente los cursos relacionados con tu cuenta."
        actionLabel="Explorar catálogo"
        onAction={goToCatalog}
        actionVariant="accent"
        variant="large"
      />

      <InfoCard
        icon="i"
        title="¿Qué podrás consultar aquí?"
        description="Estado del curso, fechas, información general y acceso al detalle de cada capacitación."
      />

      <AppFooter />
    </ScrollView>
  );
}