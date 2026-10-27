import React from 'react';
import {
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import {styles} from './AppFooter.styles';

type AppFooterProps = {
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'home';
};

export function AppFooter({
  style,
  variant = 'default',
}: AppFooterProps): React.JSX.Element {
  const isHome = variant === 'home';

  return (
    <View
      style={[
        styles.footer,
        isHome && styles.homeFooter,
        style,
      ]}>
      <View
        style={[
          styles.footerLogo,
          isHome && styles.homeFooterLogo,
        ]}>
        <Text
          style={[
            styles.footerLogoText,
            isHome && styles.homeFooterLogoText,
          ]}>
          CMP
        </Text>
      </View>

      <Text
        style={[
          styles.footerTitle,
          isHome && styles.homeFooterTitle,
        ]}>
        Centro Médico Pichardo
      </Text>

      <Text
        style={[
          styles.footerText,
          isHome && styles.homeFooterText,
        ]}>
        Sistema Integral de Gestión Médica
      </Text>
    </View>
  );
}