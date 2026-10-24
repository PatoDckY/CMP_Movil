import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {
  AccountSection,
  InstitutionalHeader,
} from '../../components/account/AccountPresentation';
import { PasswordField } from '../../components/auth/PasswordField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { passwordChangeRepository } from '../../config/dependencies';
import { AuthenticatedStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionContext';
import { colors } from '../../theme/colors';
import {
  MAX_CURRENT_PASSWORD_LENGTH,
  useChangePasswordViewModel,
} from '../../viewmodels/account/useChangePasswordViewModel';
import { styles } from './ChangePasswordScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'ChangePassword'
>;

export function ChangePasswordScreen(_props: Props): React.JSX.Element {
  const { logout } = useSession();
  const [showPasswords, setShowPasswords] = useState(false);
  // Al cerrar la sesión SessionContext vuelve al login; el aviso se muestra antes.
  const handleSuccess = useCallback((message: string) => {
    Alert.alert('Contraseña actualizada', message);
  }, []);
  const vm = useChangePasswordViewModel(
    passwordChangeRepository,
    logout,
    handleSuccess,
  );
  const toggle = () => setShowPasswords(value => !value);

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
    >
      <InstitutionalHeader
        title="Cambiar contraseña"
        description="Actualiza la contraseña de tu cuenta. Por seguridad, al terminar deberás iniciar sesión de nuevo."
      />

      <AccountSection
        title="Nueva contraseña"
        description="Debe tener al menos 8 caracteres, con letras, números y un símbolo."
      >
        <View>
          <Text style={styles.label}>Contraseña actual</Text>
          <PasswordField
            value={vm.currentPassword}
            onChangeText={vm.setCurrentPassword}
            show={showPasswords}
            onToggle={toggle}
            placeholder="Ingresa tu contraseña actual"
            accessibilityLabel="Contraseña actual"
            maxLength={MAX_CURRENT_PASSWORD_LENGTH}
            editable={!vm.isSubmitting && !vm.isChanged}
            size="comfortable"
            autoComplete="current-password"
            textContentType="password"
          />
        </View>
        <View>
          <Text style={styles.label}>Nueva contraseña</Text>
          <PasswordField
            value={vm.newPassword}
            onChangeText={vm.setNewPassword}
            show={showPasswords}
            onToggle={toggle}
            placeholder="Ingresa tu nueva contraseña"
            accessibilityLabel="Nueva contraseña"
            maxLength={72}
            editable={!vm.isSubmitting && !vm.isChanged}
            size="comfortable"
            autoComplete="new-password"
            textContentType="newPassword"
          />
        </View>
        <View>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <PasswordField
            value={vm.confirmPassword}
            onChangeText={vm.setConfirmPassword}
            show={showPasswords}
            onToggle={toggle}
            placeholder="Repite tu nueva contraseña"
            accessibilityLabel="Confirmar nueva contraseña"
            maxLength={72}
            editable={!vm.isSubmitting && !vm.isChanged}
            size="comfortable"
            autoComplete="new-password"
            textContentType="newPassword"
          />
        </View>

        {vm.error ? (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            style={styles.errorBox}
          >
            <Text style={styles.error}>{vm.error}</Text>
          </View>
        ) : null}

        {vm.isSubmitting ? (
          <View style={styles.processing} accessibilityLiveRegion="polite">
            <ActivityIndicator
              color={colors.primary}
              accessibilityLabel="Cambiando contraseña"
            />
            <Text style={styles.helper}>Actualizando tu contraseña…</Text>
          </View>
        ) : null}

        <PrimaryButton
          showArrow
          label={vm.isSubmitting ? 'Actualizando…' : 'Cambiar contraseña'}
          disabled={!vm.canSubmit}
          size="comfortable"
          onPress={() => {
            setShowPasswords(false);
            void vm.submit();
          }}
        />
        <Text style={styles.helper}>
          Las contraseñas solo se usan para esta operación y no se guardan en
          el dispositivo.
        </Text>
      </AccountSection>
    </KeyboardAwareScrollView>
  );
}
