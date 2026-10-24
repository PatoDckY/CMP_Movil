import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  InstitutionalHeader,
} from '../../components/account/AccountPresentation';

import {
  EmptyState,
} from '../../components/common/EmptyState';

import {
  notificationRepository,
} from '../../config/dependencies';

import {
  Notification,
} from '../../models/Notification';

import {
  AuthenticatedStackParamList,
} from '../../navigation/types';

import {
  colors,
} from '../../theme/colors';

import {
  useNotificationsViewModel,
} from '../../viewmodels/notifications/useNotificationsViewModel';

import {
  styles,
} from './NotificationsScreen.styles';

type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'Notifications'
>;

function formatDate(value: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function NotificationsScreen(
  _props: Props,
): React.JSX.Element {
  const {
    notifications,
    unreadCount,
    state,
    error,
    actionError,
    isLoading,
    isEmpty,
    isRefreshing,
    isLoadingMore,
    load,
    refresh,
    loadMore,
    markAsRead,
  } = useNotificationsViewModel(notificationRepository);

  const renderItem = ({item}: {item: Notification}) => {
    const unread = item.readAt === null;
    const date = formatDate(item.sentAt ?? item.scheduledAt);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          `${unread ? 'No leída' : 'Leída'}: ${item.title}`
        }
        accessibilityHint={
          unread ? 'Marca la notificación como leída' : undefined
        }
        onPress={() => {
          void markAsRead(item.id);
        }}
        style={({pressed}) => [
          styles.item,
          unread && styles.itemUnread,
          pressed && styles.pressed,
        ]}>
        <View
          accessible={false}
          style={[styles.dot, unread && styles.dotUnread]}
        />

        <View style={styles.itemContent}>
          <Text
            style={[
              styles.itemTitle,
              unread && styles.itemTitleUnread,
            ]}>
            {item.title}
          </Text>

          <Text style={styles.itemMessage}>
            {item.message}
          </Text>

          {date ? (
            <Text style={styles.itemMeta}>{date}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  const header = (
    <View>
      <InstitutionalHeader
        title="Centro de notificaciones"
        description="Avisos sobre tus cursos, sesiones y evaluaciones."
      />

      {state === 'success' || isEmpty ? (
        <Text style={styles.summary}>
          {unreadCount === 0
            ? 'No tienes notificaciones sin leer'
            : `${unreadCount} sin leer`}
        </Text>
      ) : null}

      {actionError ? (
        <Text accessibilityRole="alert" style={styles.inlineError}>
          {actionError}
        </Text>
      ) : null}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            Consultando tus notificaciones...
          </Text>
        </View>
      ) : null}

      {state === 'error' ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            No pudimos cargar tus notificaciones
          </Text>

          <Text style={styles.errorDescription}>
            {error ?? 'Ocurrió un error al consultar tus notificaciones.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={() => {
              void load();
            }}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon="!"
          title="Aún no tienes notificaciones"
          description="Cuando haya avisos sobre tus cursos, aparecerán aquí."
          variant="large"
        />
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.container}
      data={notifications}
      keyExtractor={item => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator color={colors.primary} />
        ) : undefined
      }
      onEndReached={() => {
        void loadMore();
      }}
      onEndReachedThreshold={0.4}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            void refresh();
          }}
          colors={[colors.primary]}
        />
      }
    />
  );
}
