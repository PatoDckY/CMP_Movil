import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 120,
  },
  otpContainer: {
    marginTop: 16,
  },

  otpHelper: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: -8,
  },

  disabled: {
    opacity: 0.55,
  },
  
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
  },

  heroCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    right: -60,
    top: -65,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  heroBadge: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 18,
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: '92%',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 22,
  },

  progressItem: {
    alignItems: 'center',
  },

  progressNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressNumberText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  progressLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 5,
  },

  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primaryLight,
    marginTop: 14,
    marginHorizontal: 7,
  },

  smallField: {
    maxWidth: 130,
  },

  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },

  genderRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },

  infoNotice: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    padding: 13,
  },

  infoNoticeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoNoticeIconText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },

  infoNoticeContent: {
    flex: 1,
  },

  infoNoticeTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  infoNoticeText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  securityPanel: {
    backgroundColor: colors.primarySoft,
    borderRadius: 15,
    padding: 14,
    marginBottom: 18,
  },

  securityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  securityInfo: {
    flex: 1,
    paddingRight: 10,
  },

  securityTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  securitySubtitle: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  securityBadge: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  securityBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
  },

  strengthBar: {
    flexDirection: 'row',
    marginTop: 13,
    marginHorizontal: -2,
  },

  strengthSegment: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginHorizontal: 2,
  },

  strengthSegmentActive: {
    backgroundColor: colors.accent,
  },

  requirements: {
    marginTop: 12,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  requirementIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  requirementIconCompleted: {
    backgroundColor: colors.primary,
  },

  requirementIconText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '900',
  },

  requirementIconTextCompleted: {
    color: colors.accent,
  },

  requirementText: {
    color: colors.textSecondary,
    fontSize: 10,
  },

  requirementTextCompleted: {
    color: colors.primary,
    fontWeight: '700',
  },

  matchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    padding: 10,
    marginTop: -5,
  },

  matchBoxSuccess: {
    backgroundColor: colors.primarySoft,
  },

  matchBoxError: {
    backgroundColor: colors.accentSoft,
  },

  matchIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  matchIconSuccess: {
    backgroundColor: colors.primary,
  },

  matchIconText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  matchIconTextSuccess: {
    color: colors.accent,
  },

  matchText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  matchTextSuccess: {
    color: colors.primary,
  },

  termsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 15,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
  },

  checkboxCheck: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },

  termsContent: {
    flex: 1,
  },

  termsTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  termsText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  createButton: {
    minHeight: 54,
    backgroundColor: colors.accent,
    borderRadius: 14,
    marginTop: 15,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  createButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  createButtonArrow: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  loginCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 17,
    marginTop: 15,
  },

  loginEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  loginTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  loginDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  loginButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
  },

  loginButtonText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '800',
  },

  homeButton: {
    alignItems: 'center',
    paddingVertical: 19,
  },

  homeButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  footer: {
    alignItems: 'center',
    marginTop: 4,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.75,
  },
});