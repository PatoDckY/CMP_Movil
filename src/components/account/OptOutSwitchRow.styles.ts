import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    padding: 14,
    borderRadius: 13,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '900', color: colors.primary },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: 5,
  },
});
