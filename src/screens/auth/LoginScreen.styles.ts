import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 120,
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
  },

  heroCircle: {
    position: 'absolute',
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor: colors.primaryLight,
    right: -45,
    top: -50,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 15,
  },

  heroText: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: '90%',
  },

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },

  formTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  formDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 20,
  },

  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    height: 50,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 14,
  },

  showButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  showButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },

  loginButton: {
    minHeight: 51,
    backgroundColor: colors.accent,
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loginButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  loginArrow: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '800',
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 11,
    padding: 11,
    marginTop: 14,
  },

  securityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 8,
  },

  securityText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
  },

  registerCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
  },

  registerEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  registerTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },

  registerDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  registerButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginTop: 14,
  },

  registerButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },

  homeButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  homeButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.75,
  },
});