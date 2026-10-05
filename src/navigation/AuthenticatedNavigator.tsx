import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AccountScreen} from '../screens/account/AccountScreen';
import {AuthenticatedCourseDetailScreen,} from '../screens/catalog/CourseDetailScreen';
import {CatalogScreen} from '../screens/catalog/CatalogScreen';
import {DashboardScreen} from '../screens/dashboard/DashboardScreen';
import {MyCoursesScreen} from '../screens/myCourses/MyCoursesScreen';
import {PurchaseDetailScreen} from '../screens/purchases/PurchaseDetailScreen';
import {PurchaseHistoryScreen} from '../screens/purchases/PurchaseHistoryScreen';
import {colors} from '../theme/colors';
import {AuthenticatedStackParamList} from './types';

const Stack =
  createNativeStackNavigator<AuthenticatedStackParamList>();

export function AuthenticatedNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
        }}
      />

      <Stack.Screen
        name="MyCourses"
        component={MyCoursesScreen}
        options={{
          title: 'Mis cursos',
        }}
      />

      <Stack.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          title: 'Cursos',
        }}
      />

      <Stack.Screen
        name="CourseDetail"
        component={AuthenticatedCourseDetailScreen}
        options={{
          title: 'Detalle del curso',
        }}
      />

      <Stack.Screen
        name="PurchaseHistory"
        component={PurchaseHistoryScreen}
        options={{
          title: 'Historial de compras',
        }}
      />

      <Stack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
        options={{
          title: 'Detalle de compra',
        }}
      />

      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Mi cuenta',
        }}
      />
    </Stack.Navigator>
  );
}