import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 42,
  },

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    maxWidth: '90%',
  },

  accountButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 12,
  },

  accountButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 30,
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: colors.primaryLight,
    right: -50,
    top: -55,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: colors.primaryLight,
    left: -35,
    bottom: -45,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: 16,
    maxWidth: '90%',
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    maxWidth: '94%',
  },

  heroButton: {
    minHeight: 50,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },

  heroButtonArrow: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 15,
  },

  cards: {
    marginBottom: 4,
  },

  accountCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 19,
    padding: 17,
    marginTop: 14,
  },

  accountEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  accountTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },

  accountDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  profileButton: {
    minHeight: 43,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 13,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  profileButtonArrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.75,
  },
});