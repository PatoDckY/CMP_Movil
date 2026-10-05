import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {Course} from '../../models/Course';
import {styles} from './CourseCard.styles';

type CourseCardProps = {
  course: Course;
  onPress: () => void;
};

export function CourseCard({
  course,
  onPress,
}: CourseCardProps): React.JSX.Element {
  const occupied =
    course.occupiedCapacity ?? 0;

  const available = Math.max(
    course.maxCapacity - occupied,
    0,
  );

  return (
    <Pressable
      style={({pressed}) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.modalityBadge}>
          <Text style={styles.modalityText}>
            {course.modalityName ?? 'Curso'}
          </Text>
        </View>

        <Text style={styles.price}>
          {formatPrice(course.cost)}
        </Text>
      </View>

      <Text style={styles.title}>
        {course.title}
      </Text>

      <Text
        style={styles.description}
        numberOfLines={2}>
        {course.description ??
          'Consulta la información completa de este curso.'}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>
            INSTRUCTOR
          </Text>

          <Text
            style={styles.detailValue}
            numberOfLines={1}>
            {course.instructorName ??
              'Por confirmar'}
          </Text>
        </View>

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>
            INICIO
          </Text>

          <Text style={styles.detailValue}>
            {formatDate(course.startDate)}
          </Text>
        </View>
      </View>

      <View style={styles.capacityRow}>
        <Text style={styles.capacityText}>
          {available > 0
            ? `${available} lugares disponibles`
            : 'Sin lugares disponibles'}
        </Text>
      </View>

      <View style={styles.action}>
        <Text style={styles.actionText}>
          Ver información
        </Text>

        <Text style={styles.actionArrow}>
          →
        </Text>
      </View>
    </Pressable>
  );
}

function formatPrice(
  cost: string | null,
): string {
  if (!cost) {
    return 'Sin costo';
  }

  const value = Number(cost);

  if (
    Number.isFinite(value) &&
    value <= 0
  ) {
    return 'Sin costo';
  }

  if (!Number.isFinite(value)) {
    return `$${cost}`;
  }

  return value.toLocaleString(
    'es-MX',
    {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );
}

function formatDate(
  value: string,
): string {
  const datePart =
    value.split('T')[0];

  const parts =
    datePart.split('-');

  if (parts.length !== 3) {
    return value;
  }

  const day = Number(parts[2]);
  const month = Number(parts[1]);
  const year = Number(parts[0]);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
}