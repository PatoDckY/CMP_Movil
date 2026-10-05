import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';
import {styles} from './FormField.styles';

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({
  label,
  ...props
}: FormFieldProps): React.JSX.Element {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor={
          colors.textSecondary
        }
        style={styles.input}
      />
    </View>
  );
}