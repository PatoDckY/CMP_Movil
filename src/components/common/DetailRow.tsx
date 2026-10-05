import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './DetailRow.styles';

type DetailRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

export function DetailRow({
  label,
  value,
  last = false,
}: DetailRowProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.row,
        last && styles.lastRow,
      ]}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}   