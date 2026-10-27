
import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  // Pantalla principal

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 42,
  },

  // Encabezado

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

  // Resumen general de compras

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 27,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  summaryNumber: {
    color: colors.accent,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },

  summaryLabel: {
    color: colors.primarySoft,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'center',
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
  },

  // Encabezado de sección

  sectionHeader: {
    marginBottom: 14,
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  // Estados de carga

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
  },

  // Estado de error

  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginVertical: 12,
    alignItems: 'center',
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },

  errorDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
  },

  // Lista de compras

  purchasesList: {
    marginBottom: 16,
  },

  purchaseCard: {
    backgroundColor: colors.surface,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },

  purchaseContent: {
    padding: 16,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  folioContainer: {
    flex: 1,
    paddingRight: 8,
  },

  folioLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  folioText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },

  // Estado de la compra

  statusBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    maxWidth: '48%',
  },

  statusText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },

  statusPending: {
    backgroundColor: colors.accentSoft,
  },

  statusPendingText: {
    color: colors.primary,
  },

  statusSuccess: {
    backgroundColor: '#E8F7ED',
  },

  statusSuccessText: {
    color: '#176B38',
  },

  statusError: {
    backgroundColor: '#FDECEC',
  },

  statusErrorText: {
    color: colors.error,
  },

  // Información del curso

  courseTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 23,
    marginBottom: 13,
  },

  purchaseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  metaLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    flex: 1,
    paddingRight: 8,
  },

  metaValue: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },

  // Separador y total

  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 15,
    marginBottom: 13,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },

  totalValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },

  // Botón para consultar el detalle

  detailsButton: {
    minHeight: 42,
    backgroundColor: colors.primary,
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsButtonText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '800',
  },

  detailsArrow: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  // Historial vacío

  emptyWrapper: {
    marginTop: 5,
    marginBottom: 16,
  },

  // Actualización manual

  refreshButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 2,
    marginBottom: 18,
  },

  refreshText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Información adicional

  infoBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 13,
    marginTop: 5,
    marginBottom: 17,
  },

  infoText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 18,
  },
});
