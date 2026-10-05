import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  group: {
    marginBottom: 15,
  },

  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },
});