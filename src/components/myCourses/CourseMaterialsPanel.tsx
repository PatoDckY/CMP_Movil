import React, { useEffect } from 'react';
import { ActivityIndicator, AppState, Linking, Text, View } from 'react-native';
import { PrimaryButton } from '../common/PrimaryButton';
import {
  courseMaterialsRepository,
  courseMaterialsSessionScope,
} from '../../config/dependencies';
import { useSession } from '../../session/SessionContext';
import { useCourseMaterialsViewModel } from '../../viewmodels/myCourses/useCourseMaterialsViewModel';
import { styles } from './CourseMaterialsPanel.styles';

const openLink = (url: string) => Linking.openURL(url);
const messages = {
  no_iniciado: 'Los materiales estarán disponibles cuando comience el curso',
  finalizado: 'El periodo de acceso a materiales ha finalizado',
  sin_materiales: 'Aún no hay materiales disponibles',
  disponible: 'Consulta los materiales de tu curso en Google Drive.',
};

export function CourseMaterialsPanel({
  enrollmentId,
  courseId,
}: {
  enrollmentId: number;
  courseId: number;
}) {
  const { user } = useSession();
  const vm = useCourseMaterialsViewModel(
    courseMaterialsRepository,
    enrollmentId,
    courseId,
    user?.id ?? null,
    openLink,
    courseMaterialsSessionScope,
  );
  const { reload, cancel } = vm;
  useEffect(() => {
    reload();
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        reload();
      } else {
        cancel();
      }
    });
    return () => {
      listener.remove();
      cancel();
    };
  }, [reload, cancel]);

  return (
    <View style={styles.card} testID="course-materials-card">
      <Text style={styles.eyebrow}>RECURSOS ACADÉMICOS</Text>
      <Text accessibilityRole="header" style={styles.title}>
        Materiales del curso
      </Text>
      <Text
        accessibilityRole={vm.error ? 'alert' : undefined}
        style={styles.message}
      >
        {vm.error ??
          (vm.status
            ? messages[vm.status]
            : 'Consultando disponibilidad de materiales…')}
      </Text>
      {vm.busy ? (
        <ActivityIndicator accessibilityLabel="Consultando materiales" />
      ) : vm.status === 'disponible' ? (
        <PrimaryButton
          label="Ver materiales del curso"
          size="comfortable"
          onPress={vm.openMaterials}
        />
      ) : (
        <PrimaryButton
          label={vm.error ? 'Reintentar materiales' : 'Actualizar materiales'}
          size="comfortable"
          variant="outline"
          onPress={reload}
        />
      )}
    </View>
  );
}
