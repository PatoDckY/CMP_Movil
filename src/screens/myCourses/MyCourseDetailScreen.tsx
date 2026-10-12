
import React, {useCallback} from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
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
  DetailRow,
} from '../../components/common/DetailRow';

import {
  PrimaryButton,
} from '../../components/common/PrimaryButton';

import {
  SectionHeader,
} from '../../components/common/SectionHeader';

import {
  myCoursesRepository,
} from '../../config/dependencies';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {colors} from '../../theme/colors';

import {
  useMyCourseDetailViewModel,
} from '../../viewmodels/myCourses/useMyCourseDetailViewModel';

import {
  styles,
} from './MyCourseDetailScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'MyCourseDetail'
>;

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'No disponible';
  }

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

function formatTime(
  value: string | null,
): string {
  if (!value) {
    return 'No disponible';
  }

  return value.slice(0, 5);
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

async function openVirtualSession(
  url: string,
): Promise<void> {
  const normalized = url.trim();

  if (
    !/^https:\/\/[^\s/]+/i.test(normalized)
  ) {
    Alert.alert(
      'Enlace no disponible',
      'La sesión necesita un enlace HTTPS válido.',
    );
    return;
  }

  try {
    await Linking.openURL(normalized);
  } catch {
    Alert.alert(
      'No se pudo abrir el enlace',
      'Verifica tu conexión e inténtalo nuevamente.',
    );
  }
}

export function MyCourseDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {enrollmentId} = route.params;

  const {
    course,
    state,
    error,
    loadMyCourseDetail,
  } = useMyCourseDetailViewModel(
    myCoursesRepository,
  );

  useFocusEffect(
    useCallback(() => {
      void loadMyCourseDetail(
        enrollmentId,
      );
    }, [
      enrollmentId,
      loadMyCourseDetail,
    ]),
  );

  const refresh = () => {
    void loadMyCourseDetail(
      enrollmentId,
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (
    state === 'idle' ||
    state === 'loading'
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingTitle}>
          Cargando tu inscripción
        </Text>

        <Text style={styles.loadingDescription}>
          Consultando el curso,
          las sesiones y tu progreso
          académico en CMP_Site.
        </Text>
      </View>
    );
  }

  if (
    state === 'error' ||
    course === null
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No fue posible cargar tu curso
        </Text>

        <Text style={styles.errorText}>
          {error ??
            'La información académica no está disponible.'}
        </Text>

        <View style={styles.actionContainer}>
          <PrimaryButton
            label="Reintentar"
            onPress={refresh}
          />
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton
            label="Volver a mis cursos"
            onPress={goBack}
            variant="accent"
          />
        </View>
      </View>
    );
  }

  const progress =
    normalizePercentage(
      course.progress.progressPercentage,
    );

  const attendance =
    normalizePercentage(
      course.progress.attendancePercentage,
    );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={false}>

      {/* ENCABEZADO */}

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          MI FORMACIÓN
        </Text>

        <Text style={styles.title}>
          Detalle de mi curso
        </Text>

        <Text style={styles.description}>
          Consulta tu inscripción,
          la programación de sesiones,
          el avance académico
          y la asistencia registrada.
        </Text>
      </View>

      {/* INFORMACIÓN PRINCIPAL */}

      <View style={styles.hero}>
        <View style={styles.heroBadges}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {course.categoryName ??
                'Capacitación'}
            </Text>
          </View>

          <View style={styles.situationBadge}>
            <Text style={styles.situationText}>
              {course.situation}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.heroTitle}>
            {course.title}
          </Text>

          <Text style={styles.heroSubtitle}>
            {course.instructorName}
          </Text>
        </View>
      </View>

      <View style={styles.enrollmentBadge}>
        <Text style={styles.enrollmentText}>
          Inscripción #{course.enrollmentId}
          {' · '}
          {course.enrollmentStatus}
        </Text>
      </View>

      {/* PARTICIPANTE */}

      <View style={styles.section}>
        <SectionHeader
          number="01"
          eyebrow="INSCRIPCIÓN"
          title="Datos del participante"
        />

        <View style={styles.participantPanel}>
          <Text style={styles.participantLabel}>
            PARTICIPANTE INSCRITO
          </Text>

          <Text style={styles.participantName}>
            {course.participantName}
          </Text>

          {course.participantEmail && (
            <Text style={styles.participantContact}>
              Correo: {course.participantEmail}
            </Text>
          )}

          {course.participantPhone && (
            <Text style={styles.participantContact}>
              Teléfono: {course.participantPhone}
            </Text>
          )}
        </View>

        <DetailRow
          label="Estado de inscripción"
          value={course.enrollmentStatus}
        />

        <DetailRow
          label="Fecha de inscripción"
          value={formatDate(
            course.enrollmentDate,
          )}
        />

        <DetailRow
          label="Modalidad"
          value={
            course.modalityName ??
            'Por confirmar'
          }
          last
        />
      </View>

      {/* INFORMACIÓN DEL CURSO */}

      <View style={styles.section}>
        <SectionHeader
          number="02"
          eyebrow="INFORMACIÓN ACADÉMICA"
          title="Información del curso"
        />

        {course.description && (
          <Text style={styles.bodyText}>
            {course.description}
          </Text>
        )}

        <DetailRow
          label="Instructor"
          value={course.instructorName}
        />

        <DetailRow
          label="Especialidad"
          value={
            course.instructorSpecialty ??
            'No especificada'
          }
        />

        <DetailRow
          label="Fecha de inicio"
          value={formatDate(
            course.startDate,
          )}
        />

        <DetailRow
          label="Fecha de término"
          value={formatDate(
            course.endDate,
          )}
        />

        <DetailRow
          label="Horario"
          value={
            course.schedule ??
            'Por confirmar'
          }
        />

        <DetailRow
          label="Lugar"
          value={
            course.locationName ??
            'Por confirmar'
          }
        />

        <DetailRow
          label="Dirección"
          value={
            course.fullAddress ??
            'No especificada'
          }
          last
        />
      </View>

      {/* PROGRESO */}

      <View style={styles.section}>
        <SectionHeader
          number="03"
          eyebrow="SEGUIMIENTO"
          title="Mi progreso académico"
        />

        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
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

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
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

        <View style={styles.academicPanel}>
          <Text style={styles.academicLabel}>
            ESTADO ACADÉMICO
          </Text>

          <Text style={styles.academicValue}>
            {course.progress.academicStatus}
          </Text>
        </View>

        <DetailRow
          label="Sesiones totales"
          value={String(
            course.progress.totalSessions,
          )}
        />

        <DetailRow
          label="Sesiones completadas"
          value={String(
            course.progress.completedSessions,
          )}
        />

        <DetailRow
          label="Última actividad"
          value={formatDate(
            course.progress.lastActivityDate,
          )}
        />

        <DetailRow
          label="Fecha de finalización"
          value={formatDate(
            course.progress.completionDate,
          )}
          last
        />
      </View>

      {/* SESIONES Y ASISTENCIA */}

      <View style={styles.section}>
        <SectionHeader
          number="04"
          eyebrow="PROGRAMACIÓN"
          title="Sesiones del curso"
        />

        {course.sessions.length === 0 ? (
          <View style={styles.emptySessions}>
            <Text style={styles.emptySessionsText}>
              Todavía no hay sesiones
              programadas para este curso.
              Cuando estén disponibles,
              aparecerán aquí.
            </Text>
          </View>
        ) : (
          course.sessions.map(session => (
            <View
              key={session.id}
              style={styles.sessionCard}>

              <View style={styles.sessionTop}>
                <View style={styles.sessionNumber}>
                  <Text
                    style={styles.sessionNumberText}>
                    {session.number}
                  </Text>
                </View>

                <View style={styles.sessionInformation}>
                  <Text style={styles.sessionTitle}>
                    {session.title}
                  </Text>

                  <Text style={styles.sessionStatus}>
                    {session.status}
                  </Text>
                </View>
              </View>

              {session.description && (
                <Text style={styles.sessionLine}>
                  {session.description}
                </Text>
              )}

              <Text style={styles.sessionLine}>
                Fecha: {formatDate(session.date)}
              </Text>

              <Text style={styles.sessionLine}>
                Horario: {formatTime(
                  session.startTime,
                )}
                {' - '}
                {formatTime(
                  session.endTime,
                )}
              </Text>

              {session.modalityName && (
                <Text style={styles.sessionLine}>
                  Modalidad: {session.modalityName}
                </Text>
              )}

              {session.locationName && (
                <Text style={styles.sessionLine}>
                  Lugar: {session.locationName}
                </Text>
              )}

              {session.fullAddress && (
                <Text style={styles.sessionLine}>
                  Dirección: {session.fullAddress}
                </Text>
              )}

              {/* REGISTRO DE ASISTENCIA */}

              <View style={styles.attendancePanel}>
                <Text
                  style={styles.attendanceTitle}>
                  Registro de asistencia
                </Text>

                <Text
                  style={styles.attendanceText}>
                  Estado: {session.attendanceStatus}
                </Text>

                {session.checkInTime && (
                  <Text style={styles.attendanceText}>
                    Entrada: {formatTime(
                      session.checkInTime,
                    )}
                  </Text>
                )}

                {session.checkOutTime && (
                  <Text style={styles.attendanceText}>
                    Salida: {formatTime(
                      session.checkOutTime,
                    )}
                  </Text>
                )}

                {session.lateMinutes !== null &&
                  session.lateMinutes > 0 && (
                    <Text style={styles.attendanceText}>
                      Retardo: {session.lateMinutes}
                      {' minutos'}
                    </Text>
                  )}

                {session.justified && (
                  <Text style={styles.attendanceText}>
                    Justificación registrada
                  </Text>
                )}

                {session.justificationReason && (
                  <Text style={styles.attendanceText}>
                    Motivo: {session.justificationReason}
                  </Text>
                )}

                {session.attendanceNotes && (
                  <Text style={styles.attendanceText}>
                    Observaciones: {session.attendanceNotes}
                  </Text>
                )}
              </View>

              {/* ACCESO A SESIÓN VIRTUAL */}

              {session.virtualLink && (
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={
                    `Abrir sesión virtual ${session.title}`
                  }
                  onPress={() => {
                    void openVirtualSession(
                      session.virtualLink!,
                    );
                  }}
                  style={styles.virtualButton}>

                  <Text
                    style={styles.virtualButtonText}>
                    Abrir sesión virtual
                  </Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </View>

      {/* ACTUALIZAR */}

      <Pressable
        accessibilityRole="button"
        onPress={refresh}
        style={styles.refreshButton}>

        <Text style={styles.refreshText}>
          ↻ Actualizar información
        </Text>
      </Pressable>

      <View style={styles.footerButton}>
        <PrimaryButton
          label="Volver a mis cursos"
          onPress={goBack}
        />
      </View>

      <AppFooter />
    </ScrollView>
  );
}
