import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  value: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 4,
  },
});