import React from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../../theme/colors';
import { styles } from './PasswordField.styles';

type PasswordFieldProps = Pick<
  TextInputProps,
  | 'editable'
  | 'maxLength'
  | 'accessibilityLabel'
  | 'autoComplete'
  | 'textContentType'
> & {
  value: string;
  onChangeText: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  size?: 'default' | 'comfortable';
};

export function PasswordField({
  value,
  onChangeText,
  show,
  onToggle,
  placeholder,
  editable = true,
  maxLength,
  accessibilityLabel,
  autoComplete,
  textContentType,
  size = 'default',
}: PasswordFieldProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.container,
        size === 'comfortable' && styles.comfortableContainer,
      ]}
    >
      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        editable={editable}
        maxLength={maxLength}
        autoComplete={autoComplete}
        textContentType={textContentType}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
        style={[
          styles.input,
          size === 'comfortable' && styles.comfortableInput,
        ]}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        accessibilityState={{ disabled: !editable }}
        disabled={!editable}
        style={[
          styles.showButton,
          size === 'comfortable' && styles.comfortableShowButton,
        ]}
        onPress={onToggle}
      >
        <Text
          style={[
            styles.showButtonText,
            size === 'comfortable' && styles.comfortableToggle,
          ]}
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </Text>
      </Pressable>
    </View>
  );
}
