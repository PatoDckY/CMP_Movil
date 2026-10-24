import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChangePasswordScreen } from '../../src/screens/account/ChangePasswordScreen';
import { PasswordField } from '../../src/components/auth/PasswordField';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';
import { AuthenticatedStackParamList } from '../../src/navigation/types';
import { passwordChangeRepository } from '../../src/config/dependencies';
import { useSession } from '../../src/session/SessionContext';
import { ApiError } from '../../src/services/http/httpClient';

jest.mock('../../src/session/SessionContext', () => ({ useSession: jest.fn() }));
jest.mock('../../src/config/dependencies', () => ({
  passwordChangeRepository: { changePassword: jest.fn() },
}));
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) => children,
}));

const props = {} as unknown as NativeStackScreenProps<
  AuthenticatedStackParamList,
  'ChangePassword'
>;

describe('Cambio de contraseña - pantalla', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  const logout = jest.fn();
  const repo = passwordChangeRepository as jest.Mocked<typeof passwordChangeRepository>;
  const fields = () => renderer.root.findAllByType(PasswordField);
  const button = () => renderer.root.findByType(PrimaryButton);
  const fill = async (current: string, next: string, confirm: string) => {
    await act(async () => {
      fields()[0].props.onChangeText(current);
      fields()[1].props.onChangeText(next);
      fields()[2].props.onChangeText(confirm);
    });
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    logout.mockResolvedValue(undefined);
    (useSession as jest.Mock).mockReturnValue({ logout });
    await act(async () => {
      renderer = ReactTestRenderer.create(<ChangePasswordScreen {...props} />);
    });
  });
  afterEach(async () => {
    await act(async () => renderer.unmount());
  });

  test('muestra tres campos de contraseña y el botón deshabilitado hasta completarlos', async () => {
    expect(fields()).toHaveLength(3);
    expect(button().props.disabled).toBe(true);
    await fill('Actual#9x', 'Nueva#7kz', 'Nueva#7kz');
    expect(button().props.disabled).toBe(false);
  });

  test('éxito: Alert con el mensaje del servidor y cierre de sesión', async () => {
    repo.changePassword.mockResolvedValue('Contraseña actualizada correctamente. Vuelve a iniciar sesión.');
    await fill('Actual#9x', 'Nueva#7kz', 'Nueva#7kz');
    await act(async () => button().props.onPress());
    expect(repo.changePassword).toHaveBeenCalledWith('Actual#9x', 'Nueva#7kz', 'Nueva#7kz');
    expect(Alert.alert).toHaveBeenCalledWith(
      'Contraseña actualizada',
      'Contraseña actualizada correctamente. Vuelve a iniciar sesión.',
    );
    expect(logout).toHaveBeenCalledTimes(1);
  });

  test('error del backend visible y sin cerrar sesión', async () => {
    repo.changePassword.mockRejectedValue(
      new ApiError('La contraseña actual no es correcta.', 401, null),
    );
    await fill('mala', 'Nueva#7kz', 'Nueva#7kz');
    await act(async () => button().props.onPress());
    const texts = renderer.root
      .findAllByType(Text)
      .map(node => [node.props.children].flat().join(''));
    expect(texts).toContain('La contraseña actual no es correcta.');
    expect(logout).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });
});
