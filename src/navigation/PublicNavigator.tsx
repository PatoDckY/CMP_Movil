import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import {
  createNativeStackNavigator,
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
        options={({navigation}) => ({
          title: 'Cursos',
          headerRight: () => (
            <Pressable
              hitSlop={10}
              onPress={() =>
                navigation.navigate('Login')
              }>
              <Text style={styles.accessText}>
                Acceder
              </Text>
            </Pressable>
          ),
        })}
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