import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  largeContainer: {
    borderRadius: 22,
  },

  icon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  largeIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
  },

  iconText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  largeIconText: {
    fontSize: 22,
  },

  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 13,
    textAlign: 'center',
  },

  largeTitle: {
    fontSize: 18,
    marginTop: 16,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },

  largeDescription: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },

  action: {
    width: '100%',
    marginTop: 20,
  },
});