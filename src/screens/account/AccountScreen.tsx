import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AccountAction,
  AccountSection,
  InstitutionalHeader,
} from '../../components/account/AccountPresentation';
import { AppFooter } from '../../components/common/AppFooter';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { LogoutError } from '../../models/LogoutError';
import { AuthenticatedStackParamList } from '../../navigation/types';
import { useSession } from '../../session/SessionContext';
import { styles } from './AccountScreen.styles';

type Props = NativeStackScreenProps<AuthenticatedStackParamList, 'Account'>;

export function AccountScreen({ navigation }: Props): React.JSX.Element {
  const { user, logout } = useSession();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(
        error instanceof LogoutError
          ? error.phase === 'local'
            ? 'Limpieza local incompleta'
            : 'Revocación remota no confirmada'
          : 'Error al cerrar sesión',
        error instanceof LogoutError
          ? error.message
          : 'El acceso quedó bloqueado, pero no fue posible confirmar el cierre de sesión.',
      );
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <InstitutionalHeader
        title="Mi cuenta"
        description="Tu información personal, tu formación y las opciones de tu cuenta en un solo lugar."
      />

      <AccountSection title="Información personal">
        <View style={styles.profile}>
          <View accessible={false} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.fullName || 'Usuario autenticado'}
            </Text>
            <Text selectable style={styles.profileEmail}>
              {user?.email || 'Correo no disponible'}
            </Text>
          </View>
        </View>
        <AccountAction
          title="Mis datos personales"
          description="Consulta y edita los datos de tu perfil."
          onPress={() => navigation.navigate('PersonalData')}
        />
      </AccountSection>

      <AccountSection title="Mi formación">
        <AccountAction
          title="Mis cursos"
          description="Consulta tus inscripciones y tu actividad académica."
          onPress={() => navigation.navigate('MyCourses')}
        />
        <AccountAction
          title="Historial de compras"
          description="Revisa tus solicitudes de compra y reportes de pago."
          onPress={() => navigation.navigate('PurchaseHistory')}
        />
      </AccountSection>

      <AccountSection
        title="Configuración y privacidad"
        description="Consulta la información disponible sobre el uso de la aplicación y tus datos."
      >
        <AccountAction
          title="Privacidad y términos"
          description="Información sobre datos personales, uso de la aplicación y solicitudes de cuenta."
          onPress={() => navigation.navigate('LegalInformation')}
        />
        <View style={styles.sessionNote}>
          <Text style={styles.noteTitle}>Seguridad de tu sesión</Text>
          <Text style={styles.text}>
            Al cerrar sesión se intentan eliminar las credenciales de este
            dispositivo y revocar el acceso en el servidor.
          </Text>
        </View>
        <PrimaryButton
          label="Cerrar sesión"
          variant="outline"
          size="comfortable"
          onPress={handleLogout}
        />
      </AccountSection>

      {user?.role.toLowerCase() === 'cliente' ? (
        <View style={styles.management} testID="account-management-section">
          <AccountSection
            title="Gestión de cuenta"
            description="Puedes solicitar la eliminación de tu cuenta y la revisión correspondiente de tus datos personales."
          >
            <Text style={styles.text}>
              La solicitud se registra para su revisión. Enviarla no elimina tu
              cuenta de inmediato.
            </Text>
            <PrimaryButton
              label="Solicitar eliminación de cuenta"
              variant="outline"
              size="comfortable"
              onPress={() => navigation.navigate('AccountDeletion')}
            />
            <Text style={styles.helper}>
              En la siguiente pantalla podrás revisar el proceso y confirmar la
              solicitud con tu contraseña actual.
            </Text>
          </AccountSection>
        </View>
      ) : null}
      <AppFooter />
    </ScrollView>
  );
}
