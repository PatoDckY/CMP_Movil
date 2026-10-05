import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {PublicNavigator} from './PublicNavigator';


export function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <PublicNavigator />
    </NavigationContainer>
  );
}