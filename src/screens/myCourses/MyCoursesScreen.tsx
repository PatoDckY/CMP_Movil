
import React, {useCallback} from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  AppFooter,
} from '../../components/common/AppFooter';

import {
  EmptyState,
} from '../../components/common/EmptyState';

import {
  InfoCard,
} from '../../components/common/InfoCard';

import {
  myCoursesRepository,
} from '../../config/dependencies';

import {
  MyCourse,
} from '../../models/MyCourse';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {colors} from '../../theme/colors';

import {
  useMyCoursesViewModel,
} from '../../viewmodels/myCourses/useMyCoursesViewModel';

import {styles} from './MyCoursesScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'MyCourses'
>;

function formatDate(
  value: string,
): string {
  const normalized =
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T12:00:00`
      : value;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function normalizePercentage(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function percentageWidth(
  value: number,
): `${number}%` {
  return `${normalizePercentage(value)}%`;
}

function formatTime(
  value: string,
): string {
  return value.slice(0, 5);
}

export function MyCoursesScreen({
  navigation,
}: Props): React.JSX.Element {
  const {
    courses,
    summary,
    state,
    error,
    isLoading,
    isEmpty,
    hasCourses,
    hasError,
    loadMyCourses,
  } = useMyCoursesViewModel(
    myCoursesRepository,
  );

  useFocusEffect(
    useCallback(() => {
      void loadMyCourses();
    }, [loadMyCourses]),
  );

  const refreshCourses = () => {
    void loadMyCourses();
  };

  const goToCatalog = () => {
    navigation.navigate('Catalog');
  };

  /**
   * Abre el detalle de la inscripción,
   * NO la ficha de compra del catálogo.
   */
  const goToMyCourseDetail = (
    enrollmentId: number,
  ) => {
    navigation.navigate('MyCourseDetail', {
      enrollmentId,
    });
  };

  const hasSummary =
    state === 'success' ||
    state === 'empty';

  const renderCourse = (
    course: MyCourse,
  ): React.JSX.Element => {
    const progress =
      normalizePercentage(
        course.progress.progressPercentage,
      );

    const attendance =
      normalizePercentage(
        course.progress.attendancePercentage,
      );

    const isUpcoming =
      course.situation === 'Próximamente';

    const isActive =
      course.situation === 'En curso';

    const isFinished =
      course.situation === 'Finalizado';

    return (
      <View
        key={course.enrollmentId}
        style={styles.courseCard}>

        {/* ENCABEZADO */}

        <View style={styles.courseBanner}>
          <View style={styles.courseBadgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {course.categoryName ??
                  'Capacitación'}
              </Text>
            </View>

            <View
              style={[
                styles.situationBadge,

                isUpcoming &&
                  styles.situationUpcoming,

                isActive &&
                  styles.situationActive,

                isFinished &&
                  styles.situationFinished,
              ]}>

              <Text style={styles.situationText}>
                {course.situation}
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.courseTitle}>
              {course.title}
            </Text>

            <Text style={styles.instructorName}>
              {course.instructorName}
            </Text>
          </View>
        </View>

        {/* DATOS DEL PARTICIPANTE */}

        <View style={styles.courseBody}>
          <View style={styles.participantPanel}>
            <Text style={styles.participantLabel}>
              PARTICIPANTE
            </Text>

            <Text style={styles.participantName}>
              {course.participantName}
            </Text>
          </View>

          <Text style={styles.datesText}>
            {formatDate(course.startDate)}
            {' — '}
            {formatDate(course.endDate)}
          </Text>

          {/* AVANCE Y ASISTENCIA */}

          <View style={styles.progressGrid}>
            <View style={styles.progressBox}>
              <View style={styles.progressTopRow}>
                <Text style={styles.progressLabel}>
                  Avance
                </Text>

                <Text style={styles.progressValue}>
                  {Math.round(progress)}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width:
                        percentageWidth(progress),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.progressBox}>
              <View style={styles.progressTopRow}>
                <Text style={styles.progressLabel}>
                  Asistencia
                </Text>

                <Text style={styles.progressValue}>
                  {Math.round(attendance)}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.attendanceFill,
                    {
                      width:
                        percentageWidth(attendance),
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* PRÓXIMA SESIÓN */}

          <View style={styles.nextSessionBox}>
            {course.nextSession ? (
              <>
                <Text style={styles.nextSessionLabel}>
                  Próxima sesión
                </Text>

                <Text style={styles.nextSessionText}>
                  {course.nextSession.title}
                </Text>

                <Text style={styles.nextSessionText}>
                  {formatDate(
                    course.nextSession.date,
                  )}
                  {' · '}
                  {formatTime(
                    course.nextSession.startTime,
                  )}
                  {' - '}
                  {formatTime(
                    course.nextSession.endTime,
                  )}
                </Text>
              </>
            ) : (
              <Text style={styles.nextSessionText}>
                No hay una próxima sesión
                programada.
              </Text>
            )}
          </View>

          <Text style={styles.academicStatus}>
            Estado académico:
            {' '}
            {course.progress.academicStatus}
          </Text>

          {/* DETALLE DE INSCRIPCIÓN */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              `Ver detalle de mi inscripción a ${course.title}`
            }
            onPress={() =>
              goToMyCourseDetail(
                course.enrollmentId,
              )
            }
            style={styles.detailButton}>

            <Text style={styles.detailButtonText}>
              Ver detalle del curso
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={false}>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MI FORMACIÓN
        </Text>

        <Text style={styles.title}>
          Mis cursos
        </Text>

        <Text style={styles.description}>
          Consulta tus inscripciones,
          las fechas de capacitación,
          el avance académico
          y la asistencia registrada.
        </Text>
      </View>

      {/* RESUMEN GENERAL */}

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? summary.totalEnrollments
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            Inscripciones
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? summary.activeCourses
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            En curso
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {hasSummary
              ? summary.finishedCourses
              : '—'}
          </Text>

          <Text style={styles.summaryLabel}>
            Finalizados
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>
          TUS CURSOS
        </Text>

        <Text style={styles.sectionTitle}>
          Continúa aprendiendo
        </Text>
      </View>

      {/* CARGA */}

      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Consultando tus inscripciones
            en CMP_Site...
          </Text>
        </View>
      )}

      {/* ERROR */}

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            No fue posible cargar tus cursos
          </Text>

          <Text style={styles.errorText}>
            {error ??
              'Ocurrió un problema al consultar las inscripciones.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={refreshCourses}
            style={styles.retryButton}>

            <Text style={styles.retryText}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      )}

      {/* SIN CURSOS */}

      {isEmpty && (
        <View style={styles.emptyWrapper}>
          <EmptyState
            icon="C"
            title="Aún no tienes cursos inscritos"
            description="Los cursos aparecerán cuando se genere una inscripción asociada a tu cuenta. Las compras pendientes se consultan en el historial."
            actionLabel="Explorar catálogo"
            onAction={goToCatalog}
            actionVariant="accent"
            variant="large"
          />
        </View>
      )}

      {/* CURSOS REGISTRADOS */}

      {hasCourses && (
        <View style={styles.coursesList}>
          {courses.map(renderCourse)}
        </View>
      )}

      {(state === 'success' ||
        state === 'empty') && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Actualizar mis cursos"
          onPress={refreshCourses}
          style={styles.refreshButton}>

          <Text style={styles.refreshText}>
            ↻ Actualizar mis cursos
          </Text>
        </Pressable>
      )}

      {hasCourses && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            El avance y la asistencia
            se actualizan según los registros
            académicos de CMP_Site.
          </Text>
        </View>
      )}

      <InfoCard
        icon="i"
        title="Mi formación académica"
        description="Selecciona Ver detalle del curso para consultar tu inscripción, sesiones, horarios y asistencia. Las compras pendientes de pago permanecen en el historial."
      />

      <AppFooter />
    </ScrollView>
  );
}
