import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  homeFooter: {
    marginTop: 0,
    paddingTop: 4,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeFooterLogo: {
    marginBottom: 9,
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  homeFooterLogoText: {
    fontSize: 12,
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },

  homeFooterTitle: {
    fontSize: 12,
    marginTop: 0,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 3,
  },

  homeFooterText: {
    fontSize: 9,
  },
});