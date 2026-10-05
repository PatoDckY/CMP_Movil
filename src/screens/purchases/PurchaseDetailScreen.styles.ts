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

  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  purchaseIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  purchaseIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  purchaseHeaderInfo: {
    flex: 1,
  },

  purchaseLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  purchaseNumber: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  purchaseStatus: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '700',
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

  emptyCourses: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },

  emptyCoursesIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCoursesIconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  emptyCoursesTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 13,
  },

  emptyCoursesText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  totalCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 18,
    padding: 17,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  totalValue: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },

  totalIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalIconText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
  },

  backButtonContainer: {
    marginTop: 14,
  },
});