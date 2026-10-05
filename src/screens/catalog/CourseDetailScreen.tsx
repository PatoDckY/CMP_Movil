import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppFooter } from '../../components/common/AppFooter';
import { DetailRow } from '../../components/common/DetailRow';
import { SectionHeader } from '../../components/common/SectionHeader';
import { courseRepository } from '../../config/dependencies';
import {
  AuthenticatedStackParamList,
  PublicStackParamList,
} from '../../navigation/types';
import { colors } from '../../theme/colors';
import { useCourseDetailViewModel } from '../../viewmodels/catalog/useCourseDetailViewModel';
import { styles } from './CourseDetailScreen.styles';

type PublicProps = NativeStackScreenProps<PublicStackParamList, 'CourseDetail'>;

type AuthenticatedProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'CourseDetail'
>;

type CourseDetailMode = 'public' | 'authenticated';

type CourseDetailContentProps = {
  courseId: number;
  mode: CourseDetailMode;
  onPurchase: () => void;
  onCreateAccount?: () => void;
};

export function CourseDetailScreen({
  navigation,
  route,
}: PublicProps): React.JSX.Element {
  const handlePurchase = () => {
    Alert.alert(
      'Inicia sesión para continuar',
      'Para comprar o inscribirte a este curso necesitas acceder a tu cuenta.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Crear cuenta',
          onPress: () => {
            navigation.navigate('Register');
          },
        },
        {
          text: 'Iniciar sesión',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ],
    );
  };

  return (
    <CourseDetailContent
      courseId={route.params.courseId}
      mode="public"
      onPurchase={handlePurchase}
      onCreateAccount={() => navigation.navigate('Register')}
    />
  );
}

export function AuthenticatedCourseDetailScreen({
  route,
}: AuthenticatedProps): React.JSX.Element {
  const handlePurchase = () => {
    Alert.alert(
      'Proceso de compra',
      'La interfaz está preparada. La compra real se conectará cuando integremos el módulo correspondiente.',
      [
        {
          text: 'Entendido',
        },
      ],
    );
  };

  return (
    <CourseDetailContent
      courseId={route.params.courseId}
      mode="authenticated"
      onPurchase={handlePurchase}
    />
  );
}

function CourseDetailContent({
  courseId,
  mode,
  onPurchase,
  onCreateAccount,
}: CourseDetailContentProps): React.JSX.Element {
  const { course, state, error, loadCourse } =
    useCourseDetailViewModel(courseRepository);

  useEffect(() => {
    loadCourse(courseId);
  }, [courseId, loadCourse]);

  if (state === 'idle' || state === 'loading') {
    return (
      <View style={styles.center}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>

        <Text style={styles.loadingTitle}>Cargando curso</Text>

        <Text style={styles.loadingText}>
          Estamos preparando toda la información.
        </Text>
      </View>
    );
  }

  if (state === 'error' || !course) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No pudimos cargar el curso</Text>

        <Text style={styles.errorText}>
          {error ?? 'Ocurrió un problema inesperado.'}
        </Text>
      </View>
    );
  }

  const occupied = course.occupiedCapacity ?? 0;

  const available = Math.max(course.maxCapacity - occupied, 0);

  const occupancyPercentage =
    course.maxCapacity > 0
      ? Math.min((occupied / course.maxCapacity) * 100, 100)
      : 0;

  const progressWidth = `${occupancyPercentage}%` as `${number}%`;

  const canPurchase = course.active && available > 0;

  const numericCost = course.cost !== null ? Number(course.cost) : 0;

  const isFree =
    !course.cost || (Number.isFinite(numericCost) && numericCost <= 0);

  const actionText = isFree ? 'Inscribirme al curso' : 'Comprar curso';

  const actionHelper =
    mode === 'public'
      ? 'Accede a tu cuenta para continuar'
      : isFree
      ? 'Continúa con tu inscripción'
      : 'Continúa con el proceso de compra';

  const purchaseDescription =
    mode === 'public'
      ? 'Reserva tu lugar. Para continuar con la compra o inscripción necesitas acceder a tu cuenta.'
      : 'Reserva tu lugar y continúa con el proceso desde tu cuenta.';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        {course.imageUrl ? (
          <Image
            source={{
              uri: course.imageUrl,
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <View style={styles.heroCircleLarge} />

            <View style={styles.heroCircleSmall} />

            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderLogoText}>CMP</Text>
            </View>

            <Text style={styles.placeholderText}>Formación académica</Text>
          </View>
        )}
      </View>

      <View style={styles.badgesRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {course.categoryName ?? 'Curso'}
          </Text>
        </View>

        <View style={styles.modalityBadge}>
          <Text style={styles.modalityBadgeText}>
            {course.modalityName ?? 'Modalidad por confirmar'}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{course.title}</Text>

      <Text style={styles.description}>
        {course.description ??
          'Este curso no cuenta con una descripción disponible.'}
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>COSTO</Text>

          <Text style={styles.price}>{formatPrice(course.cost)}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>DISPONIBLES</Text>

          <Text style={styles.availableNumber}>{available}</Text>

          <Text style={styles.availableLabel}>lugares</Text>
        </View>
      </View>

      <View style={styles.purchaseCard}>
        <View style={styles.purchaseTop}>
          <View style={styles.purchaseIcon}>
            <Text style={styles.purchaseIconText}>✓</Text>
          </View>

          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseEyebrow}>¿TE INTERESA ESTE CURSO?</Text>

            <Text style={styles.purchaseTitle}>
              {canPurchase
                ? 'Continúa con tu inscripción'
                : 'Inscripción no disponible'}
            </Text>
          </View>
        </View>

        <Text style={styles.purchaseDescription}>
          {canPurchase
            ? purchaseDescription
            : 'Actualmente este curso no cuenta con lugares disponibles para nuevas inscripciones.'}
        </Text>

        {canPurchase && (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.purchaseButton,
                pressed && styles.purchaseButtonPressed,
              ]}
              onPress={onPurchase}
            >
              <View style={styles.purchaseButtonContent}>
                <Text style={styles.purchaseButtonText}>{actionText}</Text>

                <Text style={styles.purchaseButtonHelper}>{actionHelper}</Text>
              </View>

              <Text style={styles.purchaseButtonArrow}>→</Text>
            </Pressable>

            {mode === 'public' && onCreateAccount && (
              <>
                <View style={styles.accountDivider}>
                  <View style={styles.accountDividerLine} />

                  <Text style={styles.accountDividerText}>o</Text>

                  <View style={styles.accountDividerLine} />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.createAccountButton,
                    pressed && styles.createAccountButtonPressed,
                  ]}
                  onPress={onCreateAccount}
                >
                  <Text style={styles.createAccountText}>Crear una cuenta</Text>
                </Pressable>
              </>
            )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="01"
          eyebrow="INFORMACIÓN"
          title="Acerca del curso"
        />

        <DetailRow
          label="Instructor"
          value={course.instructorName ?? 'Por confirmar'}
        />

        <DetailRow
          label="Especialidad"
          value={course.instructorSpecialty ?? 'No especificada'}
        />

        <DetailRow
          label="Dirigido a"
          value={course.targetAudience ?? 'Público interesado'}
          last
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="02"
          eyebrow="PROGRAMACIÓN"
          title="Fechas y horario"
        />

        <View style={styles.dateCards}>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>INICIO</Text>

            <Text style={styles.dateValue}>{formatDate(course.startDate)}</Text>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>TÉRMINO</Text>

            <Text style={styles.dateValue}>{formatDate(course.endDate)}</Text>
          </View>
        </View>

        <View style={styles.scheduleBox}>
          <Text style={styles.scheduleLabel}>HORARIO</Text>

          <Text style={styles.scheduleValue}>
            {course.schedule ?? 'Horario por confirmar'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          number="03"
          eyebrow="UBICACIÓN"
          title="¿Dónde se imparte?"
        />

        <DetailRow
          label="Modalidad"
          value={course.modalityName ?? 'Por confirmar'}
        />

        <DetailRow
          label="Sede"
          value={course.locationName ?? 'Por confirmar'}
        />

        <DetailRow
          label="Dirección"
          value={course.locationAddress ?? 'No especificada'}
          last
        />
      </View>

      <View style={styles.capacityCard}>
        <View style={styles.capacityHeader}>
          <View>
            <Text style={styles.capacityEyebrow}>DISPONIBILIDAD</Text>

            <Text style={styles.capacityTitle}>Cupo del curso</Text>
          </View>

          <View style={styles.capacityBadge}>
            <Text style={styles.capacityBadgeNumber}>{available}</Text>

            <Text style={styles.capacityBadgeText}>libres</Text>
          </View>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>

        <View style={styles.capacityFooter}>
          <Text style={styles.capacityText}>{occupied} ocupados</Text>

          <Text style={styles.capacityText}>
            {course.maxCapacity} cupo máximo
          </Text>
        </View>
      </View>

      {mode === 'public' && (
        <View style={styles.publicNotice}>
          <View style={styles.publicNoticeIcon}>
            <Text style={styles.publicNoticeIconText}>i</Text>
          </View>

          <View style={styles.publicNoticeContent}>
            <Text style={styles.publicNoticeTitle}>Información pública</Text>

            <Text style={styles.publicNoticeText}>
              Puedes consultar todos los detalles del curso sin iniciar sesión.
              Para comprar o inscribirte deberás acceder a tu cuenta.
            </Text>
          </View>
        </View>
      )}

      <AppFooter />
    </ScrollView>
  );
}

function formatPrice(value: string | null): string {
  if (!value) {
    return 'Sin costo';
  }

  const amount = Number(value);

  if (Number.isFinite(amount) && amount <= 0) {
    return 'Sin costo';
  }

  if (!Number.isFinite(amount)) {
    return `$${value}`;
  }

  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDate(value: string): string {
  const datePart = value.split('T')[0];

  const parts = datePart.split('-');

  if (parts.length !== 3) {
    return value;
  }

  const year = Number(parts[0]);

  const month = Number(parts[1]);

  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
