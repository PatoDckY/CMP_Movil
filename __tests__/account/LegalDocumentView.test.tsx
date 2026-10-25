import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import {
  LegalDocumentView,
  formatLegalDate,
} from '../../src/components/legal/LegalDocumentView';

describe('LegalDocumentView', () => {
  test('renderiza el markdown real y el pie con versión y vigencia', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <LegalDocumentView
          document={{
            tipo: 'aviso_privacidad',
            version: '1.0',
            resumen: 'R',
            contenido: '# Aviso de Privacidad\n\nTexto con **negritas**.',
            vigenteDesde: '2026-10-24T21:01:12.147Z',
          }}
        />,
      );
    });
    const text = renderer.root
      .findAllByType(Text)
      .map(n => [n.props.children].flat(Infinity).filter(c => typeof c === 'string').join(''))
      .join('\n');
    expect(text).toContain('Aviso de Privacidad');
    expect(text).toContain('negritas');
    expect(text).not.toContain('**');
    expect(text).toContain('Versión 1.0 — vigente desde 24/10/2026');
  });

  test('formatLegalDate conserva el valor si no es una fecha', () => {
    expect(formatLegalDate('pronto')).toBe('pronto');
  });
});
