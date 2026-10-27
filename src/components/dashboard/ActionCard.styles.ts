import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: 16,
    marginBottom: 12,
  },

  top: {
    flexDirection: 'row',
  },

  number: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  numberText: {
    color: colors.accent,
    fontSize: 9,
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
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  button: {
    minHeight: 42,
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 13,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  buttonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  buttonArrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.75,
  },
});