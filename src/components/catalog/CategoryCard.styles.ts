import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 11,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardExpanded: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  stripe: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
  },

  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  name: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  nameExpanded: {
    color: colors.surface,
  },

  count: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },

  countExpanded: {
    color: colors.primarySoft,
  },

  button: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  buttonExpanded: {
    backgroundColor: colors.accent,
  },

  buttonText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.75,
  },
});