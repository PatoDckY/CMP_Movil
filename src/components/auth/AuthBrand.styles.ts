import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  logoText: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 15,
  },

  brandTop: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  brandName: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
});