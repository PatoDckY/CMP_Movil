
import {
  StyleSheet,
} from 'react-native';

import {
  colors,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 48,
  },

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  title: {
    color: colors.primary,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 7,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },

  card: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 18,
  },

  readonlyLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  readonlyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor:
      colors.background,
    padding: 14,
  },

  readonlyText: {
    color: colors.text,
    fontSize: 13,
  },

  helper: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },

  fieldLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 10,
  },

  sexOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },

  sexOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor:
      colors.background,
  },

  sexOptionSelected: {
    borderColor: colors.primary,
    backgroundColor:
      colors.primarySoft,
  },

  sexOptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  sexOptionTextSelected: {
    color: colors.primary,
  },

  errorBox: {
    marginTop: 16,
    padding: 13,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 18,
  },

  saveContainer: {
    marginTop: 20,
  },

  notice: {
    backgroundColor:
      colors.primarySoft,
    borderRadius: 16,
    padding: 16,
  },

  noticeTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  noticeText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor:
      colors.background,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 15,
    textAlign: 'center',
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  errorDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },

  retryContainer: {
    width: '100%',
    marginTop: 20,
  },
});
