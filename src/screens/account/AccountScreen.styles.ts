import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 42,
  },

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
  },

  profileEyebrow: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  profileName: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },

  profileEmail: {
    color: colors.primarySoft,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 17,
    marginTop: 14,
  },

  optionButton: {
    minHeight: 67,
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 13,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionContent: {
    flex: 1,
    paddingRight: 10,
  },

  optionTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  optionDescription: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },

  optionArrow: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginLeft: 10,
  },

  logoutContainer: {
    marginTop: 18,
  },

  logoutHelper: {
    color: colors.textSecondary,
    fontSize: 8,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },

  pressed: {
    opacity: 0.75,
  },
});