import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  box: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  value: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  track: {
    width: '100%',
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
