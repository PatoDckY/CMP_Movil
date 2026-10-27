import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },

  number: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  numberText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  content: {
    flex: 1,
  },

  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});