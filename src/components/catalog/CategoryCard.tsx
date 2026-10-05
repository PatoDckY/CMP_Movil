import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {styles} from './CategoryCard.styles';

type CategoryCardProps = {
  title: string;
  count: number;
  expanded: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function CategoryCard({
  title,
  count,
  expanded,
  disabled = false,
  onPress,
}: CategoryCardProps): React.JSX.Element {
  return (
    <Pressable
      disabled={disabled}
      style={({pressed}) => [
        styles.card,
        expanded && styles.cardExpanded,
        pressed &&
          !disabled &&
          styles.pressed,
      ]}
      onPress={onPress}>
      <View style={styles.stripe} />

      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            expanded &&
              styles.nameExpanded,
          ]}>
          {title}
        </Text>

        <Text
          style={[
            styles.count,
            expanded &&
              styles.countExpanded,
          ]}>
          {count}{' '}
          {count === 1
            ? 'curso disponible'
            : 'cursos disponibles'}
        </Text>
      </View>

      {!disabled && (
        <View
          style={[
            styles.button,
            expanded &&
              styles.buttonExpanded,
          ]}>
          <Text style={styles.buttonText}>
            {expanded ? '−' : '+'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}