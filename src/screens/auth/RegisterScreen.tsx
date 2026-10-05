import React, {
  useMemo,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {FormField} from '../../components/auth/FormField';
import {FormSection} from '../../components/auth/FormSection';
import {GenderButton} from '../../components/auth/GenderButton';
import {PasswordField} from '../../components/auth/PasswordField';
import {PublicStackParamList} from '../../navigation/types';
import {styles} from './RegisterScreen.styles';

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
  const [gender, setGender] = useState<Gender>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

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
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const completedChecks = Object.values(
    passwordChecks,
  ).filter(Boolean).length;

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
      routes: [
        {
          name: 'Home',
        },
      ],
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
        contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.heroCircle} />

          <View style={styles.heroTop}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                CMP
              </Text>
            </View>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                REGISTRO SEGURO
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Crea tu cuenta
          </Text>

          <Text style={styles.heroDescription}>
            Completa tus datos para acceder a las
            funciones personales de SIMG-CMP.
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
          <FormField
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej. Luis"
            autoCapitalize="words"
          />

          <FormField
            label="Apellido paterno"
            value={paternalLastName}
            onChangeText={setPaternalLastName}
            placeholder="Ej. Chávez"
            autoCapitalize="words"
          />

          <FormField
            label="Apellido materno"
            value={maternalLastName}
            onChangeText={setMaternalLastName}
            placeholder="Ej. Hernández"
            autoCapitalize="words"
          />

          <View style={styles.smallField}>
            <FormField
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
              selected={gender === 'masculino'}
              onPress={() =>
                setGender('masculino')
              }
            />

            <GenderButton
              label="Femenino"
              selected={gender === 'femenino'}
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
          <FormField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormField
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
            <View style={styles.infoNoticeIcon}>
              <Text
                style={styles.infoNoticeIconText}>
                i
              </Text>
            </View>

            <View
              style={styles.infoNoticeContent}>
              <Text
                style={styles.infoNoticeTitle}>
                Verificación de correo
              </Text>

              <Text
                style={styles.infoNoticeText}>
                Posteriormente se enviará un código
                de verificación al correo
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
                <Text style={styles.securityTitle}>
                  Seguridad de la contraseña
                </Text>

                <Text
                  style={styles.securitySubtitle}>
                  Cumple los requisitos para
                  proteger mejor tu cuenta.
                </Text>
              </View>

              <View style={styles.securityBadge}>
                <Text
                  style={styles.securityBadgeText}>
                  {getPasswordLevel()}
                </Text>
              </View>
            </View>

            <View style={styles.strengthBar}>
              {[1, 2, 3, 4, 5].map(level => (
                <View
                  key={level}
                  style={[
                    styles.strengthSegment,
                    completedChecks >= level &&
                      styles.strengthSegmentActive,
                  ]}
                />
              ))}
            </View>

            <View style={styles.requirements}>
              <PasswordRequirement
                completed={passwordChecks.length}
                text="Mínimo 8 caracteres"
              />

              <PasswordRequirement
                completed={passwordChecks.uppercase}
                text="Una letra mayúscula"
              />

              <PasswordRequirement
                completed={passwordChecks.lowercase}
                text="Una letra minúscula"
              />

              <PasswordRequirement
                completed={passwordChecks.number}
                text="Un número"
              />

              <PasswordRequirement
                completed={passwordChecks.special}
                text="Un carácter especial"
              />
            </View>
          </View>

          <Text style={styles.label}>
            Confirmar contraseña
          </Text>

          <PasswordField
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
                  {passwordsMatch ? '✓' : '!'}
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
                <Text style={styles.checkboxCheck}>
                  ✓
                </Text>
              )}
            </View>

            <View style={styles.termsContent}>
              <Text style={styles.termsTitle}>
                Términos y privacidad
              </Text>

              <Text style={styles.termsText}>
                Acepto los términos y condiciones y
                el aviso de privacidad de la
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
          <Text style={styles.createButtonText}>
            Crear cuenta
          </Text>

          <Text style={styles.createButtonArrow}>
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

          <Text style={styles.loginDescription}>
            No necesitas registrarte nuevamente si
            ya formas parte de SIMG-CMP.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              navigation.replace('Login')
            }>
            <Text style={styles.loginButtonText}>
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
            <Text style={styles.footerLogoText}>
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
        <Text style={styles.progressNumberText}>
          {number}
        </Text>
      </View>

      <Text style={styles.progressLabel}>
        {label}
      </Text>
    </View>
  );
}