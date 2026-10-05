import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },

  showButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  showButtonText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },
});