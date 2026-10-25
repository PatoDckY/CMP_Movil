import React from 'react';
import {Text, View} from 'react-native';
import Markdown from 'react-native-markdown-display';

import {LegalDocument} from '../../models/LegalDocument';
import {styles, markdownStyles} from './LegalDocumentView.styles';

export function formatLegalDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function LegalDocumentView({
  document,
}: {
  document: LegalDocument;
}): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Markdown style={markdownStyles}>{document.contenido}</Markdown>
      <Text style={styles.footer}>
        {`Versión ${document.version} — vigente desde ${formatLegalDate(
          document.vigenteDesde,
        )}`}
      </Text>
    </View>
  );
}
