import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {LoginScreen} from '../screens/auth/LoginScreen';
import {RegisterScreen} from '../screens/auth/RegisterScreen';
import {CatalogScreen} from '../screens/catalog/CatalogScreen';
import {CourseDetailScreen} from '../screens/catalog/CourseDetailScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {colors} from '../theme/colors';
import {PublicStackParamList} from './types';

const Stack =
  createNativeStackNavigator<PublicStackParamList>();

type CatalogNavigation =
  NativeStackNavigationProp<
    PublicStackParamList,
    'Catalog'
  >;

type CatalogOptionsProps = {
  navigation: CatalogNavigation;
};

type AccessButtonProps = {
  onPress: () => void;
};

function AccessButton({
  onPress,
}: AccessButtonProps): React.JSX.Element {
  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}>
      <Text style={styles.accessText}>
        Acceder
      </Text>
    </Pressable>
  );
}

function getCatalogOptions({
  navigation,
}: CatalogOptionsProps): NativeStackNavigationOptions {
  return {
    title: 'Cursos',
    headerRight: () => (
      <AccessButton
        onPress={() =>
          navigation.navigate('Login')
        }
      />
    ),
  };
}

export function PublicNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={getCatalogOptions}
      />

      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          title: 'Detalle del curso',
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Iniciar sesión',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Crear cuenta',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  accessText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});