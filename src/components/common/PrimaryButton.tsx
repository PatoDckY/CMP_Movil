import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './PrimaryButton.styles';

type ButtonVariant = 'primary' | 'accent' | 'outline' | 'dangerOutline';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  helper?: string;
  showArrow?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: 'default' | 'comfortable';
};

export function PrimaryButton({
  label,
  onPress,
  helper,
  showArrow = false,
  disabled = false,
  variant = 'primary',
  size = 'default',
}: PrimaryButtonProps): React.JSX.Element {
  const isAccent = variant === 'accent';

  const isDanger = variant === 'dangerOutline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'comfortable' && styles.comfortableButton,
        variant === 'outline' && styles.outlineButton,
        isAccent && styles.accentButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={[styles.content, !showArrow && styles.centerContent]}>
        <Text
          style={[
            styles.label,
            size === 'comfortable' && styles.comfortableLabel,
            variant === 'outline' && styles.outlineLabel,
            isAccent && styles.accentLabel,
            isDanger && styles.dangerLabel,
          ]}
        >
          {label}
        </Text>

        {helper ? (
          <Text
            style={[
              styles.helper,
              variant === 'outline' && styles.outlineLabel,
              isAccent && styles.accentHelper,
              isDanger && styles.dangerHelper,
            ]}
          >
            {helper}
          </Text>
        ) : null}
      </View>

      {showArrow ? (
        <Text
          style={[
            styles.arrow,
            variant === 'outline' && styles.outlineLabel,
            isAccent && styles.accentArrow,
            isDanger && styles.dangerArrow,
          ]}
        >
          →
        </Text>
      ) : null}
    </Pressable>
  );
}
