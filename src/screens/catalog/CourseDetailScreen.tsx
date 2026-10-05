import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {courseRepository} from '../../config/dependencies';
import {
  AuthenticatedStackParamList,
  PublicStackParamList,
} from '../../navigation/types';
import {colors} from '../../theme/colors';
import {useCourseDetailViewModel} from '../../viewmodels/catalog/useCourseDetailViewModel';

type PublicProps = NativeStackScreenProps<
  PublicStackParamList,
  'CourseDetail'
>;

type AuthenticatedProps = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'CourseDetail'
>;

type CourseDetailMode =
  | 'public'
  | 'authenticated';

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
      onCreateAccount={() =>
        navigation.navigate('Register')
      }
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
  const {
    course,
    state,
    error,
    loadCourse,
  } = useCourseDetailViewModel(courseRepository);

  useEffect(() => {
    loadCourse(courseId);
  }, [
    courseId,
    loadCourse,
  ]);

  if (
    state === 'idle' ||
    state === 'loading'
  ) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />
        </View>

        <Text style={styles.loadingTitle}>
          Cargando curso
        </Text>

        <Text style={styles.loadingText}>
          Estamos preparando toda la información.
        </Text>
      </View>
    );
  }

  if (
    state === 'error' ||
    !course
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          No pudimos cargar el curso
        </Text>

        <Text style={styles.errorText}>
          {error ??
            'Ocurrió un problema inesperado.'}
        </Text>
      </View>
    );
  }

  const occupied =
    course.occupiedCapacity ?? 0;

  const available = Math.max(
    course.maxCapacity - occupied,
    0,
  );

  const occupancyPercentage =
    course.maxCapacity > 0
      ? Math.min(
          (occupied /
            course.maxCapacity) *
            100,
          100,
        )
      : 0;

  const progressWidth =
    `${occupancyPercentage}%` as `${number}%`;

  const canPurchase =
    course.active &&
    available > 0;

  const numericCost =
    course.cost !== null
      ? Number(course.cost)
      : 0;

  const isFree =
    !course.cost ||
    (Number.isFinite(numericCost) &&
      numericCost <= 0);

  const actionText =
    isFree
      ? 'Inscribirme al curso'
      : 'Comprar curso';

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
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }>
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
          <View
            style={
              styles.heroPlaceholder
            }>
            <View
              style={
                styles.heroCircleLarge
              }
            />

            <View
              style={
                styles.heroCircleSmall
              }
            />

            <View
              style={
                styles.placeholderLogo
              }>
              <Text
                style={
                  styles.placeholderLogoText
                }>
                CMP
              </Text>
            </View>

            <Text
              style={
                styles.placeholderText
              }>
              Formación académica
            </Text>
          </View>
        )}
      </View>

      <View style={styles.badgesRow}>
        <View
          style={
            styles.categoryBadge
          }>
          <Text
            style={
              styles.categoryBadgeText
            }>
            {course.categoryName ??
              'Curso'}
          </Text>
        </View>

        <View
          style={
            styles.modalityBadge
          }>
          <Text
            style={
              styles.modalityBadgeText
            }>
            {course.modalityName ??
              'Modalidad por confirmar'}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        {course.title}
      </Text>

      <Text style={styles.description}>
        {course.description ??
          'Este curso no cuenta con una descripción disponible.'}
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text
            style={
              styles.summaryLabel
            }>
            COSTO
          </Text>

          <Text style={styles.price}>
            {formatPrice(
              course.cost,
            )}
          </Text>
        </View>

        <View
          style={
            styles.summaryDivider
          }
        />

        <View style={styles.summaryItem}>
          <Text
            style={
              styles.summaryLabel
            }>
            DISPONIBLES
          </Text>

          <Text
            style={
              styles.availableNumber
            }>
            {available}
          </Text>

          <Text
            style={
              styles.availableLabel
            }>
            lugares
          </Text>
        </View>
      </View>

      <View style={styles.purchaseCard}>
        <View style={styles.purchaseTop}>
          <View
            style={
              styles.purchaseIcon
            }>
            <Text
              style={
                styles.purchaseIconText
              }>
              ✓
            </Text>
          </View>

          <View
            style={
              styles.purchaseInfo
            }>
            <Text
              style={
                styles.purchaseEyebrow
              }>
              ¿TE INTERESA ESTE CURSO?
            </Text>

            <Text
              style={
                styles.purchaseTitle
              }>
              {canPurchase
                ? 'Continúa con tu inscripción'
                : 'Inscripción no disponible'}
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.purchaseDescription
          }>
          {canPurchase
            ? purchaseDescription
            : 'Actualmente este curso no cuenta con lugares disponibles para nuevas inscripciones.'}
        </Text>

        {canPurchase && (
          <>
            <Pressable
              style={({pressed}) => [
                styles.purchaseButton,
                pressed &&
                  styles.purchaseButtonPressed,
              ]}
              onPress={onPurchase}>
              <View style={styles.purchaseButtonContent}>
                <Text
                  style={
                    styles.purchaseButtonText
                  }>
                  {actionText}
                </Text>

                <Text
                  style={
                    styles.purchaseButtonHelper
                  }>
                  {actionHelper}
                </Text>
              </View>

              <Text
                style={
                  styles.purchaseButtonArrow
                }>
                →
              </Text>
            </Pressable>

            {mode === 'public' &&
              onCreateAccount && (
                <>
                  <View
                    style={
                      styles.accountDivider
                    }>
                    <View
                      style={
                        styles.accountDividerLine
                      }
                    />

                    <Text
                      style={
                        styles.accountDividerText
                      }>
                      o
                    </Text>

                    <View
                      style={
                        styles.accountDividerLine
                      }
                    />
                  </View>

                  <Pressable
                    style={({pressed}) => [
                      styles.createAccountButton,
                      pressed &&
                        styles.createAccountButtonPressed,
                    ]}
                    onPress={
                      onCreateAccount
                    }>
                    <Text
                      style={
                        styles.createAccountText
                      }>
                      Crear una cuenta
                    </Text>
                  </Pressable>
                </>
              )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <View
          style={
            styles.sectionHeader
          }>
          <View
            style={
              styles.sectionIcon
            }>
            <Text
              style={
                styles.sectionIconText
              }>
              01
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.sectionEyebrow
              }>
              INFORMACIÓN
            </Text>

            <Text
              style={
                styles.sectionTitle
              }>
              Acerca del curso
            </Text>
          </View>
        </View>

        <DetailRow
          label="Instructor"
          value={
            course.instructorName ??
            'Por confirmar'
          }
        />

        <DetailRow
          label="Especialidad"
          value={
            course.instructorSpecialty ??
            'No especificada'
          }
        />

        <DetailRow
          label="Dirigido a"
          value={
            course.targetAudience ??
            'Público interesado'
          }
          last
        />
      </View>

      <View style={styles.section}>
        <View
          style={
            styles.sectionHeader
          }>
          <View
            style={
              styles.sectionIcon
            }>
            <Text
              style={
                styles.sectionIconText
              }>
              02
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.sectionEyebrow
              }>
              PROGRAMACIÓN
            </Text>

            <Text
              style={
                styles.sectionTitle
              }>
              Fechas y horario
            </Text>
          </View>
        </View>

        <View style={styles.dateCards}>
          <View style={styles.dateCard}>
            <Text
              style={
                styles.dateLabel
              }>
              INICIO
            </Text>

            <Text
              style={
                styles.dateValue
              }>
              {formatDate(
                course.startDate,
              )}
            </Text>
          </View>

          <View style={styles.dateCard}>
            <Text
              style={
                styles.dateLabel
              }>
              TÉRMINO
            </Text>

            <Text
              style={
                styles.dateValue
              }>
              {formatDate(
                course.endDate,
              )}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.scheduleBox
          }>
          <Text
            style={
              styles.scheduleLabel
            }>
            HORARIO
          </Text>

          <Text
            style={
              styles.scheduleValue
            }>
            {course.schedule ??
              'Horario por confirmar'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={
            styles.sectionHeader
          }>
          <View
            style={
              styles.sectionIcon
            }>
            <Text
              style={
                styles.sectionIconText
              }>
              03
            </Text>
          </View>

          <View>
            <Text
              style={
                styles.sectionEyebrow
              }>
              UBICACIÓN
            </Text>

            <Text
              style={
                styles.sectionTitle
              }>
              ¿Dónde se imparte?
            </Text>
          </View>
        </View>

        <DetailRow
          label="Modalidad"
          value={
            course.modalityName ??
            'Por confirmar'
          }
        />

        <DetailRow
          label="Sede"
          value={
            course.locationName ??
            'Por confirmar'
          }
        />

        <DetailRow
          label="Dirección"
          value={
            course.locationAddress ??
            'No especificada'
          }
          last
        />
      </View>

      <View
        style={
          styles.capacityCard
        }>
        <View
          style={
            styles.capacityHeader
          }>
          <View>
            <Text
              style={
                styles.capacityEyebrow
              }>
              DISPONIBILIDAD
            </Text>

            <Text
              style={
                styles.capacityTitle
              }>
              Cupo del curso
            </Text>
          </View>

          <View
            style={
              styles.capacityBadge
            }>
            <Text
              style={
                styles.capacityBadgeNumber
              }>
              {available}
            </Text>

            <Text
              style={
                styles.capacityBadgeText
              }>
              libres
            </Text>
          </View>
        </View>

        <View
          style={
            styles.progressBackground
          }>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  progressWidth,
              },
            ]}
          />
        </View>

        <View
          style={
            styles.capacityFooter
          }>
          <Text
            style={
              styles.capacityText
            }>
            {occupied} ocupados
          </Text>

          <Text
            style={
              styles.capacityText
            }>
            {course.maxCapacity}{' '}
            cupo máximo
          </Text>
        </View>
      </View>

      {mode === 'public' && (
        <View
          style={
            styles.publicNotice
          }>
          <View
            style={
              styles.publicNoticeIcon
            }>
            <Text
              style={
                styles.publicNoticeIconText
              }>
              i
            </Text>
          </View>

          <View
            style={
              styles.publicNoticeContent
            }>
            <Text
              style={
                styles.publicNoticeTitle
              }>
              Información pública
            </Text>

            <Text
              style={
                styles.publicNoticeText
              }>
              Puedes consultar todos los
              detalles del curso sin iniciar
              sesión. Para comprar o
              inscribirte deberás acceder a
              tu cuenta.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View
          style={
            styles.footerLogo
          }>
          <Text
            style={
              styles.footerLogoText
            }>
            CMP
          </Text>
        </View>

        <Text
          style={
            styles.footerTitle
          }>
          Centro Médico Pichardo
        </Text>

        <Text
          style={
            styles.footerText
          }>
          Sistema Integral de Gestión
          Médica
        </Text>
      </View>
    </ScrollView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function DetailRow({
  label,
  value,
  last = false,
}: DetailRowProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.detailRow,
        last &&
          styles.detailRowLast,
      ]}>
      <Text
        style={
          styles.detailLabel
        }>
        {label}
      </Text>

      <Text
        style={
          styles.detailValue
        }>
        {value}
      </Text>
    </View>
  );
}

function formatPrice(
  value: string | null,
): string {
  if (!value) {
    return 'Sin costo';
  }

  const amount =
    Number(value);

  if (
    Number.isFinite(amount) &&
    amount <= 0
  ) {
    return 'Sin costo';
  }

  if (
    !Number.isFinite(amount)
  ) {
    return `$${value}`;
  }

  return amount.toLocaleString(
    'es-MX',
    {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );
}

function formatDate(
  value: string,
): string {
  const datePart =
    value.split('T')[0];

  const parts =
    datePart.split('-');

  if (
    parts.length !== 3
  ) {
    return value;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingBottom: 42,
  },

  hero: {
    width: '100%',
    height: 220,
    backgroundColor: colors.primary,
  },

  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primarySoft,
  },

  heroPlaceholder: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  heroCircleLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primaryLight,
    right: -55,
    top: -80,
  },

  heroCircleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight,
    left: -40,
    bottom: -45,
  },

  placeholderLogo: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderLogoText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },

  placeholderText: {
    color: colors.primarySoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
  },

  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  categoryBadge: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginRight: 7,
    marginBottom: 7,
  },

  categoryBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },

  modalityBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 7,
  },

  modalityBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },

  title: {
    color: colors.primary,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    paddingHorizontal: 20,
    marginTop: 8,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 20,
    marginTop: 9,
  },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 17,
    paddingHorizontal: 20,
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  price: {
    color: colors.accent,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 5,
  },

  availableNumber: {
    color: colors.surface,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 4,
  },

  availableLabel: {
    color: colors.primarySoft,
    fontSize: 9,
    marginTop: 1,
  },

  summaryDivider: {
    width: 1,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 18,
  },

  purchaseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 18,
  },

  purchaseTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  purchaseIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  purchaseIconText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  purchaseInfo: {
    flex: 1,
  },

  purchaseEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  purchaseTitle: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    marginTop: 3,
  },

  purchaseDescription: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  purchaseButton: {
    minHeight: 56,
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingHorizontal: 16,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  purchaseButtonContent: {
    flex: 1,
    paddingRight: 10,
  },

  purchaseButtonPressed: {
    opacity: 0.75,
  },

  purchaseButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  purchaseButtonHelper: {
    color: colors.primary,
    fontSize: 8,
    marginTop: 2,
    opacity: 0.75,
  },

  purchaseButtonArrow: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  accountDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 13,
  },

  accountDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  accountDividerText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    marginHorizontal: 10,
  },

  createAccountButton: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  createAccountButtonPressed: {
    opacity: 0.65,
  },

  createAccountText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 17,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 14,
    marginBottom: 4,
  },

  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionIconText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '900',
  },

  sectionEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },

  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },

  detailLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  detailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: 4,
  },

  dateCards: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 12,
  },

  dateCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 13,
    marginHorizontal: 4,
  },

  dateLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
  },

  dateValue: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 5,
  },

  scheduleBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    padding: 13,
    marginTop: 9,
  },

  scheduleLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
  },

  scheduleValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  capacityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 17,
  },

  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  capacityEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  capacityTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },

  capacityBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },

  capacityBadgeNumber: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  capacityBadgeText: {
    color: colors.textSecondary,
    fontSize: 8,
  },

  progressBackground: {
    height: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 17,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },

  capacityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  capacityText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },

  publicNotice: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 15,
  },

  publicNoticeIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  publicNoticeIconText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },

  publicNoticeContent: {
    flex: 1,
  },

  publicNoticeTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  publicNoticeText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 3,
  },

  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerLogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLogoText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },

  footerTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },

  footerText: {
    color: colors.textSecondary,
    fontSize: 8,
    marginTop: 3,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  loadingBox: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingTitle: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 17,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});