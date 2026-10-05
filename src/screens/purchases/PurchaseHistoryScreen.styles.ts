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

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 27,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryNumber: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '900',
  },

  summaryLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },
});