import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    marginBottom: 4,
  },

  number: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  numberText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },

  content: {
    flex: 1,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
});