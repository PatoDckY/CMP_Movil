import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './AccountPresentation.styles';

export function InstitutionalHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View accessible={false} style={styles.brandMark}>
          <Text
            accessible={false}
            allowFontScaling={false}
            style={styles.brandInitials}
          >
            CMP
          </Text>
        </View>
        <Text style={styles.institution}>Centro Médico Pichardo</Text>
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={[styles.description, styles.headerDescription]}>
        {description}
      </Text>
    </View>
  );
}

export function AccountSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View accessible={false} style={styles.sectionAccent} />
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          {title}
        </Text>
      </View>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {children ? <View style={styles.sectionContent}>{children}</View> : null}
    </View>
  );
}

export function AccountAction({
  title,
  description,
  onPress,
  badge,
}: {
  title: string;
  description: string;
  onPress: () => void;
  badge?: number;
}): React.JSX.Element {
  const hasBadge = badge !== undefined && badge > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        hasBadge ? `${title}, ${badge} sin leer` : title
      }
      accessibilityHint={description}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      {hasBadge ? (
        <View accessible={false} style={styles.badge}>
          <Text accessible={false} allowFontScaling={false} style={styles.badgeText}>
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      ) : null}
      <View accessible={false} style={styles.actionIndicator}>
        <Text accessible={false} allowFontScaling={false} style={styles.arrow}>
          ›
        </Text>
      </View>
    </Pressable>
  );
}
