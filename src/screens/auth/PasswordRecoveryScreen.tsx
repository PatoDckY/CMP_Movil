
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

import {AuthBrand} from '../../components/auth/AuthBrand';
import {passwordRecoveryRepository} from '../../config/dependencies';
import {PublicStackParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';
import {usePasswordRecoveryViewModel} from '../../viewmodels/auth/usePasswordRecoveryViewModel';
import {styles} from './PasswordRecoveryScreen.styles';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'PasswordRecovery'
>;

export function PasswordRecoveryScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const {
    email,
    state,
    error,
    updateEmail,
    requestPasswordReset,
    isLoading,
    isSuccess,
  } = usePasswordRecoveryViewModel(
    passwordRecoveryRepository,
  );

  const handleSubmit = async () => {
    await requestPasswordReset();
  };

  const goToLogin = () => {
    navigation.navigate('Login', route.params);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}>

      <AuthBrand />

      <View style={styles.hero}>
        <View style={styles.heroCircle} />

        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            SEGURIDAD DE TU CUENTA
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Recupera tu acceso
        </Text>

        <Text style={styles.heroDescription}>
          Te ayudamos a recuperar tu cuenta
          del Centro Médico Pichardo de
          manera segura.
        </Text>
      </View>

      {isSuccess ? (
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>
              ✓
            </Text>
          </View>

          <Text style={styles.successTitle}>
            Solicitud recibida
          </Text>

          <Text style={styles.successDescription}>
            Si el correo está registrado
            en SIMG-CMP, recibirás un enlace
            para restablecer tu contraseña.
          </Text>

          <View style={styles.successInformation}>
            <Text style={styles.successInformationTitle}>
              ¿Qué sigue?
            </Text>

            <Text style={styles.successInformationText}>
              1. Revisa tu bandeja de entrada.
            </Text>

            <Text style={styles.successInformationText}>
              2. Busca el correo del Centro
              Médico Pichardo.
            </Text>

            <Text style={styles.successInformationText}>
              3. Abre el enlace recibido
              y establece una contraseña nueva.
            </Text>

            <Text style={styles.successInformationText}>
              El enlace tendrá una vigencia
              de 15 minutos.
            </Text>
          </View>

          <Text style={styles.spamNotice}>
            Si no encuentras el mensaje,
            revisa la carpeta de correo
            no deseado.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a iniciar sesión"
            style={({pressed}) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={goToLogin}>
            <Text style={styles.primaryButtonText}>
              Volver a iniciar sesión
            </Text>

            <Text style={styles.primaryButtonArrow}>
              →
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            ¿Olvidaste tu contraseña?
          </Text>

          <Text style={styles.formDescription}>
            Ingresa el correo electrónico
            asociado a tu cuenta. Te enviaremos
            instrucciones para crear una nueva
            contraseña.
          </Text>

          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            accessibilityLabel="Correo electrónico"
            value={email}
            onChangeText={updateEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={
              colors.textSecondary
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="send"
            editable={!isLoading}
            onSubmitEditing={handleSubmit}
            style={styles.input}
          />

          {state === 'error' && error && (
            <View style={styles.errorContainer}>
              <Text accessibilityRole="alert" style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            accessibilityLabel={isLoading ? 'Enviando solicitud de recuperación' : 'Solicitar recuperación de contraseña'}
            style={({pressed}) => [
              styles.primaryButton,
              pressed &&
                !isLoading &&
                styles.pressed,
              isLoading &&
                styles.disabledButton,
            ]}
            onPress={handleSubmit}>

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />

                <Text style={styles.primaryButtonText}>
                  Enviando solicitud...
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Enviar enlace de recuperación
                </Text>

                <Text style={styles.primaryButtonArrow}>
                  →
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.securityNotice}>
            <View style={styles.securityDot} />

            <Text style={styles.securityText}>
              Por seguridad, no indicaremos
              si el correo pertenece a
              una cuenta registrada.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            style={({pressed}) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Volver a iniciar sesión"
            onPress={goToLogin}>
            <Text style={styles.backButtonText}>
              ← Regresar al inicio de sesión
            </Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.footerText}>
        Centro Médico Pichardo
        {'\n'}
        Protección y seguridad de tu información
      </Text>
    </KeyboardAwareScrollView>
  );
}
