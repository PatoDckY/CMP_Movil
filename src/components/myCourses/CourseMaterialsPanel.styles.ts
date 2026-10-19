import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.primarySoft,
    borderWidth: 1,
    borderLeftColor: colors.accent,
    borderLeftWidth: 4,
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    flexShrink: 1,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    flexShrink: 1,
  },
});
