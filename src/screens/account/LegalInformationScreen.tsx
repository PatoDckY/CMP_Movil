import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  AccountSection,
  InstitutionalHeader,
} from '../../components/account/AccountPresentation';
import { AppFooter } from '../../components/common/AppFooter';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { styles } from './LegalInformationScreen.styles';

type Props = { navigation: { goBack: () => void } };

export function LegalInformationScreen({
  navigation,
}: Props): React.JSX.Element {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <InstitutionalHeader
        title="Privacidad y términos"
        description="Información sobre tus datos personales y las funciones disponibles en la aplicación."
      />
      <View style={styles.notice}>
        <Text accessibilityRole="header" style={styles.noticeTitle}>
          Información pendiente de aprobación institucional
        </Text>
        <Text style={styles.text}>
          Este contenido es provisional. Describe funciones de la aplicación y
          no sustituye un aviso de privacidad ni términos y condiciones
          oficiales aprobados.
        </Text>
      </View>

      <AccountSection
        title="Aviso de privacidad"
        description="El documento oficial aprobado está pendiente de incorporarse a esta sección. La información que sigue no constituye ese aviso."
      />
      <AccountSection
        title="Tratamiento y protección de datos personales"
        description="Tu perfil se utiliza para administrar tu cuenta y tu relación con los cursos y servicios del sistema. El alcance formal del tratamiento y las medidas de protección deberán detallarse en el aviso institucional aprobado."
      />
      <AccountSection
        title="Derechos sobre tus datos"
        description="Desde Mi cuenta puedes consultar y rectificar los datos de tu perfil que admite el sistema. También puedes registrar una solicitud de eliminación para su revisión. Esta descripción de funciones no sustituye el procedimiento institucional de atención de derechos."
      />
      <AccountSection
        title="Uso de la aplicación"
        description="La aplicación permite consultar cursos, registrar solicitudes de compra y reportes de pago, revisar inscripciones y actividad académica, y administrar los datos de tu perfil. Una reserva o un reporte de pago no equivale a la validación del pago ni garantiza una inscripción."
      />
      <AccountSection
        title="Términos y condiciones de uso"
        description="Los términos oficiales están pendientes de revisión, aprobación e incorporación. Esta pantalla no registra la aceptación de un documento jurídico ni de una versión de sus condiciones."
      />
      <AccountSection
        title="Solicitudes relacionadas con la cuenta"
        description="La solicitud de eliminación requiere tu contraseña actual y confirmación expresa. Cuando se registra, el sistema devuelve un folio y su estado. El registro no elimina la cuenta ni sus datos de inmediato; el tratamiento final requiere revisión."
      />

      <Text style={styles.helper}>
        Los documentos oficiales y un canal institucional verificado para
        consultas están pendientes de incorporarse.
      </Text>
      <PrimaryButton
        label="Volver a la pantalla anterior"
        variant="primary"
        size="comfortable"
        onPress={() => navigation.goBack()}
      />
      <AppFooter />
    </ScrollView>
  );
}
