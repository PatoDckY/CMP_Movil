import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { InstitutionalHeader } from '../../components/account/AccountPresentation';
import { AppFooter } from '../../components/common/AppFooter';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { LegalDocumentView } from '../../components/legal/LegalDocumentView';
import { legalRepository } from '../../config/dependencies';
import { LegalRepository } from '../../repositories/contracts/LegalRepository';
import { colors } from '../../theme/colors';
import { useLegalInformationViewModel } from '../../viewmodels/legal/useLegalInformationViewModel';
import { styles } from './LegalInformationScreen.styles';

type Props = {
  navigation: { goBack: () => void };
  repository?: LegalRepository;
};

export function LegalInformationScreen({
  navigation,
  repository = legalRepository,
}: Props): React.JSX.Element {
  const { privacyNotice, terms, state, error, isLoading, retry } =
    useLegalInformationViewModel(repository);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <InstitutionalHeader
        title="Privacidad y términos"
        description="Aviso de privacidad y términos y condiciones vigentes de la aplicación."
      />

      {isLoading && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.text}>Cargando documentos legales...</Text>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.notice} accessibilityLiveRegion="polite">
          <Text accessibilityRole="header" style={styles.noticeTitle}>
            No se pudieron cargar los documentos
          </Text>
          <Text style={styles.text}>{error}</Text>
          <PrimaryButton
            label="Reintentar"
            variant="primary"
            size="comfortable"
            onPress={retry}
          />
        </View>
      )}

      {state === 'success' && privacyNotice && terms && (
        <>
          <LegalDocumentView document={privacyNotice} />
          <LegalDocumentView document={terms} />
        </>
      )}

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
