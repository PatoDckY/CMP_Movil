import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  logoText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },

  brandTop: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  brandName: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  systemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  systemDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  systemText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 34,
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primaryLight,
    right: -55,
    top: -65,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    right: 55,
    bottom: -55,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '900',
    marginTop: 18,
    maxWidth: '90%',
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: '94%',
  },

  heroButton: {
    minHeight: 52,
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingHorizontal: 17,
    marginTop: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  heroButtonArrow: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: '800',
  },

  sectionHeader: {
    marginBottom: 17,
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    marginTop: 5,
  },

  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  stepsContainer: {
    marginBottom: 34,
  },

  stepConnector: {
    width: 2,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 21,
  },

  benefitsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  benefitCard: {
    flex: 1,
    minHeight: 175,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 15,
  },

  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  benefitIconAccent: {
    backgroundColor: colors.accentSoft,
  },

  benefitIconText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  benefitTitle: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },

  benefitDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },

  fullBenefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 34,
  },

  fullBenefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  fullBenefitIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  fullBenefitContent: {
    flex: 1,
  },

  fullBenefitTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  fullBenefitDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  accountCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 30,
  },

  accountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  accountBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  accountTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 15,
  },

  accountDescription: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  loginButton: {
    minHeight: 49,
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  registerQuestion: {
    color: colors.primarySoft,
    fontSize: 11,
    marginRight: 5,
  },

  registerLink: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 4,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.75,
  },
});