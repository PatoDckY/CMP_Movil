import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AuthBrand} from '../../components/auth/AuthBrand';
import {PublicStackParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';
import {styles} from './LoginScreen.styles';

type Props = NativeStackScreenProps<
  PublicStackParamList,
  'Login'
>;

export function LoginScreen({
  navigation,
}: Props): React.JSX.Element {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <AuthBrand />

        <View style={styles.hero}>
          <View style={styles.heroCircle} />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              ACCESO A TU CUENTA
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Bienvenido de nuevo
          </Text>

          <Text style={styles.heroText}>
            Inicia sesión para acceder a tus funciones
            personales dentro de SIMG-CMP.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Iniciar sesión
          </Text>

          <Text style={styles.formDescription}>
            Ingresa los datos asociados a tu cuenta.
          </Text>

          <Text style={styles.label}>
            Correo electrónico
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={
              colors.textSecondary
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>
            Contraseña
          </Text>

          <View
            style={
              styles.passwordContainer
            }>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={
                colors.textSecondary
              }
              secureTextEntry={
                !showPassword
              }
              autoCapitalize="none"
              style={styles.passwordInput}
            />

            <Pressable
              style={styles.showButton}
              onPress={() =>
                setShowPassword(
                  current => !current,
                )
              }>
              <Text
                style={
                  styles.showButtonText
                }>
                {showPassword
                  ? 'Ocultar'
                  : 'Mostrar'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={({pressed}) => [
              styles.loginButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() => {}}>
            <Text
              style={
                styles.loginButtonText
              }>
              Iniciar sesión
            </Text>

            <Text
              style={
                styles.loginArrow
              }>
              →
            </Text>
          </Pressable>

          <View
            style={
              styles.securityNotice
            }>
            <View
              style={
                styles.securityDot
              }
            />

            <Text
              style={
                styles.securityText
              }>
              El acceso seguro y la validación de sesión
              se conectarán en A14.
            </Text>
          </View>
        </View>

        <View style={styles.registerCard}>
          <Text
            style={
              styles.registerEyebrow
            }>
            NUEVO EN SIMG-CMP
          </Text>

          <Text
            style={
              styles.registerTitle
            }>
            ¿Todavía no tienes cuenta?
          </Text>

          <Text
            style={
              styles.registerDescription
            }>
            Crea tu cuenta para utilizar las funciones
            personales de la plataforma.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.registerButton,
              pressed &&
                styles.pressed,
            ]}
            onPress={() =>
              navigation.navigate(
                'Register',
              )
            }>
            <Text
              style={
                styles.registerButtonText
              }>
              Crear cuenta
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.homeButton}
          onPress={goHome}>
          <Text
            style={
              styles.homeButtonText
            }>
            ← Regresar al inicio
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}