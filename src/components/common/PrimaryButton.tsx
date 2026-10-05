import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {styles} from './PrimaryButton.styles';

type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'dangerOutline';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  helper?: string;
  showArrow?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
};

export function PrimaryButton({
  label,
  onPress,
  helper,
  showArrow = false,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps): React.JSX.Element {
  const isAccent =
    variant === 'accent';

  const isDanger =
    variant === 'dangerOutline';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        isAccent && styles.accentButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabled,
        pressed &&
          !disabled &&
          styles.pressed,
      ]}>
      <View
        style={[
          styles.content,
          !showArrow &&
            styles.centerContent,
        ]}>
        <Text
          style={[
            styles.label,
            isAccent &&
              styles.accentLabel,
            isDanger &&
              styles.dangerLabel,
          ]}>
          {label}
        </Text>

        {helper ? (
          <Text
            style={[
              styles.helper,
              isAccent &&
                styles.accentHelper,
              isDanger &&
                styles.dangerHelper,
            ]}>
            {helper}
          </Text>
        ) : null}
      </View>

      {showArrow ? (
        <Text
          style={[
            styles.arrow,
            isAccent &&
              styles.accentArrow,
            isDanger &&
              styles.dangerArrow,
          ]}>
          →
        </Text>
      ) : null}
    </Pressable>
  );
}