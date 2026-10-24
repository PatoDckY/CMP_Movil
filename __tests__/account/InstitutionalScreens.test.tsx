import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { AccountScreen } from '../../src/screens/account/AccountScreen';
import { AccountDeletionScreen } from '../../src/screens/account/AccountDeletionScreen';
import { LegalInformationScreen } from '../../src/screens/account/LegalInformationScreen';
import { PersonalDataScreen } from '../../src/screens/account/PersonalDataScreen';
import {
  AccountSection,
  AccountAction,
} from '../../src/components/account/AccountPresentation';
import { OptOutSwitchRow } from '../../src/components/account/OptOutSwitchRow';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';
import { AuthenticatedStackParamList } from '../../src/navigation/types';
import { useSession } from '../../src/session/SessionContext';
import {
  accountRepository,
  notificationRepository,
  optOutPreferencesRepository,
  profileRepository,
} from '../../src/config/dependencies';
import { AccountDeletionError } from '../../src/models/AccountDeletion';
import { LogoutError } from '../../src/models/LogoutError';
import { deferred } from '../helpers/renderHook';

jest.mock('../../src/session/SessionContext', () => ({
  useSession: jest.fn(),
}));
jest.mock('../../src/config/dependencies', () => ({
  accountRepository: { requestDeletion: jest.fn() },
  profileRepository: { getProfile: jest.fn(), updateProfile: jest.fn() },
  notificationRepository: { getNotifications: jest.fn(), markAsRead: jest.fn() },
  optOutPreferencesRepository: {
    load: jest.fn().mockResolvedValue({
      nonEssentialCommunications: false,
      analytics: false,
      shareProgress: false,
    }),
    save: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: jest.fn(
    ({ children }: { children: React.ReactNode }) => children,
  ),
}));

const user = {
  id: 98347,
  fullName: 'Persona Ejemplo',
  firstName: 'Persona',
  paternalLastName: 'Ejemplo',
  maternalLastName: null,
  email: 'persona@example.com',
  role: 'cliente',
};
const profile = {
  id: user.id,
  firstName: 'Persona',
  paternalLastName: 'Ejemplo',
  maternalLastName: null,
  age: 25,
  sex: 'otro',
  phone: '5555555555',
  email: user.email,
};
const sessionMock = useSession as jest.Mock;
const receipt = {
  requestId: 4729,
  status: 'pendiente' as const,
  deletionCompleted: false as const,
  message: 'Ya tienes una solicitud en proceso.',
};

describe('PF/ACC - rediseño institucional con componentes reales', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    goBack: jest.fn(),
    popTo: jest.fn(),
  };
  const accountProps = { navigation } as unknown as NativeStackScreenProps<
    AuthenticatedStackParamList,
    'Account'
  >;
  const deletionProps = { navigation } as unknown as NativeStackScreenProps<
    AuthenticatedStackParamList,
    'AccountDeletion'
  >;
  const logout = jest.fn();
  function collectText(node: unknown): string {
    if (typeof node === 'string') {
      return node;
    }
    if (Array.isArray(node)) {
      return node.map(collectText).join('\n');
    }
    if (node && typeof node === 'object' && 'children' in node) {
      return collectText(node.children);
    }
    return '';
  }
  const visibleText = () => collectText(renderer.toJSON());
  const button = (label: string) =>
    renderer.root
      .findAllByType(PrimaryButton)
      .find(node => node.props.label === label)!;
  const checkbox = () =>
    renderer.root.findAll(
      node =>
        node.props.accessibilityRole === 'checkbox' &&
        typeof node.props.onPress === 'function',
    )[0];
  const visibilityButton = () =>
    renderer.root.findAll(
      node =>
        /^(Mostrar|Ocultar) contraseña$/.test(
          node.props.accessibilityLabel ?? '',
        ) && typeof node.props.onPress === 'function',
    )[0];
  async function fillForm() {
    await act(async () => {
      renderer.root
        .findByType(TextInput)
        .props.onChangeText('fixture-current-password');
      checkbox().props.onPress();
    });
  }
  beforeEach(() => {
    jest.resetAllMocks();
    (KeyboardAwareScrollView as unknown as jest.Mock).mockImplementation(
      ({ children }: { children: React.ReactNode }) => children,
    );
    sessionMock.mockReturnValue({ user, logout, updateProfile: jest.fn() });
    (profileRepository.getProfile as jest.Mock).mockResolvedValue(profile);
    (optOutPreferencesRepository.load as jest.Mock).mockResolvedValue({
      nonEssentialCommunications: false,
      analytics: false,
      shareProgress: false,
    });
    (optOutPreferencesRepository.save as jest.Mock).mockResolvedValue(undefined);
    (notificationRepository.getNotifications as jest.Mock).mockResolvedValue({
      notifications: [],
      unreadCount: 3,
      page: 1,
      pageSize: 1,
      total: 3,
    });
    navigation.addListener.mockReturnValue(jest.fn());
  });
  afterEach(async () => {
    await act(async () => renderer?.unmount());
    jest.restoreAllMocks();
  });

  test('cuenta presenta nombre/correo sin ID ni rol interno y separa gestión al final', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...accountProps} />);
    });
    const text = visibleText();
    expect(text).toContain(user.fullName);
    expect(text).toContain(user.email);
    expect(text).not.toContain(String(user.id));
    expect(text).not.toMatch(/ID de usuario|\bRol\b|\bcliente\b/i);
    const sections = renderer.root.findAllByType(AccountSection);
    expect(sections.map(node => node.props.title)).toEqual([
      'Información personal',
      'Mi formación',
      'Configuración y privacidad',
      'Derecho de oposición',
      'Gestión de cuenta',
    ]);
    expect(sections.at(-1)?.findByType(PrimaryButton).props.label).toBe(
      'Solicitar eliminación de cuenta',
    );
    expect(
      renderer.root.findByProps({ testID: 'account-management-section' }),
    ).toBeDefined();
    expect(accountRepository.requestDeletion).not.toHaveBeenCalled();
  });

  test('cuenta muestra los tres switches de Opt-Out y persiste el cambio', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...accountProps} />);
    });
    const rows = renderer.root.findAllByType(OptOutSwitchRow);
    expect(rows).toHaveLength(3);
    expect(optOutPreferencesRepository.load).toHaveBeenCalledWith(user.id);
    await act(async () => {
      rows[1].props.onValueChange(true);
    });
    expect(optOutPreferencesRepository.save).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({ analytics: true }),
    );
  });

  test.each([
    ['Mis datos personales', 'PersonalData'],
    ['Mis cursos', 'MyCourses'],
    ['Historial de compras', 'PurchaseHistory'],
    ['Centro de notificaciones', 'Notifications'],
    ['Cambiar contraseña', 'ChangePassword'],
    ['Privacidad y términos', 'LegalInformation'],
  ])('la acción %s conserva su ruta %s', async (title, route) => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...accountProps} />);
    });
    await act(async () =>
      renderer.root
        .findAllByType(AccountAction)
        .find(node => node.props.title === title)
        ?.props.onPress(),
    );
    expect(navigation.navigate).toHaveBeenCalledWith(route);
  });

  test('cuenta muestra el contador de notificaciones sin leer como badge', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...accountProps} />);
    });
    expect(notificationRepository.getNotifications).toHaveBeenCalledWith(1, 1);
    const action = renderer.root
      .findAllByType(AccountAction)
      .find(node => node.props.title === 'Centro de notificaciones');
    expect(action?.props.badge).toBe(3);
  });

  test('abrir A17 solo navega y requiere confirmación en otra pantalla', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...accountProps} />);
    });
    await act(async () =>
      button('Solicitar eliminación de cuenta').props.onPress(),
    );
    expect(navigation.navigate).toHaveBeenCalledWith('AccountDeletion');
    expect(accountRepository.requestDeletion).not.toHaveBeenCalled();
  });

  test.each(['local', 'remote'] as const)(
    'cerrar sesión conserva la comunicación del fallo %s',
    async phase => {
      logout.mockRejectedValue(new LogoutError(phase));
      const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      await act(async () => {
        renderer = ReactTestRenderer.create(
          <AccountScreen {...accountProps} />,
        );
      });
      await act(async () => button('Cerrar sesión').props.onPress());
      expect(alert).toHaveBeenCalledWith(
        phase === 'local'
          ? 'Limpieza local incompleta'
          : 'Revocación remota no confirmada',
        expect.any(String),
      );
    },
  );

  test('edición de datos ordinaria sigue sin mostrar ID o rol', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<PersonalDataScreen />);
    });
    expect(visibleText()).not.toContain(String(user.id));
    expect(visibleText()).not.toMatch(/ID de usuario|\bRol\b|\bcliente\b/i);
    expect(button('Guardar cambios')).toBeDefined();
  });

  test('privacidad tiene secciones legibles, scroll y carácter provisional explícito', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <LegalInformationScreen navigation={navigation} />,
      );
    });
    expect(renderer.root.findAllByType(ScrollView)).toHaveLength(1);
    expect(
      renderer.root.findAllByType(AccountSection).map(node => node.props.title),
    ).toEqual([
      'Aviso de privacidad',
      'Tratamiento y protección de datos personales',
      'Derechos sobre tus datos',
      'Uso de la aplicación',
      'Términos y condiciones de uso',
      'Solicitudes relacionadas con la cuenta',
    ]);
    const text = visibleText();
    expect(text).toContain('Centro Médico Pichardo');
    expect(text).toContain('Información pendiente de aprobación institucional');
    expect(text).toContain('no sustituye un aviso de privacidad');
    expect(text).toContain('no registra la aceptación');
    expect(text).not.toContain(user.email);
    expect(text).not.toContain(String(user.id));
    expect(text).not.toMatch(/\bcliente\b|\bRol\b/);
    expect(
      renderer.root.findAll(
        node => node.props.accessibilityRole === 'checkbox',
      ),
    ).toHaveLength(0);
    await act(async () =>
      button('Volver a la pantalla anterior').props.onPress(),
    );
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('A17 empieza protegida, sin confirmar y deshabilitada; ambas condiciones son obligatorias', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    expect(renderer.root.findByType(TextInput).props).toMatchObject({
      secureTextEntry: true,
      maxLength: 200,
      autoComplete: 'current-password',
    });
    expect(checkbox().props.accessibilityState.checked).toBe(false);
    expect(visibleText()).not.toContain(String(user.id));
    expect(visibleText()).not.toMatch(/\bcliente\b|\bRol\b/);
    expect(button('Registrar solicitud de eliminación').props.disabled).toBe(
      true,
    );
    await act(async () => checkbox().props.onPress());
    expect(button('Registrar solicitud de eliminación').props.disabled).toBe(
      true,
    );
    await act(async () => {
      renderer.root.findByType(TextInput).props.onChangeText('fixture');
    });
    expect(button('Registrar solicitud de eliminación').props.disabled).toBe(
      false,
    );
    await act(async () => checkbox().props.onPress());
    expect(button('Registrar solicitud de eliminación').props.disabled).toBe(
      true,
    );
    expect(accountRepository.requestDeletion).not.toHaveBeenCalled();
  });

  test('mostrar/ocultar contraseña funciona y anuncia la acción correspondiente', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    expect(visibilityButton().props.accessibilityLabel).toBe(
      'Mostrar contraseña',
    );
    await act(async () => visibilityButton().props.onPress());
    expect(renderer.root.findByType(TextInput).props.secureTextEntry).toBe(
      false,
    );
    expect(visibilityButton().props.accessibilityLabel).toBe(
      'Ocultar contraseña',
    );
    await act(async () => visibilityButton().props.onPress());
    expect(renderer.root.findByType(TextInput).props.secureTextEntry).toBe(
      true,
    );
  });

  test('procesamiento limpia contraseña, bloquea entradas/doble envío y presenta folio real sin logout', async () => {
    const pending = deferred<typeof receipt>();
    (accountRepository.requestDeletion as jest.Mock).mockReturnValue(
      pending.promise,
    );
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    await fillForm();
    await act(async () => {
      visibilityButton().props.onPress();
    });
    const submit = button('Registrar solicitud de eliminación').props.onPress;
    await act(async () => {
      submit();
      submit();
    });
    expect(accountRepository.requestDeletion).toHaveBeenCalledTimes(1);
    expect(accountRepository.requestDeletion).toHaveBeenCalledWith({
      password: 'fixture-current-password',
      confirmed: true,
    });
    expect(renderer.root.findByType(TextInput).props).toMatchObject({
      value: '',
      editable: false,
      secureTextEntry: true,
    });
    expect(visibilityButton().props.disabled).toBe(true);
    expect(checkbox().props.disabled).toBe(true);
    expect(button('Enviando solicitud…').props.disabled).toBe(true);
    expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    await act(async () => pending.resolve(receipt));
    const text = visibleText();
    expect(text).toContain('Solicitud registrada correctamente');
    expect(text).toContain(String(receipt.requestId));
    expect(text).toContain(receipt.message);
    expect(text).toContain('pendiente de revisión');
    expect(text).toContain('La eliminación NO se ha completado');
    expect(renderer.root.findAllByType(TextInput)).toHaveLength(0);
    expect(logout).not.toHaveBeenCalled();
    await act(async () => button('Volver a Mi cuenta').props.onPress());
    expect(navigation.popTo).toHaveBeenCalledWith('Account');
    expect(accountRepository.requestDeletion).toHaveBeenCalledTimes(1);
  });

  test('una solicitud respondida conserva su estado real sin afirmar eliminación', async () => {
    (accountRepository.requestDeletion as jest.Mock).mockResolvedValue({
      ...receipt,
      status: 'respondida',
    });
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    await fillForm();
    await act(async () =>
      button('Registrar solicitud de eliminación').props.onPress(),
    );
    expect(visibleText()).toContain('respondida');
    expect(visibleText()).not.toContain('está pendiente de revisión');
    expect(visibleText()).toContain('no confirma que la eliminación');
  });

  test.each([
    new AccountDeletionError('La contraseña actual es incorrecta.'),
    new Error('diagnóstico técnico sensible'),
  ])('errores legibles sin recibo ni contraseña persistente', async error => {
    (accountRepository.requestDeletion as jest.Mock).mockRejectedValue(error);
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    await fillForm();
    await act(async () =>
      button('Registrar solicitud de eliminación').props.onPress(),
    );
    expect(
      renderer.root.findAll(node => node.props.accessibilityRole === 'alert')
        .length,
    ).toBeGreaterThan(0);
    expect(visibleText()).not.toContain('diagnóstico técnico sensible');
    expect(visibleText()).not.toContain('Solicitud registrada correctamente');
    expect(renderer.root.findByType(TextInput).props.value).toBe('');
    expect(button('Registrar solicitud de eliminación').props.disabled).toBe(
      true,
    );
    expect(logout).not.toHaveBeenCalled();
  });

  test('formulario usa scroll consciente del teclado y sus encabezados son accesibles', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    expect(
      renderer.root.findByType(KeyboardAwareScrollView).props,
    ).toMatchObject({ bottomOffset: 32, keyboardShouldPersistTaps: 'handled' });
    expect(
      renderer.root
        .findAllByType(Text)
        .filter(node => node.props.accessibilityRole === 'header').length,
    ).toBeGreaterThanOrEqual(3);
  });
});
