import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppFooter } from '../../components/common/AppFooter';
import { DetailRow } from '../../components/common/DetailRow';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { CourseMaterialsPanel } from '../../components/myCourses/CourseMaterialsPanel';
import { CourseProgressBar } from '../../components/myCourses/CourseProgressBar';
import { myCoursesRepository } from '../../config/dependencies';
import { AuthenticatedStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { useMyCourseDetailViewModel } from '../../viewmodels/myCourses/useMyCourseDetailViewModel';
import { styles } from './MyCourseDetailScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'MyCourseDetail'
>;

function formatDate(value: string | null): string {
  if (!value) {
    return 'No disponible';
  }
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value,
  );
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
}

function formatTime(value: string | null): string {
  if (!value) {
    return 'No disponible';
  }
  // Preserve timestamps as received instead of truncating them to "2026-".
  return /^\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(value)
    ? value.slice(0, 5)
    : value;
}

async function openVirtualSession(url: string): Promise<void> {
  try {
    const link = new URL(url.trim());
    if (
      link.protocol !== 'https:' ||
      !link.hostname ||
      link.username ||
      link.password
    ) {
      throw new Error('Enlace no válido');
    }
  } catch {
    Alert.alert(
      'Enlace no disponible',
      'La sesión necesita un enlace HTTPS válido.',
    );
    return;
  }
  try {
    await Linking.openURL(url.trim());
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
  const { enrollmentId } = route.params;
  const { course, state, error, loadMyCourseDetail } =
    useMyCourseDetailViewModel(myCoursesRepository);
  useFocusEffect(
    useCallback(() => {
      loadMyCourseDetail(enrollmentId);
    }, [enrollmentId, loadMyCourseDetail]),
  );
  const refresh = () => {
    loadMyCourseDetail(enrollmentId);
  };
  const goBack = () => navigation.goBack();

  if (
    state === 'idle' ||
    state === 'loading' ||
    (course && course.enrollmentId !== enrollmentId)
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingTitle}>Cargando tu inscripción</Text>
        <Text style={styles.loadingDescription}>
          Consultando el curso, las sesiones y tu asistencia registrada en
          CMP_Site.
        </Text>
      </View>
    );
  }
  if (state === 'error' || !course) {
    return (
      <ScrollView contentContainerStyle={styles.errorContainer}>
        <Text style={styles.errorTitle}>No fue posible cargar tu curso</Text>
        <Text style={styles.errorText}>
          {error ?? 'La información académica no está disponible.'}
        </Text>
        <PrimaryButton
          label="Reintentar"
          onPress={refresh}
          size="comfortable"
        />
        <PrimaryButton
          label="Volver a mis cursos"
          onPress={goBack}
          variant="outline"
          size="comfortable"
        />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      {/* App.tsx protects top/bottom system bars; the native stack owns its header. */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
        <View style={styles.hero} testID="course-heading">
          <Text style={styles.eyebrow}>MI FORMACIÓN</Text>
          <View style={styles.heroBadges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {course.categoryName ?? 'Capacitación'}
              </Text>
            </View>
            <View style={styles.situationBadge}>
              <Text style={styles.situationText}>{course.situation}</Text>
            </View>
          </View>
          <Text accessibilityRole="header" style={styles.heroTitle}>
            {course.title}
          </Text>
          <Text style={styles.heroSubtitle}>
            Instructor: {course.instructorName}
          </Text>
          <Text style={styles.heroSubtitle}>
            Inicio: {formatDate(course.startDate)}
          </Text>
          <Text style={styles.heroSubtitle}>
            Término: {formatDate(course.endDate)}
          </Text>
          <Text style={styles.heroSubtitle}>
            Inscripción #{course.enrollmentId} · {course.enrollmentStatus}
          </Text>
        </View>

        <CourseMaterialsPanel
          enrollmentId={course.enrollmentId}
          courseId={course.courseId}
        />

        <View style={styles.section} testID="course-progress-section">
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Avance del curso
          </Text>
          <CourseProgressBar progress={course.progress} />
        </View>

        <View style={styles.section} testID="course-sessions-section">
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Sesiones del curso
          </Text>
          <Text style={styles.bodyText}>
            Encuentros programados, ordenados por fecha y hora.
          </Text>
          {course.sessions.length === 0 ? (
            <Text style={styles.emptyText}>
              Todavía no hay sesiones programadas para este curso.
            </Text>
          ) : (
            course.sessions.map(session => (
              <View
                key={session.id}
                style={styles.sessionCard}
                testID={`scheduled-session-${session.id}`}
              >
                <View style={styles.sessionTop}>
                  <View style={styles.sessionNumber}>
                    <Text style={styles.sessionNumberText}>
                      {session.number}
                    </Text>
                  </View>
                  <View style={styles.sessionInformation}>
                    <Text style={styles.sessionTitle}>
                      {session.title || `Sesión ${session.number}`}
                    </Text>
                    <Text style={styles.sessionStatus}>
                      Estado: {session.status || 'No disponible'}
                    </Text>
                  </View>
                </View>
                {session.description ? (
                  <Text style={styles.bodyText}>{session.description}</Text>
                ) : null}
                <Text style={styles.bodyText}>
                  Fecha: {formatDate(session.date)}
                </Text>
                <Text style={styles.bodyText}>
                  Horario: {formatTime(session.startTime)} –{' '}
                  {formatTime(session.endTime)}
                </Text>
                {session.modalityName ? (
                  <Text style={styles.bodyText}>
                    Modalidad: {session.modalityName}
                  </Text>
                ) : null}
                {session.locationName ? (
                  <Text style={styles.bodyText}>
                    Lugar: {session.locationName}
                  </Text>
                ) : null}
                {session.fullAddress ? (
                  <Text style={styles.bodyText}>
                    Dirección: {session.fullAddress}
                  </Text>
                ) : null}
                {session.virtualLink ? (
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={`Abrir sesión virtual ${session.title}`}
                    onPress={() => openVirtualSession(session.virtualLink!)}
                    style={styles.virtualButton}
                  >
                    <Text style={styles.virtualButtonText}>
                      Abrir sesión virtual
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={styles.section} testID="course-attendance-section">
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Asistencia
          </Text>
          <Text style={styles.bodyText}>
            Registro de CMP_Site para {course.participantName}, inscripción #
            {course.enrollmentId}. La asistencia la registra la institución.
          </Text>
          {course.sessions.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay sesiones para consultar registros de asistencia.
            </Text>
          ) : (
            course.sessions.map(session => (
              <View
                key={session.id}
                style={styles.attendancePanel}
                testID={`attendance-session-${session.id}`}
              >
                <Text style={styles.sessionTitle}>
                  Sesión {session.number} · {session.title}
                </Text>
                <Text style={styles.bodyText}>
                  {formatDate(session.date)} · {formatTime(session.startTime)}
                </Text>
                <Text style={styles.attendanceStatus}>
                  Estado: {session.attendanceStatus?.trim() || 'Sin registro'}
                </Text>
                {session.checkInTime ? (
                  <Text style={styles.bodyText}>
                    Entrada: {formatTime(session.checkInTime)}
                  </Text>
                ) : null}
                {session.checkOutTime ? (
                  <Text style={styles.bodyText}>
                    Salida: {formatTime(session.checkOutTime)}
                  </Text>
                ) : null}
                {session.lateMinutes !== null && session.lateMinutes > 0 ? (
                  <Text style={styles.bodyText}>
                    Retardo: {session.lateMinutes} minutos
                  </Text>
                ) : null}
                {session.justified ? (
                  <Text style={styles.bodyText}>Justificación registrada</Text>
                ) : null}
                {session.justificationReason ? (
                  <Text style={styles.bodyText}>
                    Motivo: {session.justificationReason}
                  </Text>
                ) : null}
                {session.attendanceNotes ? (
                  <Text style={styles.bodyText}>
                    Observaciones: {session.attendanceNotes}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Información de inscripción
          </Text>
          <DetailRow
            label="Participante inscrito"
            value={course.participantName}
          />
          {course.participantEmail ? (
            <DetailRow label="Correo" value={course.participantEmail} />
          ) : null}
          {course.participantPhone ? (
            <DetailRow label="Teléfono" value={course.participantPhone} />
          ) : null}
          <DetailRow
            label="Fecha de inscripción"
            value={formatDate(course.enrollmentDate)}
          />
          <DetailRow
            label="Modalidad"
            value={course.modalityName ?? 'Por confirmar'}
          />
          <DetailRow
            label="Horario del curso"
            value={course.schedule ?? 'Por confirmar'}
          />
          <DetailRow
            label="Lugar"
            value={course.locationName ?? 'Por confirmar'}
          />
          {course.fullAddress ? (
            <DetailRow label="Dirección" value={course.fullAddress} />
          ) : null}
          {course.instructorSpecialty ? (
            <DetailRow
              label="Especialidad del instructor"
              value={course.instructorSpecialty}
            />
          ) : null}
          {course.description ? (
            <DetailRow
              label="Descripción del curso"
              value={course.description}
              last
            />
          ) : null}
        </View>
        <PrimaryButton
          label="Actualizar información"
          onPress={refresh}
          variant="outline"
          size="comfortable"
        />
        <PrimaryButton
          label="Volver a mis cursos"
          onPress={goBack}
          size="comfortable"
        />
        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
