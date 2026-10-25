import {StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  footer: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export const markdownStyles = StyleSheet.create({
  body: {fontSize: 15, lineHeight: 23, color: colors.text},
  heading1: {fontSize: 22, fontWeight: '900', color: colors.primary, marginBottom: 6},
  heading2: {fontSize: 18, fontWeight: '900', color: colors.primary, marginTop: 14, marginBottom: 4},
  heading3: {fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 10},
  strong: {fontWeight: '900'},
  link: {color: colors.primary},
});
