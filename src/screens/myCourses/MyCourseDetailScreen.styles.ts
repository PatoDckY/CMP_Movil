
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

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 16,
    textAlign: 'center',
  },

  loadingDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
    marginBottom: 18,
    textAlign: 'center',
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
  },

  actionContainer: {
    width: '100%',
    marginTop: 10,
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
    fontSize: 27,
    fontWeight: '900',
    marginTop: 4,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 19,
    minHeight: 175,
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  heroBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 9,
  },

  categoryBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '55%',
  },

  categoryText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '800',
  },

  situationBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '45%',
  },

  situationText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 29,
    marginTop: 25,
  },

  heroSubtitle: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  enrollmentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginBottom: 15,
  },

  enrollmentText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
  },

  bodyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 10,
  },

  participantPanel: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    marginTop: 13,
  },

  participantLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  participantName: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 6,
  },

  participantContact: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 7,
    lineHeight: 18,
  },

  progressRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  progressCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },

  progressLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  progressValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  progressTrack: {
    backgroundColor: colors.border,
    borderRadius: 6,
    height: 8,
    overflow: 'hidden',
  },

  progressFill: {
    backgroundColor: colors.primary,
    height: '100%',
    borderRadius: 6,
  },

  attendanceFill: {
    backgroundColor: colors.success,
    height: '100%',
    borderRadius: 6,
  },

  academicPanel: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },

  academicLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },

  academicValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 5,
  },

  sessionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },

  sessionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  sessionNumber: {
    backgroundColor: colors.primarySoft,
    borderRadius: 11,
    height: 37,
    width: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sessionNumberText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 14,
  },

  sessionInformation: {
    flex: 1,
  },

  sessionTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
  },

  sessionStatus: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 5,
  },

  sessionLine: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 9,
  },

  attendancePanel: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },

  attendanceTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  attendanceText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },

  virtualButton: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    paddingHorizontal: 12,
  },

  virtualButtonText: {
    color: colors.surface,
    fontWeight: '900',
    fontSize: 12,
  },

  emptySessions: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 17,
    marginTop: 12,
  },

  emptySessionsText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
  },

  refreshButton: {
    alignSelf: 'center',
    padding: 13,
    marginTop: 4,
    marginBottom: 12,
  },

  refreshText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  footerButton: {
    marginTop: 6,
    marginBottom: 15,
  },
});
