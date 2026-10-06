import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {useSession} from '../session/SessionContext';
import {colors} from '../theme/colors';
import {AuthenticatedNavigator} from './AuthenticatedNavigator';
import {PublicNavigator} from './PublicNavigator';
import {styles} from './RootNavigator.styles';

export function RootNavigator(): React.JSX.Element {
  const {
    isAuthenticated,
    isRestoring,
  } = useSession();

  if (isRestoring) {
    return (
      <View
        style={
          styles.loadingContainer
        }>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AuthenticatedNavigator />
      ) : (
        <PublicNavigator />
      )}
    </NavigationContainer>
  );
}