import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './StepCard.styles';

type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

export function StepCard({
  number,
  title,
  description,
}: StepCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.number}>
        <Text style={styles.numberText}>
          {number}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}