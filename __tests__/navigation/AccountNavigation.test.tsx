import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ActivityIndicator, TextInput } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { useSession } from '../../src/session/SessionContext';
import { RootNavigator } from '../../src/navigation/RootNavigator';
import { AccountDeletionScreen } from '../../src/screens/account/AccountDeletionScreen';
import { AccountScreen } from '../../src/screens/account/AccountScreen';
import { PersonalDataScreen } from '../../src/screens/account/PersonalDataScreen';
import { FormField } from '../../src/components/auth/FormField';
import { Alert } from 'react-native';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';
import {
  accountRepository,
  profileRepository,
} from '../../src/config/dependencies';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthenticatedStackParamList } from '../../src/navigation/types';
jest.mock('../../src/session/SessionContext', () => ({
  useSession: jest.fn(),
}));
jest.mock('../../src/config/dependencies', () => ({
  accountRepository: { requestDeletion: jest.fn() },
  profileRepository: { getProfile: jest.fn(), updateProfile: jest.fn() },
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: jest.fn(({ children }: { children: React.ReactNode }) => children),
}));
jest.mock('../../src/navigation/PublicNavigator', () => ({
  PublicNavigator: () => 'PUBLIC',
}));
jest.mock('../../src/navigation/AuthenticatedNavigator', () => {
  const ReactForMock = require('react');
  let mounts = 0;
  return {
    AuthenticatedNavigator: () => {
      const [identity] = ReactForMock.useState(() => ++mounts);
      return 'PRIVATE-' + identity;
    },
  };
});
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) =>
    children,
}));
const deletionNavigation = { popTo: jest.fn() };
const deletionProps = {
  navigation: deletionNavigation,
} as unknown as NativeStackScreenProps<
  AuthenticatedStackParamList,
  'AccountDeletion'
>;
const sessionMock = useSession as jest.Mock;
const user = {
  id: 1,
  firstName: 'Cliente',
  fullName: 'Cliente Prueba',
  email: 'cliente@example.com',
  role: 'cliente',
  paternalLastName: 'Prueba',
  maternalLastName: null,
};

describe('PF/PS - navegación y formulario de eliminación', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  const logout = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    sessionMock.mockReturnValue({
      user,
      isAuthenticated: true,
      isRestoring: false,
      logout,
    });
  });
  afterEach(async () => {
    await act(async () => renderer?.unmount());
  });
  test.each([true, false])(
    'elige navegación según autenticación=%s',
    async isAuthenticated => {
      sessionMock.mockReturnValue({ isAuthenticated, isRestoring: false });
      await act(async () => {
        renderer = ReactTestRenderer.create(<RootNavigator />);
      });
      expect(JSON.stringify(renderer.toJSON())).toContain(
        isAuthenticated ? 'PRIVATE' : 'PUBLIC',
      );
      expect(JSON.stringify(renderer.toJSON())).not.toContain(
        isAuthenticated ? 'PUBLIC' : 'PRIVATE',
      );
    },
  );
  test('durante restauración no muestra pantallas privadas ni públicas', async () => {
    sessionMock.mockReturnValue({ isAuthenticated: true, isRestoring: true });
    await act(async () => {
      renderer = ReactTestRenderer.create(<RootNavigator />);
    });
    expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    expect(JSON.stringify(renderer.toJSON())).not.toContain('PRIVATE');
  });
  test('A34: tras login conserva el curso elegido con Inicio disponible para regresar', async () => {
    sessionMock.mockReturnValue({user, isAuthenticated: true, isRestoring: false, initialPurchaseCourseId: 42});
    await act(async () => {renderer = ReactTestRenderer.create(<RootNavigator />);});
    const props = (NavigationContainer as unknown as jest.Mock).mock.calls.at(-1)[0];
    expect(props.initialState).toEqual({index: 1, routes: [{name: 'Home'}, {name: 'CreatePurchase', params: {courseId: 42}}]});
    sessionMock.mockReturnValue({user: null, isAuthenticated: false, isRestoring: false, initialPurchaseCourseId: 42});
    await act(async () => renderer.update(<RootNavigator />));
    expect((NavigationContainer as unknown as jest.Mock).mock.calls.at(-1)[0].initialState).toBeUndefined();
  });
  test('conserva navegación al editar nombre y la reinicia si cambia el usuario', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<RootNavigator />);
    });
    const first = JSON.stringify(renderer.toJSON());
    sessionMock.mockReturnValue({
      user: { ...user, fullName: 'Nombre editado' },
      isAuthenticated: true,
      isRestoring: false,
    });
    await act(async () => {
      renderer.update(<RootNavigator />);
    });
    expect(JSON.stringify(renderer.toJSON())).toBe(first);
    sessionMock.mockReturnValue({
      user: { ...user, id: 2 },
      isAuthenticated: true,
      isRestoring: false,
    });
    await act(async () => {
      renderer.update(<RootNavigator />);
    });
    expect(JSON.stringify(renderer.toJSON())).not.toBe(first);
  });
  test('cliente entra a A17 desde cuenta; otro rol no tiene el acceso', async () => {
    const navigate = jest.fn();
    const props = {
      navigation: { navigate },
    } as unknown as NativeStackScreenProps<
      AuthenticatedStackParamList,
      'Account'
    >;
    await act(async () => {
      renderer = ReactTestRenderer.create(<AccountScreen {...props} />);
    });
    const button = renderer.root
      .findAllByType(PrimaryButton)
      .find(node => node.props.label === 'Solicitar eliminación de cuenta');
    expect(button).toBeDefined();
    await act(async () => button?.props.onPress());
    expect(navigate).toHaveBeenCalledWith('AccountDeletion');
    sessionMock.mockReturnValue({ user: { ...user, role: 'admin' }, logout });
    await act(async () => renderer.update(<AccountScreen {...props} />));
    expect(
      renderer.root
        .findAllByType(PrimaryButton)
        .find(node => node.props.label === 'Solicitar eliminación de cuenta'),
    ).toBeUndefined();
  });
  test('202 presenta folio y pendiente, borra formulario y no cierra sesión', async () => {
    (accountRepository.requestDeletion as jest.Mock).mockResolvedValue({
      message: 'Ya tienes una solicitud en proceso.',
      requestId: 17,
      status: 'pendiente',
      deletionCompleted: false,
    });
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    await act(async () => {
      renderer.root
        .findByType(TextInput)
        .props.onChangeText('fixture-password');
      const checkbox = renderer.root.findAll(
        node =>
          node.props.accessibilityRole === 'checkbox' &&
          typeof node.props.onPress === 'function',
      )[0];
      expect(checkbox).toBeDefined();
      checkbox.props.onPress();
    });
    await act(async () =>
      renderer.root.findByType(PrimaryButton).props.onPress(),
    );
    const text = JSON.stringify(renderer.toJSON());
    expect(text).toContain('17');
    expect(text).toContain('pendiente');
    expect(text).toContain('NO se ha completado');
    expect(renderer.root.findAllByType(TextInput)).toHaveLength(0);
    expect(logout).not.toHaveBeenCalled();
  });
  test('rol ajeno no permite enviar desde una ruta directa', async () => {
    sessionMock.mockReturnValue({ user: { ...user, role: 'admin' } });
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <AccountDeletionScreen {...deletionProps} />,
      );
    });
    expect(renderer.root.findAllByType(TextInput)).toHaveLength(0);
    expect(accountRepository.requestDeletion).not.toHaveBeenCalled();
  });
  test('la pantalla de perfil publica el resultado guardado sin restaurar ni desmontar navegación', async () => {
    const profile = {
      id: 1,
      firstName: 'Cliente',
      paternalLastName: 'Prueba',
      maternalLastName: null,
      age: 25,
      sex: 'otro',
      phone: '5555555555',
      email: user.email,
    };
    (profileRepository.getProfile as jest.Mock).mockResolvedValue(profile);
    (profileRepository.updateProfile as jest.Mock).mockResolvedValue({
      ...profile,
      firstName: 'Actualizado',
    });
    const updateProfile = jest.fn();
    const restoreSession = jest.fn();
    sessionMock.mockReturnValue({ user, updateProfile, restoreSession });
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    try {
      await act(async () => {
        renderer = ReactTestRenderer.create(<PersonalDataScreen />);
      });
      await act(async () => {
        renderer.root
          .findAllByType(FormField)
          .find(node => node.props.label === 'Nombre')
          ?.props.onChangeText('Actualizado');
      });
      await act(async () => {
        renderer.root
          .findAllByType(PrimaryButton)
          .find(node => node.props.label === 'Guardar cambios')
          ?.props.onPress();
      });
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Actualizado' }),
      );
      expect(restoreSession).not.toHaveBeenCalled();
      expect(profileRepository.getProfile).toHaveBeenCalledTimes(1);
    } finally {
      alert.mockRestore();
    }
  });
});
