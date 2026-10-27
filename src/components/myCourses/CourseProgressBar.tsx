import React from 'react';
import {Text, View} from 'react-native';
import {CourseProgress} from '../../models/Progress';
import {styles} from './CourseProgressBar.styles';

type Props = {
  progress: Pick<
    CourseProgress,
    'completedSessions' | 'totalSessions' | 'progressPercentage'
  >;
  testID?: string;
};

function clamp(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

// El avance lo calcula el servidor a partir de las sesiones del curso.
export function CourseProgressBar({progress, testID}: Props): React.JSX.Element {
  const percentage = clamp(progress.progressPercentage);
  const rounded = Math.round(percentage);

  return (
    <View
      accessible
      accessibilityLabel={`Avance del curso: ${rounded}%, ${progress.completedSessions} de ${progress.totalSessions} sesiones`}
      style={styles.box}
      testID={testID}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Avance del curso</Text>
        <Text style={styles.value}>{rounded}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${percentage}%`}]} />
      </View>
      <Text style={styles.detail}>
        {progress.completedSessions} de {progress.totalSessions} sesiones
      </Text>
    </View>
  );
}
