import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 23, fontWeight: '900', color: colors.accent },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900', color: colors.primary },
  profileEmail: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginTop: 5,
  },
  sessionNote: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    gap: 6,
  },
  noteTitle: { fontSize: 16, fontWeight: '900', color: colors.primary },
  text: { fontSize: 16, lineHeight: 25, color: colors.text },
  helper: { fontSize: 14, lineHeight: 22, color: colors.textSecondary },
  management: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
});
