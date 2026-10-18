import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {
  AccountSection,
  InstitutionalHeader,
} from '../../components/account/AccountPresentation';
import { PasswordField } from '../../components/auth/PasswordField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { accountRepository } from '../../config/dependencies';
import { AuthenticatedStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionContext';
import { colors } from '../../theme/colors';
import { useAccountDeletionViewModel } from '../../viewmodels/account/useAccountDeletionViewModel';
import { styles } from './AccountDeletionScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'AccountDeletion'
>;

export function AccountDeletionScreen({
  navigation,
}: Props): React.JSX.Element {
  const { user } = useSession();
  const vm = useAccountDeletionViewModel(accountRepository, user?.role);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bottomOffset={32}
      keyboardShouldPersistTaps="handled"
    >
      <InstitutionalHeader
        title="Solicitud de eliminación de cuenta"
        description="Un proceso de revisión para atender tu solicitud y el tratamiento correspondiente de tus datos personales."
      />

      {vm.receipt ? (
        <View style={styles.receipt}>
          <View accessible={false} style={styles.receiptIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text
            accessibilityRole="header"
            accessibilityLiveRegion="polite"
            style={styles.receiptTitle}
          >
            Solicitud registrada correctamente
          </Text>
          <Text style={styles.text}>{vm.receipt.message}</Text>
          <View style={styles.tracking}>
            <Text style={[styles.label, styles.trackingLabel]}>
              Folio de seguimiento
            </Text>
            <Text
              selectable
              accessibilityLabel={'Folio: ' + vm.receipt.requestId}
              style={styles.folio}
            >
              {vm.receipt.requestId}
            </Text>
            <Text style={styles.status}>Estado: {vm.receipt.status}</Text>
          </View>
          <Text style={styles.text}>
            {vm.receipt.status === 'pendiente'
              ? 'Tu solicitud está pendiente de revisión. Conserva el folio para identificarla.'
              : 'El sistema informa que tu solicitud fue respondida. Este estado no confirma que la eliminación se haya completado.'}
          </Text>
          <Text style={styles.text}>
            La eliminación NO se ha completado. Registrar esta solicitud no
            elimina tu cuenta de inmediato. Tu sesión sigue abierta.
          </Text>
          <PrimaryButton
            label="Volver a Mi cuenta"
            variant="accent"
            size="comfortable"
            onPress={() => navigation.popTo('Account')}
          />
        </View>
      ) : (
        <>
          <AccountSection title="Antes de enviar tu solicitud">
            <Text style={styles.text}>
              Solicitas la eliminación de tu cuenta y la revisión del
              tratamiento de tus datos personales. Al enviar el formulario, se
              registrará una solicitud y recibirás un folio de seguimiento.
            </Text>
            <View style={styles.processNote}>
              <Text style={styles.noteTitle}>
                La eliminación no es inmediata
              </Text>
              <Text style={styles.text}>
                La solicitud será revisada. Algunos datos pueden requerir
                revisión o conservación conforme a las obligaciones aplicables.
                El tratamiento final se determinará después de esa revisión.
              </Text>
            </View>
          </AccountSection>

          {vm.isClient ? (
            <AccountSection
              title="Confirma tu solicitud"
              description="Para proteger tu cuenta, ingresa tu contraseña actual y confirma que deseas registrar la solicitud."
            >
              <View>
                <Text style={styles.label}>Contraseña actual</Text>
                <PasswordField
                  value={vm.password}
                  onChangeText={vm.setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(value => !value)}
                  placeholder="Ingresa tu contraseña actual"
                  accessibilityLabel="Contraseña actual para solicitar eliminación"
                  maxLength={200}
                  editable={!vm.isSubmitting}
                  size="comfortable"
                  autoComplete="current-password"
                  textContentType="password"
                />
                <Text style={styles.helper}>
                  Se utiliza únicamente para verificar esta solicitud. No se
                  guarda en el dispositivo.
                </Text>
              </View>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: vm.confirmed,
                  disabled: vm.isSubmitting,
                }}
                accessibilityLabel="Confirmo solicitar la eliminación de mi cuenta y datos personales"
                accessibilityHint="Es necesario confirmar para habilitar el envío. La eliminación requiere revisión."
                disabled={vm.isSubmitting}
                onPress={() => vm.setConfirmed(!vm.confirmed)}
                style={({ pressed }) => [
                  styles.consent,
                  vm.confirmed && styles.consentSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  accessible={false}
                  style={[
                    styles.checkbox,
                    vm.confirmed && styles.checkboxSelected,
                  ]}
                >
                  {vm.confirmed ? (
                    <Text style={styles.checkboxMark}>✓</Text>
                  ) : null}
                </View>
                <Text style={styles.consentText}>
                  Confirmo expresamente que solicito la eliminación de mi cuenta
                  y datos personales y entiendo que requiere revisión.
                </Text>
              </Pressable>
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
                <View
                  style={styles.processing}
                  accessibilityLiveRegion="polite"
                >
                  <ActivityIndicator
                    color={colors.primary}
                    accessibilityLabel="Registrando solicitud"
                  />
                  <Text style={styles.helper}>
                    Estamos registrando tu solicitud…
                  </Text>
                </View>
              ) : null}
              <PrimaryButton
                showArrow
                label={
                  vm.isSubmitting
                    ? 'Enviando solicitud…'
                    : 'Registrar solicitud de eliminación'
                }
                disabled={!vm.canSubmit}
                size="comfortable"
                onPress={() => {
                  setShowPassword(false);
                  vm.submit();
                }}
              />
              <Text style={styles.helper}>
                El envío registra una solicitud; no elimina inmediatamente tu
                cuenta ni cierra tu sesión.
              </Text>
            </AccountSection>
          ) : (
            <View accessibilityRole="alert" style={styles.errorBox}>
              <Text style={styles.error}>
                Inicia sesión con una cuenta autorizada para registrar esta
                solicitud.
              </Text>
            </View>
          )}
        </>
      )}
    </KeyboardAwareScrollView>
  );
}
