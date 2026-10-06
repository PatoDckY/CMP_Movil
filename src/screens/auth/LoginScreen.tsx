import React, {
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import {AuthBrand} from '../../components/auth/AuthBrand';
import {authRepository} from '../../config/dependencies';
import {PublicStackParamList} from '../../navigation/types';
import {useSession} from '../../session/SessionContext';
import {colors} from '../../theme/colors';
import {useLoginViewModel} from '../../viewmodels/auth/useLoginViewModel';
import {styles} from './LoginScreen.styles';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'Login'
>;

export function LoginScreen({
  navigation,
}: Props): React.JSX.Element {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    setAuthenticatedUser,
  } = useSession();

  const {
    email,
    password,
    state,
    error,
    mfaEmail,
    setEmail,
    setPassword,
    login,
    resetError,
    isLoading,
  } = useLoginViewModel(
    authRepository,
  );

  useEffect(() => {
    if (
      state === 'error' &&
      error
    ) {
      Alert.alert(
        'No fue posible iniciar sesión',
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
      state === 'mfa_required' &&
      mfaEmail
    ) {
      Alert.alert(
        'Verificación adicional',
        `La cuenta ${mfaEmail} requiere autenticación de dos factores.`,
      );
    }
  }, [
    mfaEmail,
    state,
  ]);

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

  const handleLogin =
    async () => {
      const result =
        await login();

      if (
        result?.status ===
        'authenticated'
      ) {
        setAuthenticatedUser(
          result.user,
        );
      }
    };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={
        styles.container
      }
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={
        false
      }>
      <AuthBrand />

      <View style={styles.hero}>
        <View
          style={
            styles.heroCircle
          }
        />

        <View
          style={
            styles.heroBadge
          }>
          <Text
            style={
              styles.heroBadgeText
            }>
            ACCESO A TU CUENTA
          </Text>
        </View>

        <Text
          style={
            styles.heroTitle
          }>
          Bienvenido de nuevo
        </Text>

        <Text
          style={
            styles.heroText
          }>
          Inicia sesión para acceder a tus funciones
          personales dentro de SIMG-CMP.
        </Text>
      </View>

      <View
        style={
          styles.formCard
        }>
        <Text
          style={
            styles.formTitle
          }>
          Iniciar sesión
        </Text>

        <Text
          style={
            styles.formDescription
          }>
          Ingresa los datos asociados a tu cuenta.
        </Text>

        <Text
          style={
            styles.label
          }>
          Correo electrónico
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          placeholderTextColor={
            colors.textSecondary
          }
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          returnKeyType="next"
          style={styles.input}
        />

        <Text
          style={
            styles.label
          }>
          Contraseña
        </Text>

        <View
          style={
            styles.passwordContainer
          }>
          <TextInput
            value={password}
            onChangeText={
              setPassword
            }
            placeholder="Ingresa tu contraseña"
            placeholderTextColor={
              colors.textSecondary
            }
            secureTextEntry={
              !showPassword
            }
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="done"
            onSubmitEditing={
              handleLogin
            }
            style={
              styles.passwordInput
            }
          />

          <Pressable
            style={
              styles.showButton
            }
            disabled={
              isLoading
            }
            onPress={() =>
              setShowPassword(
                current =>
                  !current,
              )
            }>
            <Text
              style={
                styles.showButtonText
              }>
              {showPassword
                ? 'Ocultar'
                : 'Mostrar'}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={({pressed}) => [
            styles.loginButton,
            pressed &&
              !isLoading &&
              styles.pressed,
          ]}
          disabled={
            isLoading
          }
          onPress={
            handleLogin
          }>
          <Text
            style={
              styles.loginButtonText
            }>
            {isLoading
              ? 'Iniciando sesión...'
              : 'Iniciar sesión'}
          </Text>

          {!isLoading && (
            <Text
              style={
                styles.loginArrow
              }>
              →
            </Text>
          )}
        </Pressable>

        <View
          style={
            styles.securityNotice
          }>
          <View
            style={
              styles.securityDot
            }
          />

          <Text
            style={
              styles.securityText
            }>
            Tus credenciales son validadas de forma segura
            por CMP-Site.
          </Text>
        </View>
      </View>

      <View
        style={
          styles.registerCard
        }>
        <Text
          style={
            styles.registerEyebrow
          }>
          NUEVO EN SIMG-CMP
        </Text>

        <Text
          style={
            styles.registerTitle
          }>
          ¿Todavía no tienes cuenta?
        </Text>

        <Text
          style={
            styles.registerDescription
          }>
          Crea tu cuenta para utilizar las funciones
          personales de la plataforma.
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.registerButton,
            pressed &&
              styles.pressed,
          ]}
          disabled={
            isLoading
          }
          onPress={() =>
            navigation.navigate(
              'Register',
            )
          }>
          <Text
            style={
              styles.registerButtonText
            }>
            Crear cuenta
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={
          styles.homeButton
        }
        disabled={
          isLoading
        }
        onPress={
          goHome
        }>
        <Text
          style={
            styles.homeButtonText
          }>
          ← Regresar al inicio
        </Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
}