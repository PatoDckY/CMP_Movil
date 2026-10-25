import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  title: {color: colors.primary, fontSize: 13, fontWeight: '900'},
  summary: {color: colors.text, fontSize: 12, lineHeight: 18},
  link: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
