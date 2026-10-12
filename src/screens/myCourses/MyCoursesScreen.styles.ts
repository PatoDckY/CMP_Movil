
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

  // Resumen académico

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
    fontSize: 21,
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

  // Lista de cursos

  coursesList: {
    marginBottom: 20,
  },

  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 17,
  },

  // Encabezado de cada tarjeta

  courseBanner: {
    backgroundColor: colors.primary,
    padding: 17,
    minHeight: 150,
    justifyContent: 'space-between',
  },

  courseBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  categoryBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    paddingVertical: 6,
    maxWidth: '45%',
  },

  situationText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },

  situationUpcoming: {
    backgroundColor: colors.accentSoft,
  },

  situationActive: {
    backgroundColor: '#E8F7ED',
  },

  situationFinished: {
    backgroundColor: colors.primarySoft,
  },

  courseTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 23,
  },

  instructorName: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
  },

  // Cuerpo de la tarjeta

  courseBody: {
    padding: 16,
  },

  participantPanel: {
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 14,
    marginBottom: 16,
  },

  participantLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  participantName: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },

  datesText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 15,
  },

  // Indicadores de avance y asistencia

  progressGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  progressBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 11,
  },

  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 5,
  },

  progressLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  progressValue: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  progressTrack: {
    width: '100%',
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  attendanceFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 5,
  },

  // Próxima sesión

  nextSessionBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 13,
    marginBottom: 15,
  },

  nextSessionLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  nextSessionText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },

  // Información complementaria

  academicStatus: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 14,
  },

  // Botón de detalle

  detailButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 47,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailButtonText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },

  // Carga de información

  loadingWrapper: {
    paddingVertical: 45,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 15,
    textAlign: 'center',
  },

  // Manejo de errores

  errorContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    alignItems: 'center',
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
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

  // Estado vacío

  emptyWrapper: {
    marginTop: 5,
    marginBottom: 16,
  },

  // Actualización del listado

  refreshButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 2,
    marginBottom: 17,
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
    marginBottom: 17,
  },

  infoText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 18,
  },
});
