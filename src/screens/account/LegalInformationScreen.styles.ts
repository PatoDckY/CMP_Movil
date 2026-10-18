import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  notice: {
    padding: 20,
    gap: 10,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  noticeTitle: { fontSize: 17, fontWeight: '900', color: colors.primary },
  text: { fontSize: 16, lineHeight: 25, color: colors.text },
  helper: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});
