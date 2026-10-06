import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import {FormField} from '../../components/auth/FormField';
import {FormSection} from '../../components/auth/FormSection';
import {GenderButton} from '../../components/auth/GenderButton';
import {PasswordField} from '../../components/auth/PasswordField';
import {authRepository} from '../../config/dependencies';
import {PublicStackParamList} from '../../navigation/types';
import {useRegisterViewModel} from '../../viewmodels/auth/useRegisterViewModel';
import {styles} from './RegisterScreen.styles';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'Register'
>;

export function RegisterScreen({
  navigation,
}: Props): React.JSX.Element {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    firstName,
    paternalLastName,
    maternalLastName,
    age,
    sex,
    email,
    phone,
    password,
    confirmPassword,
    verificationCode,
    acceptTerms,

    state,
    error,
    message,

    passwordChecks,
    passwordsMatch,

    setFirstName,
    setPaternalLastName,
    setMaternalLastName,
    setAge,
    setSex,
    setEmail,
    setPhone,
    setPassword,
    setConfirmPassword,
    setVerificationCode,
    setAcceptTerms,

    sendOtp,
    register,
    resetError,

    isSendingOtp,
    isRegistering,
    otpSent,
  } = useRegisterViewModel(
    authRepository,
  );

  const completedChecks = useMemo(
    () =>
      Object.values(
        passwordChecks,
      ).filter(Boolean).length,
    [passwordChecks],
  );

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

  useEffect(() => {
    if (
      state === 'error' &&
      error
    ) {
      Alert.alert(
        'Revisa la información',
        error,
        [
          {
            text: 'Aceptar',
            onPress: resetError,
          },
        ],
      );
    }
  }, [
    error,
    resetError,
    state,
  ]);

  useEffect(() => {
    if (
      state === 'otp_sent' &&
      message
    ) {
      Alert.alert(
        'Código enviado',
        message,
      );
    }
  }, [
    message,
    state,
  ]);

  useEffect(() => {
    if (
      state === 'success'
    ) {
      Alert.alert(
        'Cuenta creada',
        message ??
          'Tu cuenta fue creada correctamente.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () =>
              navigation.replace(
                'Login',
              ),
          },
        ],
      );
    }
  }, [
    message,
    navigation,
    state,
  ]);

  const showPrivacyNotice = () => {
    Alert.alert(
      'Aviso de privacidad',
      'AVISO PROVISIONAL\n\n'
        + 'Centro Médico Pichardo utilizará los datos '
        + 'proporcionados durante el registro para crear '
        + 'y administrar tu cuenta dentro de SIMG-CMP.\n\n'
        + 'Los datos tratados pueden incluir nombre, '
        + 'apellidos, edad, sexo, teléfono y correo '
        + 'electrónico.\n\n'
        + 'La información será utilizada para identificar '
        + 'al usuario, permitir el acceso a las funciones '
        + 'de la plataforma y mantener la relación con '
        + 'los servicios asociados a su cuenta.\n\n'
        + 'La contraseña se procesa de forma segura y no '
        + 'debe compartirse con otras personas.\n\n'
        + 'Este texto es provisional y deberá ser '
        + 'sustituido por el aviso de privacidad oficial '
        + 'del Centro Médico Pichardo antes de publicar '
        + 'la aplicación.',
      [
        {
          text: acceptTerms
            ? 'Retirar aceptación'
            : 'No acepto',
          style: 'cancel',
          onPress: () =>
            setAcceptTerms(false),
        },
        {
          text: 'He leído y acepto',
          onPress: () =>
            setAcceptTerms(true),
        },
      ],
    );
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

  const handleSendOtp =
    async () => {
      await sendOtp();
    };

  const handleRegister =
    async () => {
      await register();
    };

  const isBusy =
    isSendingOtp ||
    isRegistering;

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={
        false
      }>
      <View style={styles.hero}>
        <View
          style={
            styles.heroCircle
          }
        />

        <View
          style={
            styles.heroTop
          }>
          <View style={styles.logo}>
            <Text
              style={
                styles.logoText
              }>
              CMP
            </Text>
          </View>

          <View
            style={
              styles.heroBadge
            }>
            <Text
              style={
                styles.heroBadgeText
              }>
              REGISTRO SEGURO
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.heroTitle
          }>
          Crea tu cuenta
        </Text>

        <Text
          style={
            styles.heroDescription
          }>
          Completa tus datos para acceder a las
          funciones personales de SIMG-CMP.
        </Text>

        <View
          style={
            styles.progressRow
          }>
          <ProgressItem
            number="1"
            label="Datos"
          />

          <View
            style={
              styles.progressLine
            }
          />

          <ProgressItem
            number="2"
            label="Contacto"
          />

          <View
            style={
              styles.progressLine
            }
          />

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
          value={firstName}
          onChangeText={
            setFirstName
          }
          placeholder="Ej. Luis"
          autoCapitalize="words"
          editable={!isBusy}
          returnKeyType="next"
        />

        <FormField
          label="Apellido paterno"
          value={
            paternalLastName
          }
          onChangeText={
            setPaternalLastName
          }
          placeholder="Ej. Chávez"
          autoCapitalize="words"
          editable={!isBusy}
          returnKeyType="next"
        />

        <FormField
          label="Apellido materno"
          value={
            maternalLastName
          }
          onChangeText={
            setMaternalLastName
          }
          placeholder="Ej. Hernández"
          autoCapitalize="words"
          editable={!isBusy}
          returnKeyType="next"
        />

        <View
          style={
            styles.smallField
          }>
          <FormField
            label="Edad"
            value={age}
            onChangeText={value =>
              setAge(
                value
                  .replace(
                    /\D/g,
                    '',
                  )
                  .slice(0, 3),
              )
            }
            placeholder="Ej. 25"
            keyboardType="number-pad"
            editable={!isBusy}
          />
        </View>

        <Text
          style={
            styles.label
          }>
          Sexo
        </Text>

        <View
          style={
            styles.genderRow
          }>
          <GenderButton
            label="Masculino"
            selected={
              sex ===
              'masculino'
            }
            onPress={() =>
              setSex(
                'masculino',
              )
            }
          />

          <GenderButton
            label="Femenino"
            selected={
              sex ===
              'femenino'
            }
            onPress={() =>
              setSex(
                'femenino',
              )
            }
          />

          <GenderButton
            label="Otro"
            selected={
              sex === 'otro'
            }
            onPress={() =>
              setSex('otro')
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
          onChangeText={
            setEmail
          }
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={
            !isBusy &&
            !otpSent
          }
          returnKeyType="next"
        />

        <FormField
          label="Teléfono"
          value={phone}
          onChangeText={value =>
            setPhone(
              value
                .replace(
                  /\D/g,
                  '',
                )
                .slice(0, 10),
            )
          }
          placeholder="10 dígitos"
          keyboardType="phone-pad"
          editable={!isBusy}
        />

        <View
          style={
            styles.infoNotice
          }>
          <View
            style={
              styles.infoNoticeIcon
            }>
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
              {otpSent
                ? 'El código fue enviado. Revisa tu correo e ingrésalo abajo.'
                : 'Enviaremos un código de verificación al correo registrado.'}
            </Text>
          </View>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.loginButton,
            pressed &&
              !isBusy &&
              styles.pressed,
          ]}
          disabled={isBusy}
          onPress={
            handleSendOtp
          }>
          <Text
            style={
              styles.loginButtonText
            }>
            {isSendingOtp
              ? 'Enviando código...'
              : otpSent
                ? 'Reenviar código'
                : 'Enviar código'}
          </Text>
        </Pressable>

        {otpSent && (
          <View
            style={
              styles.otpContainer
            }>
            <FormField
              label="Código de verificación"
              value={
                verificationCode
              }
              onChangeText={value =>
                setVerificationCode(
                  value
                    .replace(
                      /\D/g,
                      '',
                    )
                    .slice(0, 6),
                )
              }
              placeholder="6 dígitos"
              keyboardType="number-pad"
              editable={!isBusy}
            />

            <Text
              style={
                styles.otpHelper
              }>
              Ingresa el código de 6 dígitos enviado a tu correo.
            </Text>
          </View>
        )}
      </FormSection>

      <FormSection
        number="03"
        title="Seguridad"
        description="Crea una contraseña para proteger tu cuenta.">
        <Text
          style={
            styles.label
          }>
          Contraseña
        </Text>

        <PasswordField
          value={password}
          onChangeText={
            setPassword
          }
          show={showPassword}
          onToggle={() =>
            setShowPassword(
              current =>
                !current,
            )
          }
          placeholder="Crea una contraseña"
        />

        <View
          style={
            styles.securityPanel
          }>
          <View
            style={
              styles.securityHeader
            }>
            <View
              style={
                styles.securityInfo
              }>
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

          <View
            style={
              styles.strengthBar
            }>
            {[
              1,
              2,
              3,
              4,
              5,
            ].map(level => (
              <View
                key={level}
                style={[
                  styles.strengthSegment,
                  completedChecks >=
                    level &&
                    styles.strengthSegmentActive,
                ]}
              />
            ))}
          </View>

          <View
            style={
              styles.requirements
            }>
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

        <Text
          style={
            styles.label
          }>
          Confirmar contraseña
        </Text>

        <PasswordField
          value={
            confirmPassword
          }
          onChangeText={
            setConfirmPassword
          }
          show={
            showConfirmPassword
          }
          onToggle={() =>
            setShowConfirmPassword(
              current =>
                !current,
            )
          }
          placeholder="Repite tu contraseña"
        />

        {confirmPassword.length >
          0 && (
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

      <View
        style={
          styles.termsCard
        }>
        <Pressable
          style={
            styles.termsRow
          }
          disabled={isBusy}
          onPress={
            showPrivacyNotice
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

          <View
            style={
              styles.termsContent
            }>
            <Text
              style={
                styles.termsTitle
              }>
              Aviso de privacidad
            </Text>

            <Text
              style={
                styles.termsText
              }>
              {acceptTerms
                ? 'Has leído y aceptado el aviso de privacidad. Toca aquí para volver a consultarlo.'
                : 'Toca aquí para leer el aviso de privacidad antes de crear tu cuenta.'}
            </Text>
          </View>
        </Pressable>
      </View>

      <Pressable
        style={({pressed}) => [
          styles.createButton,
          pressed &&
            !isBusy &&
            styles.pressed,
          isBusy &&
            styles.disabled,
        ]}
        disabled={isBusy}
        onPress={
          handleRegister
        }>
        <Text
          style={
            styles.createButtonText
          }>
          {isRegistering
            ? 'Creando cuenta...'
            : 'Crear cuenta'}
        </Text>

        {!isRegistering && (
          <Text
            style={
              styles.createButtonArrow
            }>
            →
          </Text>
        )}
      </Pressable>

      <View
        style={
          styles.loginCard
        }>
        <Text
          style={
            styles.loginEyebrow
          }>
          ¿YA TIENES CUENTA?
        </Text>

        <Text
          style={
            styles.loginTitle
          }>
          Continúa con tu cuenta actual
        </Text>

        <Text
          style={
            styles.loginDescription
          }>
          No necesitas registrarte nuevamente si
          ya formas parte de SIMG-CMP.
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.loginButton,
            pressed &&
              styles.pressed,
          ]}
          disabled={isBusy}
          onPress={() =>
            navigation.replace(
              'Login',
            )
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
        style={
          styles.homeButton
        }
        disabled={isBusy}
        onPress={goHome}>
        <Text
          style={
            styles.homeButtonText
          }>
          ← Regresar al inicio
        </Text>
      </Pressable>

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
          Sistema Integral de Gestión Médica
        </Text>
      </View>
    </KeyboardAwareScrollView>
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
    <View
      style={
        styles.requirementRow
      }>
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
          {completed
            ? '✓'
            : '·'}
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
    <View
      style={
        styles.progressItem
      }>
      <View
        style={
          styles.progressNumber
        }>
        <Text
          style={
            styles.progressNumberText
          }>
          {number}
        </Text>
      </View>

      <Text
        style={
          styles.progressLabel
        }>
        {label}
      </Text>
    </View>
  );
}