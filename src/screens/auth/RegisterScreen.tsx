import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {PublicStackParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'Register'
>;

type Gender =
  | 'masculino'
  | 'femenino'
  | 'otro'
  | '';

export function RegisterScreen({
  navigation,
}: Props): React.JSX.Element {
  const [name, setName] = useState('');
  const [
    paternalLastName,
    setPaternalLastName,
  ] = useState('');
  const [
    maternalLastName,
    setMaternalLastName,
  ] = useState('');

  const [age, setAge] = useState('');
  const [gender, setGender] =
    useState<Gender>('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    acceptTerms,
    setAcceptTerms,
  ] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(
        password,
      ),
    }),
    [password],
  );

  const completedChecks =
    Object.values(passwordChecks).filter(
      Boolean,
    ).length;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const getPasswordLevel = () => {
    if (password.length === 0) {
      return 'Sin evaluar';
    }

    if (completedChecks <= 2) {
      return 'Débil';
    }

    if (completedChecks <= 4) {
      return 'Buena';
    }

    return 'Segura';
  };

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }>
        <View style={styles.hero}>
          <View style={styles.heroCircle} />

          <View style={styles.heroTop}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                CMP
              </Text>
            </View>

            <View style={styles.heroBadge}>
              <Text
                style={
                  styles.heroBadgeText
                }>
                REGISTRO SEGURO
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Crea tu cuenta
          </Text>

          <Text style={styles.heroDescription}>
            Completa tus datos para acceder a
            las funciones personales de
            SIMG-CMP.
          </Text>

          <View style={styles.progressRow}>
            <ProgressItem
              number="1"
              label="Datos"
            />

            <View style={styles.progressLine} />

            <ProgressItem
              number="2"
              label="Contacto"
            />

            <View style={styles.progressLine} />

            <ProgressItem
              number="3"
              label="Seguridad"
            />
          </View>
        </View>

        <FormSection
          number="01"
          title="Datos personales"
          description="Ingresa tu información personal.">
          <Field
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej. Luis"
            autoCapitalize="words"
          />

          <Field
            label="Apellido paterno"
            value={paternalLastName}
            onChangeText={
              setPaternalLastName
            }
            placeholder="Ej. Chávez"
            autoCapitalize="words"
          />

          <Field
            label="Apellido materno"
            value={maternalLastName}
            onChangeText={
              setMaternalLastName
            }
            placeholder="Ej. Hernández"
            autoCapitalize="words"
          />

          <View style={styles.smallField}>
            <Field
              label="Edad"
              value={age}
              onChangeText={value =>
                setAge(
                  value
                    .replace(/\D/g, '')
                    .slice(0, 3),
                )
              }
              placeholder="Ej. 25"
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.label}>
            Sexo
          </Text>

          <View style={styles.genderRow}>
            <GenderButton
              label="Masculino"
              selected={
                gender === 'masculino'
              }
              onPress={() =>
                setGender('masculino')
              }
            />

            <GenderButton
              label="Femenino"
              selected={
                gender === 'femenino'
              }
              onPress={() =>
                setGender('femenino')
              }
            />

            <GenderButton
              label="Otro"
              selected={gender === 'otro'}
              onPress={() =>
                setGender('otro')
              }
            />
          </View>
        </FormSection>

        <FormSection
          number="02"
          title="Información de contacto"
          description="Estos datos estarán asociados a tu cuenta.">
          <Field
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="Teléfono"
            value={phone}
            onChangeText={value =>
              setPhone(
                value
                  .replace(/\D/g, '')
                  .slice(0, 10),
              )
            }
            placeholder="10 dígitos"
            keyboardType="phone-pad"
          />

          <View style={styles.infoNotice}>
            <View
              style={styles.infoNoticeIcon}>
              <Text
                style={
                  styles.infoNoticeIconText
                }>
                i
              </Text>
            </View>

            <View
              style={
                styles.infoNoticeContent
              }>
              <Text
                style={
                  styles.infoNoticeTitle
                }>
                Verificación de correo
              </Text>

              <Text
                style={
                  styles.infoNoticeText
                }>
                Posteriormente se enviará un
                código de verificación al correo
                registrado.
              </Text>
            </View>
          </View>
        </FormSection>

        <FormSection
          number="03"
          title="Seguridad"
          description="Crea una contraseña para proteger tu cuenta.">
          <Text style={styles.label}>
            Contraseña
          </Text>

          <PasswordField
            value={password}
            onChangeText={setPassword}
            show={showPassword}
            onToggle={() =>
              setShowPassword(
                current => !current,
              )
            }
            placeholder="Crea una contraseña"
          />

          <View style={styles.securityPanel}>
            <View style={styles.securityHeader}>
              <View style={styles.securityInfo}>
                <Text
                  style={
                    styles.securityTitle
                  }>
                  Seguridad de la contraseña
                </Text>

                <Text
                  style={
                    styles.securitySubtitle
                  }>
                  Cumple los requisitos para
                  proteger mejor tu cuenta.
                </Text>
              </View>

              <View
                style={
                  styles.securityBadge
                }>
                <Text
                  style={
                    styles.securityBadgeText
                  }>
                  {getPasswordLevel()}
                </Text>
              </View>
            </View>

            <View style={styles.strengthBar}>
              {[1, 2, 3, 4, 5].map(
                level => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      completedChecks >=
                        level &&
                        styles.strengthSegmentActive,
                    ]}
                  />
                ),
              )}
            </View>

            <View style={styles.requirements}>
              <PasswordRequirement
                completed={
                  passwordChecks.length
                }
                text="Mínimo 8 caracteres"
              />

              <PasswordRequirement
                completed={
                  passwordChecks.uppercase
                }
                text="Una letra mayúscula"
              />

              <PasswordRequirement
                completed={
                  passwordChecks.lowercase
                }
                text="Una letra minúscula"
              />

              <PasswordRequirement
                completed={
                  passwordChecks.number
                }
                text="Un número"
              />

              <PasswordRequirement
                completed={
                  passwordChecks.special
                }
                text="Un carácter especial"
              />
            </View>
          </View>

          <Text style={styles.label}>
            Confirmar contraseña
          </Text>

          <PasswordField
            value={confirmPassword}
            onChangeText={
              setConfirmPassword
            }
            show={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword(
                current => !current,
              )
            }
            placeholder="Repite tu contraseña"
          />

          {confirmPassword.length > 0 && (
            <View
              style={[
                styles.matchBox,
                passwordsMatch
                  ? styles.matchBoxSuccess
                  : styles.matchBoxError,
              ]}>
              <View
                style={[
                  styles.matchIcon,
                  passwordsMatch &&
                    styles.matchIconSuccess,
                ]}>
                <Text
                  style={[
                    styles.matchIconText,
                    passwordsMatch &&
                      styles.matchIconTextSuccess,
                  ]}>
                  {passwordsMatch
                    ? '✓'
                    : '!'}
                </Text>
              </View>

              <Text
                style={[
                  styles.matchText,
                  passwordsMatch &&
                    styles.matchTextSuccess,
                ]}>
                {passwordsMatch
                  ? 'Las contraseñas coinciden'
                  : 'Las contraseñas no coinciden'}
              </Text>
            </View>
          )}
        </FormSection>

        <View style={styles.termsCard}>
          <Pressable
            style={styles.termsRow}
            onPress={() =>
              setAcceptTerms(
                current => !current,
              )
            }>
            <View
              style={[
                styles.checkbox,
                acceptTerms &&
                  styles.checkboxSelected,
              ]}>
              {acceptTerms && (
                <Text
                  style={
                    styles.checkboxCheck
                  }>
                  ✓
                </Text>
              )}
            </View>

            <View style={styles.termsContent}>
              <Text style={styles.termsTitle}>
                Términos y privacidad
              </Text>

              <Text style={styles.termsText}>
                Acepto los términos y condiciones
                y el aviso de privacidad de la
                plataforma.
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.createButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {}}>
          <Text
            style={
              styles.createButtonText
            }>
            Crear cuenta
          </Text>

          <Text
            style={
              styles.createButtonArrow
            }>
            →
          </Text>
        </Pressable>

        <View style={styles.loginCard}>
          <Text style={styles.loginEyebrow}>
            ¿YA TIENES CUENTA?
          </Text>

          <Text style={styles.loginTitle}>
            Continúa con tu cuenta actual
          </Text>

          <Text
            style={
              styles.loginDescription
            }>
            No necesitas registrarte nuevamente
            si ya formas parte de SIMG-CMP.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.replace('Login')
            }>
            <Text
              style={
                styles.loginButtonText
              }>
              Iniciar sesión
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.homeButton}
          onPress={goHome}>
          <Text style={styles.homeButtonText}>
            ← Regresar al inicio
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Text
              style={
                styles.footerLogoText
              }>
              CMP
            </Text>
          </View>

          <Text style={styles.footerTitle}>
            Centro Médico Pichardo
          </Text>

          <Text style={styles.footerText}>
            Sistema Integral de Gestión Médica
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FormSectionProps = {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function FormSection({
  number,
  title,
  description,
  children,
}: FormSectionProps): React.JSX.Element {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionNumber}>
          <Text
            style={
              styles.sectionNumberText
            }>
            {number}
          </Text>
        </View>

        <View
          style={
            styles.sectionHeadingContent
          }>
          <Text style={styles.sectionTitle}>
            {title}
          </Text>

          <Text
            style={
              styles.sectionDescription
            }>
            {description}
          </Text>
        </View>
      </View>

      {children}
    </View>
  );
}

type FieldProps = TextInputProps & {
  label: string;
};

function Field({
  label,
  ...props
}: FieldProps): React.JSX.Element {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor={
          colors.textSecondary
        }
        style={styles.input}
      />
    </View>
  );
}

type PasswordFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
};

function PasswordField({
  value,
  onChangeText,
  show,
  onToggle,
  placeholder,
}: PasswordFieldProps): React.JSX.Element {
  return (
    <View style={styles.passwordContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          colors.textSecondary
        }
        secureTextEntry={!show}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.passwordInput}
      />

      <Pressable
        style={styles.showButton}
        onPress={onToggle}>
        <Text style={styles.showButtonText}>
          {show
            ? 'Ocultar'
            : 'Mostrar'}
        </Text>
      </Pressable>
    </View>
  );
}

type PasswordRequirementProps = {
  completed: boolean;
  text: string;
};

function PasswordRequirement({
  completed,
  text,
}: PasswordRequirementProps): React.JSX.Element {
  return (
    <View style={styles.requirementRow}>
      <View
        style={[
          styles.requirementIcon,
          completed &&
            styles.requirementIconCompleted,
        ]}>
        <Text
          style={[
            styles.requirementIconText,
            completed &&
              styles.requirementIconTextCompleted,
          ]}>
          {completed ? '✓' : '·'}
        </Text>
      </View>

      <Text
        style={[
          styles.requirementText,
          completed &&
            styles.requirementTextCompleted,
        ]}>
        {text}
      </Text>
    </View>
  );
}

type GenderButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function GenderButton({
  label,
  selected,
  onPress,
}: GenderButtonProps): React.JSX.Element {
  return (
    <Pressable
      style={({pressed}) => [
        styles.genderButton,
        selected &&
          styles.genderButtonSelected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}>
      <View
        style={[
          styles.genderIndicator,
          selected &&
            styles.genderIndicatorSelected,
        ]}>
        {selected && (
          <View
            style={
              styles.genderIndicatorInner
            }
          />
        )}
      </View>

      <Text
        style={[
          styles.genderText,
          selected &&
            styles.genderTextSelected,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ProgressItemProps = {
  number: string;
  label: string;
};

function ProgressItem({
  number,
  label,
}: ProgressItemProps): React.JSX.Element {
  return (
    <View style={styles.progressItem}>
      <View style={styles.progressNumber}>
        <Text
          style={
            styles.progressNumberText
          }>
          {number}
        </Text>
      </View>

      <Text style={styles.progressLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 42,
  },

  hero: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 22,
    overflow: 'hidden',
    marginBottom: 16,
  },

  heroCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryLight,
    right: -60,
    top: -65,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
  },

  heroBadge: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  heroBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: colors.surface,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 18,
  },

  heroDescription: {
    color: colors.primarySoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: '92%',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 22,
  },

  progressItem: {
    alignItems: 'center',
  },

  progressNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressNumberText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  progressLabel: {
    color: colors.primarySoft,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 5,
  },

  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primaryLight,
    marginTop: 14,
    marginHorizontal: 7,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 21,
    padding: 18,
    marginBottom: 14,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 15,
    marginBottom: 18,
  },

  sectionNumber: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionNumberText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '900',
  },

  sectionHeadingContent: {
    flex: 1,
  },

  sectionTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  sectionDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  fieldGroup: {
    marginBottom: 15,
  },

  smallField: {
    maxWidth: 130,
  },

  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },

  genderRow: {
    flexDirection: 'row',
    marginHorizontal: -3,
  },

  genderButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    marginHorizontal: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  genderButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  genderIndicator: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },

  genderIndicatorSelected: {
    borderColor: colors.accent,
  },

  genderIndicatorInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  genderText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },

  genderTextSelected: {
    color: colors.surface,
  },

  infoNotice: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    padding: 13,
  },

  infoNoticeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoNoticeIconText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },

  infoNoticeContent: {
    flex: 1,
  },

  infoNoticeTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  infoNoticeText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  passwordContainer: {
    height: 50,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  passwordInput: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },

  showButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },

  showButtonText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
  },

  securityPanel: {
    backgroundColor: colors.primarySoft,
    borderRadius: 15,
    padding: 14,
    marginBottom: 18,
  },

  securityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  securityInfo: {
    flex: 1,
    paddingRight: 10,
  },

  securityTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  securitySubtitle: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  securityBadge: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  securityBadgeText: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
  },

  strengthBar: {
    flexDirection: 'row',
    marginTop: 13,
    marginHorizontal: -2,
  },

  strengthSegment: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginHorizontal: 2,
  },

  strengthSegmentActive: {
    backgroundColor: colors.accent,
  },

  requirements: {
    marginTop: 12,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  requirementIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  requirementIconCompleted: {
    backgroundColor: colors.primary,
  },

  requirementIconText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '900',
  },

  requirementIconTextCompleted: {
    color: colors.accent,
  },

  requirementText: {
    color: colors.textSecondary,
    fontSize: 10,
  },

  requirementTextCompleted: {
    color: colors.primary,
    fontWeight: '700',
  },

  matchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    padding: 10,
    marginTop: -5,
  },

  matchBoxSuccess: {
    backgroundColor: colors.primarySoft,
  },

  matchBoxError: {
    backgroundColor: colors.accentSoft,
  },

  matchIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  matchIconSuccess: {
    backgroundColor: colors.primary,
  },

  matchIconText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  matchIconTextSuccess: {
    color: colors.accent,
  },

  matchText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  matchTextSuccess: {
    color: colors.primary,
  },

  termsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 15,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
  },

  checkboxCheck: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },

  termsContent: {
    flex: 1,
  },

  termsTitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  termsText: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  createButton: {
    minHeight: 54,
    backgroundColor: colors.accent,
    borderRadius: 14,
    marginTop: 15,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  createButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  createButtonArrow: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  loginCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 17,
    marginTop: 15,
  },

  loginEyebrow: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  loginTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },

  loginDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  loginButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
  },

  loginButtonText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '800',
  },

  homeButton: {
    alignItems: 'center',
    paddingVertical: 19,
  },

  homeButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  footer: {
    alignItems: 'center',
    marginTop: 4,
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

  pressed: {
    opacity: 0.75,
  },
});