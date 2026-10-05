import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {styles} from './ActionCard.styles';

type ActionCardProps = {
  number: string;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
};

export function ActionCard({
  number,
  title,
  description,
  buttonText,
  onPress,
}: ActionCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
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

      <Pressable
        style={({pressed}) => [
          styles.button,
          pressed && styles.pressed,
        ]}
        onPress={onPress}>
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>

        <Text style={styles.buttonArrow}>
          →
        </Text>
      </Pressable>
    </View>
  );
}