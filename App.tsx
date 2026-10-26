import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  KeyboardProvider,
} from 'react-native-keyboard-controller';

import {RootNavigator} from './src/navigation/RootNavigator';
import {SessionProvider} from './src/session/SessionContext';
import {
  initializeCmpSslPinning,
} from './src/services/security/sslPinning';

type PinningStatus =
  | 'loading'
  | 'ready'
  | 'error';

function App(): React.JSX.Element {
  const [
    pinningStatus,
    setPinningStatus,
  ] = useState<PinningStatus>(
    'loading',
  );

  useEffect(() => {
    let mounted = true;

    initializeCmpSslPinning()
      .then(() => {
        if (mounted) {
          setPinningStatus(
            'ready',
          );
        }
      })
      .catch(() => {
        // Sin registro del error: la pantalla de bloqueo ya informa el fallo.
        if (mounted) {
          setPinningStatus(
            'error',
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
        />

        <SafeAreaView
          style={styles.safeArea}
          edges={[
            'top',
            'bottom',
          ]}>
          {pinningStatus ===
            'loading' && (
            <View
              style={
                styles.centerContainer
              }>
              <ActivityIndicator />

              <Text
                style={
                  styles.statusText
                }>
                Inicializando conexión
                segura...
              </Text>
            </View>
          )}

          {pinningStatus ===
            'error' && (
            <View
              style={
                styles.centerContainer
              }>
              <Text
                style={
                  styles.errorTitle
                }>
                Conexión segura no
                disponible
              </Text>

              <Text
                style={
                  styles.statusText
                }>
                No fue posible validar
                la identidad del
                servidor.
              </Text>
            </View>
          )}

          {pinningStatus ===
            'ready' && (
            <SessionProvider>
              <RootNavigator />
            </SessionProvider>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  statusText: {
    marginTop: 12,
    textAlign: 'center',
  },

  errorTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default App;