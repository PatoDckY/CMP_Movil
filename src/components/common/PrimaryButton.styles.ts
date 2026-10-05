import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  accentButton: {
    backgroundColor: colors.accent,
  },

  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
  },

  content: {
    flex: 1,
  },

  centerContent: {
    alignItems: 'center',
  },

  label: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },

  accentLabel: {
    color: colors.primary,
  },

  dangerLabel: {
    color: colors.error,
  },

  helper: {
    color: colors.primarySoft,
    fontSize: 8,
    marginTop: 2,
  },

  accentHelper: {
    color: colors.primary,
    opacity: 0.75,
  },

  dangerHelper: {
    color: colors.error,
    opacity: 0.75,
  },

  arrow: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 12,
  },

  accentArrow: {
    color: colors.primary,
  },

  dangerArrow: {
    color: colors.error,
  },

  disabled: {
    opacity: 0.45,
  },

  pressed: {
    opacity: 0.75,
  },
});