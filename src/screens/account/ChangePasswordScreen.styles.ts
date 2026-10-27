import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 10,
  },
  helper: { fontSize: 14, lineHeight: 23, color: colors.textSecondary },
  errorBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.surface,
  },
  error: { fontSize: 15, lineHeight: 23, color: colors.error, fontWeight: '700' },
  processing: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
