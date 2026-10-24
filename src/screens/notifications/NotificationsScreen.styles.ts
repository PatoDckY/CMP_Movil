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
    flexGrow: 1,
  },

  summary: {
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  itemUnread: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },

  pressed: {
    opacity: 0.8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    backgroundColor: 'transparent',
  },

  dotUnread: {
    backgroundColor: colors.primary,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },

  itemTitleUnread: {
    fontWeight: '900',
    color: colors.primary,
  },

  itemMessage: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  itemMeta: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
  },

  centered: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },

  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  errorCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.error,
  },

  errorDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  inlineError: {
    marginBottom: 12,
    fontSize: 13,
    color: colors.error,
  },

  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  retryText: {
    color: colors.surface,
    fontWeight: '900',
  },
});
