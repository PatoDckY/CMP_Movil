import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { FlatList, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NotificationsScreen } from '../../src/screens/notifications/NotificationsScreen';
import { AuthenticatedStackParamList } from '../../src/navigation/types';
import { notificationRepository } from '../../src/config/dependencies';

jest.mock('../../src/config/dependencies', () => ({
  notificationRepository: { getNotifications: jest.fn(), markAsRead: jest.fn() },
}));

const notification = (id: number, readAt: string | null) => ({
  id,
  courseId: null,
  enrollmentId: null,
  sessionId: null,
  evaluationId: null,
  type: 'aviso',
  title: `Aviso ${id}`,
  message: 'Mensaje',
  channel: 'app',
  deliveryStatus: 'Enviada',
  scheduledAt: null,
  sentAt: '2026-10-20T10:00:00.000Z',
  readAt,
});
const props = {} as unknown as NativeStackScreenProps<
  AuthenticatedStackParamList,
  'Notifications'
>;

describe('Centro de notificaciones - pantalla', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  const repo = notificationRepository as jest.Mocked<typeof notificationRepository>;

  afterEach(async () => {
    await act(async () => renderer?.unmount());
    jest.resetAllMocks();
  });

  const render = async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<NotificationsScreen {...props} />);
    });
  };
  const text = () =>
    renderer.root
      .findAllByType(Text)
      .map(node => [node.props.children].flat().join(''))
      .join(' | ');

  test('lista las notificaciones y tocar una no leída la marca como leída', async () => {
    repo.getNotifications.mockResolvedValue({
      notifications: [notification(1, null), notification(2, '2026-10-19T00:00:00.000Z')],
      unreadCount: 1,
      page: 1,
      pageSize: 20,
      total: 2,
    });
    repo.markAsRead.mockResolvedValue(notification(1, '2026-10-21T08:00:00.000Z'));
    await render();
    expect(renderer.root.findByType(FlatList).props.data).toHaveLength(2);
    expect(text()).toContain('1 sin leer');
    // FlatList no monta filas sin layout en Jest: se renderiza cada fila con su renderItem.
    const list = renderer.root.findByType(FlatList);
    const rows = list.props.data.map((item: unknown, index: number) => {
      let row!: ReactTestRenderer.ReactTestRenderer;
      ReactTestRenderer.act(() => {
        row = ReactTestRenderer.create(list.props.renderItem({ item, index }));
      });
      return row.root.findAll(node => typeof node.props.onPress === 'function')[0];
    });
    expect(rows[0].props.accessibilityLabel).toBe('No leída: Aviso 1');
    expect(rows[1].props.accessibilityLabel).toBe('Leída: Aviso 2');
    await act(async () => rows[0].props.onPress());
    expect(repo.markAsRead).toHaveBeenCalledWith(1);
    expect(text()).toContain('No tienes notificaciones sin leer');
  });

  test('muestra estado vacío', async () => {
    repo.getNotifications.mockResolvedValue({
      notifications: [],
      unreadCount: 0,
      page: 1,
      pageSize: 20,
      total: 0,
    });
    await render();
    expect(text()).toContain('Aún no tienes notificaciones');
  });

  test('muestra error y reintenta', async () => {
    repo.getNotifications.mockRejectedValueOnce(new Error('Sin conexión'));
    await render();
    expect(text()).toContain('No pudimos cargar tus notificaciones');
    expect(text()).toContain('Sin conexión');
    repo.getNotifications.mockResolvedValue({
      notifications: [notification(1, null)],
      unreadCount: 1,
      page: 1,
      pageSize: 20,
      total: 1,
    });
    const retry = renderer.root.findAll(
      node => typeof node.props.onPress === 'function',
    )[0];
    await act(async () => retry?.props.onPress());
    expect(renderer.root.findByType(FlatList).props.data).toHaveLength(1);
  });
});
