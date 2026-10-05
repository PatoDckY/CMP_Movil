import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 46,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    marginHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  buttonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  indicator: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },

  indicatorSelected: {
    borderColor: colors.accent,
  },

  indicatorInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  text: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },

  textSelected: {
    color: colors.surface,
  },

  pressed: {
    opacity: 0.75,
  },
});