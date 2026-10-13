
import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
    overflow: 'hidden',
  },

  heroCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    top: -65,
    right: -45,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 18,
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
  },

  formCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
  },

  formTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  formDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 24,
  },

  label: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 9,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 13,
    marginBottom: 16,
  },

  errorText: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    minHeight: 54,
    paddingHorizontal: 17,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  primaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    flexShrink: 1,
  },

  primaryButtonArrow: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginLeft: 12,
  },

  loadingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  disabledButton: {
    opacity: 0.6,
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 13,
    marginTop: 17,
  },

  securityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 10,
  },

  securityText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
  },

  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 12,
    marginTop: 18,
  },

  backButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  successCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },

  successIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  successIconText: {
    color: '#166534',
    fontSize: 34,
    fontWeight: '900',
  },

  successTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  successDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
  },

  successInformation: {
    alignSelf: 'stretch',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 18,
    marginTop: 22,
    gap: 11,
  },

  successInformationTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 3,
  },

  successInformationText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 20,
  },

  spamNotice: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginVertical: 20,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 30,
  },

  pressed: {
    opacity: 0.75,
  },
});
