import React from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {colors} from '../../theme/colors';
import {styles} from './PasswordField.styles';

type PasswordFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
};

export function PasswordField({
  value,
  onChangeText,
  show,
  onToggle,
  placeholder,
}: PasswordFieldProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable
        style={styles.showButton}
        onPress={onToggle}>
        <Text style={styles.showButtonText}>
          {show ? 'Ocultar' : 'Mostrar'}
        </Text>
      </Pressable>
    </View>
  );
}