import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { LegalSummaryNotice } from '../../src/components/legal/LegalSummaryNotice';
import { FALLBACK_LEGAL_SUMMARY } from '../../src/viewmodels/legal/useLegalSummaryViewModel';

jest.mock('../../src/config/dependencies', () => ({ legalRepository: {} }));

const viewMore = (r: ReactTestRenderer.ReactTestRenderer) =>
  r.root.findAll(
    n => n.props.accessibilityRole === 'link' && typeof n.props.onPress === 'function',
  )[0];

const texts = (r: ReactTestRenderer.ReactTestRenderer) =>
  r.root.findAllByType(Text).map(n => n.props.children).join(' ');

describe('LegalSummaryNotice (registro)', () => {
  const render = async (obtener: jest.Mock, onViewMore = jest.fn()) => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <LegalSummaryNotice repository={{ obtener }} onViewMore={onViewMore} />,
      );
    });
    return { renderer, onViewMore };
  };

  test('muestra el resumen del backend y "Ver más" navega', async () => {
    const { renderer, onViewMore } = await render(
      jest.fn().mockResolvedValue({ resumen: 'Resumen del backend' }),
    );
    expect(texts(renderer)).toContain('Resumen del backend');
    await act(async () => viewMore(renderer).props.onPress());
    expect(onViewMore).toHaveBeenCalledTimes(1);
  });

  test('sin conexión muestra el resumen de respaldo y "Ver más" sigue activo', async () => {
    const { renderer, onViewMore } = await render(
      jest.fn().mockRejectedValue(new Error('offline')),
    );
    expect(texts(renderer)).toContain(FALLBACK_LEGAL_SUMMARY);
    await act(async () => viewMore(renderer).props.onPress());
    expect(onViewMore).toHaveBeenCalledTimes(1);
  });
});
