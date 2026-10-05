import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import {styles} from './FormSection.styles';

type FormSectionProps = {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function FormSection({
  number,
  title,
  description,
  children,
}: FormSectionProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.number}>
          <Text style={styles.numberText}>
            {number}
          </Text>
        </View>

        <View style={styles.headingContent}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}