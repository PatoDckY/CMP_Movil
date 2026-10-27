import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './SectionHeader.styles';

type SectionHeaderProps = {
  number: string;
  eyebrow: string;
  title: string;
};

export function SectionHeader({
  number,
  eyebrow,
  title,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.number}>
        <Text style={styles.numberText}>
          {number}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
}