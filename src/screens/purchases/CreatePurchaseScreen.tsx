import {isValidBirthDate, validatePurchase} from '../../models/purchaseValidation';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import {FormField} from '../../components/auth/FormField';
import {AppFooter} from '../../components/common/AppFooter';
import {DetailRow} from '../../components/common/DetailRow';
import {InfoCard} from '../../components/common/InfoCard';
import {PrimaryButton} from '../../components/common/PrimaryButton';

import {
  courseRepository,
  purchaseRepository,
} from '../../config/dependencies';

import {
  CreatePurchaseInput,
  ParticipantGender,
} from '../../models/Purchase';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {useSession} from '../../session/SessionContext';
import {colors} from '../../theme/colors';

import {
  useCourseDetailViewModel,
} from '../../viewmodels/catalog/useCourseDetailViewModel';

import {
  usePurchaseViewModel,
} from '../../viewmodels/purchases/usePurchaseViewModel';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'CreatePurchase'
>;

type ParticipantForm = {
  key: number;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  birthDate: string;
  gender: ParticipantGender | '';
  phone: string;
  email: string;
};

const GENDER_OPTIONS: ParticipantGender[] = [
  'Masculino',
  'Femenino',
  'Otro',
  'Prefiere no indicar',
];

function emptyParticipant(
  key: number,
): ParticipantForm {
  return {
    key,
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
  };
}

function formatMoney(
  value: number,
): string {
  return value.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('es-MX');
}

function formatBirthDateForApi(
  date: Date,
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseBirthDate(
  value: string,
): Date {
  if (!isValidBirthDate(value)) {
    return new Date();
  }

  const [year, month, day] =
    value.split('-').map(Number);

  return new Date(
    year,
    month - 1,
    day,
  );
}

function formatBirthDateForDisplay(
  value: string,
): string {
  if (!isValidBirthDate(value)) {
    return 'Seleccionar fecha';
  }

  return parseBirthDate(value)
    .toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
}

export function CreatePurchaseScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {courseId} = route.params;
  const {user} = useSession();

  const {
    course,
    state: courseState,
    error: courseError,
    loadCourse,
  } = useCourseDetailViewModel(
    courseRepository,
  );

  const {
    purchase,
    state: purchaseState,
    error: purchaseError,
    isLoading,
    createPurchase,
  } = usePurchaseViewModel(
    purchaseRepository,
  );

  const nextKey = useRef(2);
  const confirmationOpen = useRef(false);

  const [participants, setParticipants] =
    useState<ParticipantForm[]>([
      {
        ...emptyParticipant(1),
        firstName: user?.firstName ?? '',
        paternalLastName:
          user?.paternalLastName ?? '',
        maternalLastName:
          user?.maternalLastName ?? '',
        email: user?.email ?? '',
      },
    ]);

  const [
    expandedParticipant,
    setExpandedParticipant,
  ] = useState<number | null>(1);

  const [
    expandedExtras,
    setExpandedExtras,
  ] = useState<number[]>([]);

  const [
    showObservations,
    setShowObservations,
  ] = useState(false);

  const [notes, setNotes] =
    useState('');

  useEffect(() => {
    loadCourse(courseId);
  }, [courseId, loadCourse]);

  const updateParticipant = (
    key: number,
    field: keyof Omit<
      ParticipantForm,
      'key'
    >,
    value: string,
  ) => {
    setParticipants(current =>
      current.map(item =>
        item.key === key
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const toggleParticipant = (
    key: number,
  ) => {
    setExpandedParticipant(current =>
      current === key ? null : key,
    );
  };

  const toggleExtras = (
    key: number,
  ) => {
    setExpandedExtras(current =>
      current.includes(key)
        ? current.filter(
            item => item !== key,
          )
        : [...current, key],
    );
  };

  const openBirthDatePicker = (
    participant: ParticipantForm,
  ) => {
    if (isLoading) {
      return;
    }

    Keyboard.dismiss();

    DateTimePickerAndroid.open({
      value: parseBirthDate(
        participant.birthDate,
      ),
      mode: 'date',
      display: 'calendar',
      startOnYearSelection: true,
      maximumDate: new Date(),

      onValueChange: (
        _event,
        selectedDate,
      ) => {
        const formattedDate =
          formatBirthDateForApi(
            selectedDate,
          );

        if (
          !isValidBirthDate(
            formattedDate,
          )
        ) {
          Alert.alert(
            'Fecha inválida',
            'Selecciona una fecha de nacimiento válida que no sea futura.',
          );

          return;
        }

        updateParticipant(
          participant.key,
          'birthDate',
          formattedDate,
        );
      },
    });
  };

  const unitPrice = Number(
    course?.cost ?? 0,
  );

  const hasValidPrice =
    course?.cost != null &&
    Number.isFinite(unitPrice) &&
    unitPrice > 0;

  const available = course
    ? Math.max(
        course.maxCapacity -
          (course.occupiedCapacity ?? 0),
        0,
      )
    : 0;

  const maxParticipants =
    Math.min(20, available);

  const estimatedTotal =
    unitPrice * participants.length;

  const canCreate =
    user !== null &&
    course !== null &&
    course.active &&
    hasValidPrice &&
    participants.length <= available &&
    !isLoading &&
    purchase === null;

  const addParticipant = () => {
    if (
      isLoading ||
      purchase !== null ||
      participants.length >=
        maxParticipants
    ) {
      return;
    }

    const key = nextKey.current;
    nextKey.current += 1;

    setParticipants(current => [
      ...current,
      emptyParticipant(key),
    ]);

    setExpandedParticipant(key);
  };

  const removeParticipant = (
    key: number,
  ) => {
    if (
      isLoading ||
      purchase !== null ||
      participants.length <= 1
    ) {
      return;
    }

    setParticipants(current =>
      current.filter(
        item => item.key !== key,
      ),
    );

    setExpandedExtras(current =>
      current.filter(
        item => item !== key,
      ),
    );

    setExpandedParticipant(current =>
      current === key
        ? null
        : current,
    );
  };

  const revealParticipant = (
    key: number,
    showExtraFields = false,
  ) => {
    setExpandedParticipant(key);

    if (showExtraFields) {
      setExpandedExtras(current =>
        current.includes(key)
          ? current
          : [...current, key],
      );
    }
  };

  const confirmPurchase = () => {
    if (!course || !canCreate) {
      return;
    }

    if (
      confirmationOpen.current
    ) {
      return;
    }

    const data: CreatePurchaseInput = {
      courseId: course.id,

      quantity:
        participants.length,

      participants:
        participants.map(item => ({
          participant: {
            firstName:
              item.firstName.trim(),

            paternalLastName:
              item.paternalLastName.trim(),

            maternalLastName:
              item.maternalLastName.trim() ||
              null,

            birthDate:
              item.birthDate.trim() ||
              null,

            gender:
              item.gender || null,

            phone:
              item.phone.trim() || null,

            email:
              item.email
                .trim()
                .toLowerCase() ||
              null,
          },
        })),

      userNotes:
        notes.trim() || null,
    };

    const issue = validatePurchase(data);
    if (issue) {
      if (issue.participantIndex !== undefined) {
        revealParticipant(participants[issue.participantIndex].key, true);
      }
      Alert.alert('Revisa la reserva', issue.message);
      return;
    }

    confirmationOpen.current = true;

    Alert.alert(
      'Confirmar reserva',
      `Curso: ${course.title}\n\n` +
        `Participantes: ${participants.length}\n` +
        `Total estimado: ${formatMoney(estimatedTotal)}\n\n` +
        'Se registrará una compra pendiente de pago. ' +
        'El servidor confirmará el importe y la disponibilidad.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            confirmationOpen.current =
              false;
          },
        },
        {
          text: 'Crear reserva',
          onPress: () => {
            confirmationOpen.current =
              false;

            createPurchase(data);
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  if (
    courseState === 'idle' ||
    courseState === 'loading'
  ) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.centerTitle}>
          Cargando curso...
        </Text>
      </View>
    );
  }

  if (
    courseState === 'error' ||
    !course
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>
          No fue posible cargar el curso
        </Text>

        <Text style={styles.description}>
          {courseError ??
            'Inténtalo nuevamente.'}
        </Text>

        <PrimaryButton
          label="Reintentar"
          onPress={() => {
            loadCourse(courseId);
          }}
        />
      </View>
    );
  }

  if (
    purchaseState === 'success' &&
    purchase
  ) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }>

        <Text style={styles.eyebrow}>
          COMPRA REGISTRADA
        </Text>

        <Text style={styles.title}>
          Reserva creada
        </Text>

        <Text style={styles.description}>
          Tu compra quedó registrada
          correctamente. Conserva tu folio
          para realizar y reportar el pago.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Resumen de la reserva
          </Text>

          <DetailRow
            label="Folio"
            value={purchase.folio}
          />

          <DetailRow
            label="Curso"
            value={
              purchase.courseTitle
            }
          />

          <DetailRow
            label="Cupos"
            value={String(
              purchase.quantity,
            )}
          />

          <DetailRow
            label="Total"
            value={formatMoney(
              Number(purchase.total),
            )}
          />

          <DetailRow
            label="Estado"
            value={purchase.status}
          />

          <DetailRow
            label="Límite de pago"
            value={formatDate(
              purchase.paymentDeadline,
            )}
            last
          />
        </View>

        <InfoCard
          icon="i"
          title="Pendiente de pago"
          description="La compra no representa una inscripción definitiva. El pago debe reportarse y ser validado por la administración."
        />

        <View style={styles.action}>
          <PrimaryButton
            label="Volver al catálogo"
            onPress={() =>
              navigation.navigate(
                'Catalog',
              )
            }
          />
        </View>

        <AppFooter />
      </ScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}>

      <Text style={styles.eyebrow}>
        ADQUISICIÓN DE CURSOS
      </Text>

      <Text style={styles.title}>
        Comprar curso
      </Text>

      <Text style={styles.description}>
        Registra los datos de contacto
        y los datos personales de quienes
        participarán en el curso.
      </Text>

      <View style={styles.courseCard}>
        <Text style={styles.courseLabel}>
          CURSO SELECCIONADO
        </Text>

        <Text style={styles.courseTitle}>
          {course.title}
        </Text>

        <View style={styles.courseSummary}>
          <View>
            <Text style={styles.smallLabel}>
              Precio por cupo
            </Text>

            <Text style={styles.courseValue}>
              {hasValidPrice
                ? formatMoney(unitPrice)
                : 'No disponible'}
            </Text>
          </View>

          <View style={styles.summaryRight}>
            <Text style={styles.smallLabel}>
              Cupos en catálogo
            </Text>

            <Text style={styles.courseValue}>
              {available}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Cantidad de participantes
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quitar un participante"
            disabled={
              isLoading ||
              participants.length <= 1
            }
            style={[
              styles.quantityButton,
              participants.length <= 1 &&
                styles.disabled,
            ]}
            onPress={() => {
              const last =
                participants[
                  participants.length - 1
                ];

              if (last) {
                removeParticipant(
                  last.key,
                );
              }
            }}>
            <Text style={styles.quantitySymbol}>
              −
            </Text>
          </Pressable>

          <Text style={styles.quantityValue}>
            {participants.length}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agregar un participante"
            disabled={
              isLoading ||
              participants.length >=
                maxParticipants
            }
            style={[
              styles.quantityButton,
              participants.length >=
                maxParticipants &&
                styles.disabled,
            ]}
            onPress={addParticipant}>
            <Text style={styles.quantitySymbol}>
              +
            </Text>
          </Pressable>
        </View>

        <Text style={styles.quantityHelper}>
          Un participante por cada lugar.
          Máximo 20 por compra.
        </Text>
      </View>

      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>
          Datos de participantes
        </Text>

        <Text style={styles.description}>
          Los campos con * son obligatorios.
          Los demás son opcionales.
        </Text>

        {participants.map((item, index) => {
          const expanded =
            expandedParticipant ===
            item.key;

          const extrasOpen =
            expandedExtras.includes(
              item.key,
            );

          const participantName = [
            item.firstName.trim(),
            item.paternalLastName.trim(),
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <View
              key={item.key}
              style={styles.participantCard}>

              <View style={styles.participantHeader}>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Mostrar u ocultar participante ${index + 1}`}
                  style={
                    styles.participantHeaderMain
                  }
                  onPress={() =>
                    toggleParticipant(
                      item.key,
                    )
                  }>

                  <View
                    style={
                      styles.participantInfo
                    }>
                    <Text
                      style={
                        styles.participantTitle
                      }>
                      Participante {index + 1}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={
                        styles.participantSubtitle
                      }>
                      {participantName ||
                        'Datos pendientes'}
                    </Text>
                  </View>

                  <Text style={styles.chevron}>
                    {expanded ? '⌃' : '⌄'}
                  </Text>
                </Pressable>

                {participants.length > 1 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar participante ${index + 1}`}
                    disabled={isLoading}
                    onPress={() =>
                      removeParticipant(
                        item.key,
                      )
                    }
                    style={
                      styles.headerDeleteButton
                    }>
                    <Text
                      style={
                        styles.headerDeleteText
                      }>
                      Eliminar
                    </Text>
                  </Pressable>
                )}
              </View>

              {expanded && (
                <View
                  style={
                    styles.participantContent
                  }>

                  <FormField
                    label="Nombre(s) *"
                    value={
                      item.firstName
                    }
                    onChangeText={value =>
                      updateParticipant(
                        item.key,
                        'firstName',
                        value,
                      )
                    }
                    editable={!isLoading}
                    autoCapitalize="words"
                    maxLength={100}
                  />

                  <FormField
                    label="Apellido paterno *"
                    value={
                      item.paternalLastName
                    }
                    onChangeText={value =>
                      updateParticipant(
                        item.key,
                        'paternalLastName',
                        value,
                      )
                    }
                    editable={!isLoading}
                    autoCapitalize="words"
                    maxLength={100}
                  />

                  <Text style={styles.fieldLabel}>
                    Sexo (opcional)
                  </Text>

                  <View style={styles.genderGrid}>
                    {GENDER_OPTIONS.map(option => {
                      const selected =
                        item.gender === option;

                      return (
                        <Pressable
                          key={option}
                          accessibilityRole="button"
                          accessibilityState={{
                            selected,
                          }}
                          disabled={isLoading}
                          onPress={() =>
                            updateParticipant(
                              item.key,
                              'gender',
                              option,
                            )
                          }
                          style={[
                            styles.genderButton,
                            selected &&
                              styles.genderSelected,
                          ]}>

                          <Text
                            style={[
                              styles.genderText,
                              selected &&
                                styles.genderTextSelected,
                            ]}>
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <FormField
                    label="Teléfono de contacto (opcional)"
                    value={item.phone}
                    placeholder="Número para contactar"
                    onChangeText={value =>
                      updateParticipant(
                        item.key,
                        'phone',
                        value,
                      )
                    }
                    editable={!isLoading}
                    keyboardType="phone-pad"
                    maxLength={20}
                  />

                  <Text
                    style={styles.fieldLabel}>
                    Fecha de nacimiento (opcional)
                  </Text>

                  <View
                    style={styles.birthDateRow}>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Seleccionar fecha de nacimiento"
                      disabled={isLoading}
                      onPress={() =>
                        openBirthDatePicker(
                          item,
                        )
                      }
                      style={
                        styles.birthDateButton
                      }>

                      <Text
                        style={
                          item.birthDate
                            ? styles.birthDateValue
                            : styles.birthDatePlaceholder
                        }>
                        {formatBirthDateForDisplay(
                          item.birthDate,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.calendarIcon
                        }>
                        📅
                      </Text>
                    </Pressable>

                    {item.birthDate !== '' && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Quitar fecha de nacimiento"
                        disabled={isLoading}
                        style={
                          styles.clearDateButton
                        }
                        onPress={() =>
                          updateParticipant(
                            item.key,
                            'birthDate',
                            '',
                          )
                        }>
                        <Text
                          style={
                            styles.clearDateText
                          }>
                          Quitar
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      toggleExtras(
                        item.key,
                      )
                    }
                    style={
                      styles.extrasButton
                    }>

                    <Text
                      style={
                        styles.extrasText
                      }>
                      {extrasOpen
                        ? '− Ocultar datos adicionales'
                        : '+ Datos adicionales (opcionales)'}
                    </Text>
                  </Pressable>

                  {extrasOpen && (
                    <View
                      style={
                        styles.extrasContent
                      }>

                      <FormField
                        label="Apellido materno"
                        value={
                          item.maternalLastName
                        }
                        onChangeText={value =>
                          updateParticipant(
                            item.key,
                            'maternalLastName',
                            value,
                          )
                        }
                        editable={!isLoading}
                        autoCapitalize="words"
                        maxLength={100}
                      />

                      <FormField
                        label="Correo electrónico"
                        value={item.email}
                        onChangeText={value =>
                          updateParticipant(
                            item.key,
                            'email',
                            value,
                          )
                        }
                        editable={!isLoading}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={150}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <Pressable
          disabled={
            isLoading ||
            participants.length >=
              maxParticipants
          }
          onPress={addParticipant}
          style={[
            styles.addButton,
            participants.length >=
              maxParticipants &&
              styles.disabled,
          ]}>

          <Text
            style={
              styles.addButtonText
            }>
            + Agregar participante
          </Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() =>
          setShowObservations(
            current => !current,
          )
        }
        style={
          styles.observationsButton
        }>

        <Text
          style={
            styles.observationsText
          }>
          {showObservations
            ? '− Ocultar observaciones'
            : '+ Agregar observaciones (opcional)'}
        </Text>
      </Pressable>

      {showObservations && (
        <TextInput
          style={
            styles.observationsInput
          }
          value={notes}
          onChangeText={setNotes}
          editable={!isLoading}
          placeholder="Información adicional sobre tu compra"
          placeholderTextColor={
            colors.textSecondary
          }
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
      )}

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          TOTAL ESTIMADO
        </Text>

        <Text style={styles.totalValue}>
          {hasValidPrice
            ? formatMoney(
                estimatedTotal,
              )
            : 'No disponible'}
        </Text>

        <Text
          style={
            styles.totalDescription
          }>
          {participants.length} participante(s).
          El importe definitivo será
          calculado por el servidor.
        </Text>
      </View>

      {!course.active && (
        <Text style={styles.warning}>
          Este curso no está activo.
        </Text>
      )}

      {!hasValidPrice && (
        <Text style={styles.warning}>
          La compra de este curso no está
          habilitada. El flujo de cursos
          gratuitos requiere integración
          adicional.
        </Text>
      )}

      {participants.length > available && (
        <Text style={styles.warning}>
          La cantidad solicitada supera
          los cupos mostrados en el catálogo.
        </Text>
      )}

      {purchaseError && (
        <Text style={styles.warning}>
          {purchaseError}
        </Text>
      )}

      <View style={styles.action}>
        <PrimaryButton
          label={
            isLoading
              ? 'Registrando compra...'
              : 'Revisar y confirmar reserva'
          }
          disabled={!canCreate}
          onPress={confirmPurchase}
          showArrow
        />
      </View>

      <Text style={styles.notice}>
        Se creará una reserva pendiente de
        pago. La inscripción se generará
        cuando la administración valide
        el pago correspondiente.
      </Text>

      <AppFooter />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 18,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: colors.background,
  },

  centerTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 15,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  title: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 5,
    marginBottom: 7,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 15,
    marginTop: 13,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 9,
  },

  courseCard: {
    backgroundColor: colors.primary,
    borderRadius: 17,
    padding: 17,
    marginTop: 12,
  },

  courseLabel: {
    color: colors.primarySoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  courseTitle: {
    color: colors.surface,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '900',
    marginTop: 5,
  },

  courseSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  smallLabel: {
    color: colors.primarySoft,
    fontSize: 10,
  },

  courseValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  quantityButton: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  quantitySymbol: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: '700',
  },

  quantityValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
    marginHorizontal: 23,
  },

  quantityHelper: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },

  participantsSection: {
    marginTop: 23,
  },

  participantCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    marginTop: 9,
    overflow: 'hidden',
  },

  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  participantHeaderMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },

  participantInfo: {
    flex: 1,
  },

  participantTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  participantSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  chevron: {
    color: colors.primary,
    fontSize: 23,
    marginHorizontal: 9,
  },

  headerDeleteButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginLeft: 4,
  },

  headerDeleteText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '800',
  },

  participantContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 13,
  },

  fieldLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 9,
  },

  genderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  genderButton: {
    width: '48%',
    minHeight: 43,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    marginBottom: 8,
  },

  genderSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  genderText: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },

  genderTextSelected: {
    color: colors.primary,
    fontWeight: '900',
  },

  birthDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  birthDateButton: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  birthDateValue: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },

  birthDatePlaceholder: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },

  calendarIcon: {
    fontSize: 17,
    marginLeft: 8,
  },

  clearDateButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginLeft: 6,
  },

  clearDateText: {
    color: colors.error,
    fontSize: 11,
    fontWeight: '800',
  },

  extrasButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  extrasText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  extrasContent: {
    paddingTop: 5,
  },

  addButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 13,
    backgroundColor: colors.surface,
  },

  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  observationsButton: {
    marginTop: 18,
    paddingVertical: 10,
  },

  observationsText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  observationsInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 86,
    padding: 13,
    color: colors.text,
    fontSize: 13,
  },

  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },

  totalLabel: {
    color: colors.primarySoft,
    fontSize: 10,
    fontWeight: '800',
  },

  totalValue: {
    color: colors.accent,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 5,
  },

  totalDescription: {
    color: colors.primarySoft,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  warning: {
    color: colors.error,
    backgroundColor: colors.surface,
    fontSize: 12,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    lineHeight: 18,
  },

  action: {
    marginTop: 16,
  },

  notice: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 16,
  },

  disabled: {
    opacity: 0.4,
  },
});
