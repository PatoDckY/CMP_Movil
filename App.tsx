import React from 'react';
import {
  StatusBar,
  StyleSheet,
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

function App(): React.JSX.Element {
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
          <SessionProvider>
            <RootNavigator />
          </SessionProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;