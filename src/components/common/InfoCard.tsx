import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './InfoCard.styles';

type InfoCardProps = {
  icon: string;
  title: string;
  description: string;
  variant?: 'default' | 'dashboard';
};

export function InfoCard({
  icon,
  title,
  description,
  variant = 'default',
}: InfoCardProps): React.JSX.Element {
  const isDashboard =
    variant === 'dashboard';

  return (
    <View
      style={[
        styles.container,
        isDashboard &&
          styles.dashboardContainer,
      ]}>
      <View
        style={[
          styles.icon,
          isDashboard &&
            styles.dashboardIcon,
        ]}>
        <Text
          style={[
            styles.iconText,
            isDashboard &&
              styles.dashboardIconText,
          ]}>
          {icon}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isDashboard &&
              styles.dashboardTitle,
          ]}>
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            isDashboard &&
              styles.dashboardDescription,
          ]}>
          {description}
        </Text>
      </View>
    </View>
  );
}