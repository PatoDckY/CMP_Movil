
import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({

  whatsappWarning: {
    backgroundColor: colors.accentSoft,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 14,
    padding: 17,
    marginTop: 15,
  },

  whatsappWarningTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 26,
    textAlign: 'center',
  },

  whatsappWarningText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
  },


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

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  purchaseIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  purchaseIconText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  purchaseHeaderInfo: {
    flex: 1,
  },

  purchaseLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  purchaseNumber: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  purchaseStatus: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 5,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 17,
    marginTop: 14,
  },

  totalCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 18,
    padding: 17,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  totalValue: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },

  totalIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalIconText: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
  },

  totalInformation: {
    flex: 1,
    paddingRight: 12,
  },

  backButtonContainer: {
    marginTop: 18,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 25,
  },

  loadingTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },

  fullWidth: {
    width: '100%',
  },

  secondaryAction: {
    padding: 15,
  },

  secondaryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  refreshAction: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
  },

  refreshActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  observationsBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  smallHeading: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  bodyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  mutedText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
  },

  participantCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 13,
    marginTop: 11,
  },

  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  numberBadge: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  numberText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  participantInfo: {
    flex: 1,
  },

  participantName: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  participantStatus: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  personDetail: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  noticeContainer: {
    marginTop: 14,
  },

  bankCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
  },

  bankValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 7,
  },

  bankDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  clabeButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginTop: 8,
  },

  clabeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  copyHint: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 7,
  },

  helpText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },

  bankAmount: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 7,
  },

  folioBox: {
    backgroundColor: colors.accentSoft,
    borderRadius: 13,
    padding: 15,
    marginBottom: 15,
  },

  folioHeading: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  folioText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 13,
  },

  instructions: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  paymentCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 13,
    marginTop: 10,
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  paymentAmount: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  methodName: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 1,
  },

  rejectionText: {
    color: colors.error,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },

  reportNotice: {
    backgroundColor: colors.accentSoft,
    padding: 13,
    borderRadius: 11,
    marginTop: 12,
  },

  reportNoticeText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 18,
  },

  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 13,
    padding: 16,
    marginTop: 15,
    alignItems: 'center',
  },

  reportButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
  },

  reportButtonDisabled: {
    opacity: 0.45,
  },

  formSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 15,
  },

  formTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 7,
  },

  formDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 14,
  },

  formGroup: {
    marginBottom: 15,
  },

  formLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },

  formInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 49,
    paddingHorizontal: 13,
    color: colors.text,
    fontSize: 13,
  },

  formTextarea: {
    minHeight: 90,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: 'top',
  },

  formHelp: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 7,
  },

  methodChoice: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 13,
    marginBottom: 9,
  },

  methodChoiceSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primarySoft,
  },

  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  choiceCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 10,
  },

  choiceCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  choiceText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },

  choiceTextSelected: {
    color: colors.primary,
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: 9,
  },

  dateTimeColumn: {
    flex: 1,
  },

  dateTimeButton: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  dateTimeValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  whatsappCard: {
    backgroundColor: '#E8F7ED',
    borderWidth: 1,
    borderColor: '#B7E4C7',
    borderRadius: 14,
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
  },

  whatsappNumber: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 8,
  },

  whatsappButton: {
    backgroundColor: '#177B4A',
    borderRadius: 12,
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 13,
  },

  whatsappButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 11,
    padding: 12,
    marginTop: 15,
  },

  checkboxBox: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
    marginRight: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
  },

  checkboxMark: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '900',
  },

  checkboxLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '700',
  },

  reportSuccess: {
    backgroundColor: '#E8F7ED',
    borderRadius: 12,
    padding: 14,
    marginTop: 13,
  },

  reportSuccessTitle: {
    color: '#176B38',
    fontSize: 13,
    fontWeight: '900',
  },

  reportSuccessText: {
    color: '#176B38',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },

  reportError: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 13,
    marginTop: 12,
  },

  reportErrorText: {
    color: colors.error,
    fontSize: 11,
    lineHeight: 18,
  },

  submitButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    marginTop: 11,
  },

  submitButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },

  cancelButton: {
    padding: 13,
    alignItems: 'center',
    marginTop: 6,
  },

  cancelButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  submittingText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },
});
