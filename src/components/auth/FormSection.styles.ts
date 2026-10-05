import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    padding: 18,
    marginBottom: 14,
  },

  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 15,
    marginBottom: 18,
  },

  number: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  numberText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
  },

  headingContent: {
    flex: 1,
  },

  title: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
});