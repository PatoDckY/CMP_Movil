import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    paddingBottom: 40,
  },

  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 22,
    overflow: 'hidden',
  },

  heroCircle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primaryLight,
    right: -65,
    top: -70,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    color: colors.surface,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 7,
    maxWidth: '90%',
  },

  subtitle: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: '94%',
  },

  searchBox: {
    minHeight: 52,
    backgroundColor: colors.surface,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },

  searchSymbol: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchSymbolText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '800',
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 10,
  },

  clearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 22,
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  statNumber: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: colors.primarySoft,
    fontSize: 10,
    marginLeft: 5,
  },

  statDivider: {
    width: 1,
    height: 19,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 16,
  },

  catalogIntro: {
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 15,
  },

  catalogIntroTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },

  catalogIntroText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  searchResultInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  searchResultText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: 4,
  },

  searchResultValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  emptySearch: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 26,
    alignItems: 'center',
  },

  emptySearchIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySearchIconText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
  },

  emptySearchTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 13,
  },

  emptySearchText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 6,
  },

  clearSearchLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 14,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  loadingContainer: {
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

  centerMessage: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 18,
  },

  retryButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.75,
  },
});