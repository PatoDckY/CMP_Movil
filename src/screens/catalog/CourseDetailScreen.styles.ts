import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingBottom: 42,
  },

  hero: {
    width: '100%',
    height: 220,
    backgroundColor: colors.primary,
  },

  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primarySoft,
  },

  heroPlaceholder: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primaryLight,
    right: -55,
    top: -80,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight,
    left: -40,
    bottom: -45,
  },

  placeholderLogo: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderLogoText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },

  placeholderText: {
    color: colors.primarySoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  categoryBadge: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginRight: 7,
    marginBottom: 7,
  },

  categoryBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },

  modalityBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 7,
  },

  modalityBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },

  title: {
    color: colors.primary,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    paddingHorizontal: 20,
    marginTop: 8,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 20,
    marginTop: 9,
  },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 17,
    paddingHorizontal: 20,
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  price: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 5,
  },

  availableNumber: {
    color: colors.surface,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  availableLabel: {
    color: colors.primarySoft,
    fontSize: 9,
    marginTop: 1,
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 18,
  },

  purchaseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 18,
  },

  purchaseTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  purchaseIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  purchaseIconText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  purchaseInfo: {
    flex: 1,
  },

  purchaseEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  purchaseTitle: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  purchaseDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  purchaseButton: {
    minHeight: 56,
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingHorizontal: 16,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  purchaseButtonContent: {
    flex: 1,
    paddingRight: 10,
  },

  purchaseButtonPressed: {
    opacity: 0.75,
  },

  purchaseButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  purchaseButtonHelper: {
    color: colors.primary,
    fontSize: 8,
    marginTop: 2,
    opacity: 0.75,
  },

  purchaseButtonArrow: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  accountDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
  },

  accountDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  accountDividerText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    marginHorizontal: 10,
  },

  createAccountButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createAccountButtonPressed: {
    opacity: 0.65,
  },

  createAccountText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 17,
  },

  dateCards: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 12,
  },

  dateCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 13,
    marginHorizontal: 4,
  },

  dateLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
  },

  dateValue: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 5,
  },

  scheduleBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    padding: 13,
    marginTop: 9,
  },

  scheduleLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
  },

  scheduleValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  capacityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 17,
  },

  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  capacityEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  capacityTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },

  capacityBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },

  capacityBadgeNumber: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  capacityBadgeText: {
    color: colors.textSecondary,
    fontSize: 8,
  },

  progressBackground: {
    height: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 17,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },

  capacityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  capacityText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },

  publicNotice: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 15,
  },

  publicNoticeIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  publicNoticeIconText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },

  publicNoticeContent: {
    flex: 1,
  },

  publicNoticeTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  publicNoticeText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 3,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  loadingBox: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 17,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
