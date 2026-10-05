import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {styles} from './GenderButton.styles';

type GenderButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function GenderButton({
  label,
  selected,
  onPress,
}: GenderButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        selected && styles.buttonSelected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.indicator,
          selected && styles.indicatorSelected,
        ]}>
        {selected && (
          <View style={styles.indicatorInner} />
        )}
      </View>

      <Text
        style={[
          styles.text,
          selected && styles.textSelected,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}