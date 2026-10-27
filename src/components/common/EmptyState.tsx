import React from 'react';
import {Text, View} from 'react-native';

import {PrimaryButton} from './PrimaryButton';
import {styles} from './EmptyState.styles';

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'large';
  actionVariant?: 'primary' | 'accent';
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  actionVariant = 'primary',
}: EmptyStateProps): React.JSX.Element {
  const isLarge =
    variant === 'large';

  return (
    <View
      style={[
        styles.container,
        isLarge &&
          styles.largeContainer,
      ]}>
      <View
        style={[
          styles.icon,
          isLarge &&
            styles.largeIcon,
        ]}>
        <Text
          style={[
            styles.iconText,
            isLarge &&
              styles.largeIconText,
          ]}>
          {icon}
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          isLarge &&
            styles.largeTitle,
        ]}>
        {title}
      </Text>

      <Text
        style={[
          styles.description,
          isLarge &&
            styles.largeDescription,
        ]}>
        {description}
      </Text>

      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PrimaryButton
            label={actionLabel}
            onPress={onAction}
            variant={actionVariant}
            showArrow
          />
        </View>
      ) : null}
    </View>
  );
}