import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {legalRepository} from '../../config/dependencies';
import {LegalRepository} from '../../repositories/contracts/LegalRepository';
import {useLegalSummaryViewModel} from '../../viewmodels/legal/useLegalSummaryViewModel';
import {styles} from './LegalSummaryNotice.styles';

type Props = {
  onViewMore: () => void;
  repository?: LegalRepository;
};

export function LegalSummaryNotice({
  onViewMore,
  repository = legalRepository,
}: Props): React.JSX.Element {
  const {summary} = useLegalSummaryViewModel(repository);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aviso de privacidad y términos</Text>
      <Text style={styles.summary} numberOfLines={5}>
        {summary}
      </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Ver más: aviso de privacidad y términos y condiciones"
        hitSlop={8}
        onPress={onViewMore}>
        <Text style={styles.link}>Ver más</Text>
      </Pressable>
    </View>
  );
}
