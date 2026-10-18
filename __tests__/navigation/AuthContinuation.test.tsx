import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, TextInput, SectionList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CourseDetailScreen } from '../../src/screens/catalog/CourseDetailScreen';
import { CatalogScreen } from '../../src/screens/catalog/CatalogScreen';
import { LoginScreen } from '../../src/screens/auth/LoginScreen';
import { RegisterScreen } from '../../src/screens/auth/RegisterScreen';
import { PasswordRecoveryScreen } from '../../src/screens/auth/PasswordRecoveryScreen';
import {
  authRepository,
  courseRepository,
} from '../../src/config/dependencies';
import { useSession } from '../../src/session/SessionContext';
import { PublicStackParamList } from '../../src/navigation/types';
import { course } from '../helpers/fixtures';

jest.mock('../../src/config/dependencies', () => ({
  authRepository: {
    login: jest.fn(),
    sendRegistrationOtp: jest.fn(),
    register: jest.fn(),
  },
  courseRepository: { getCourses: jest.fn(), getCourseById: jest.fn() },
  passwordRecoveryRepository: { requestPasswordReset: jest.fn() },
}));
jest.mock('../../src/session/SessionContext', () => ({
  useSession: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) =>
    children,
}));

describe('A29/A30/A34 - filtros y continuidad entre navegación pública y autenticada', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  const navigation = {
    navigate: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
  };
  const setAuthenticatedUser = jest.fn();
  function props<T extends keyof PublicStackParamList>(
    name: T,
    params: PublicStackParamList[T],
  ) {
    return {
      navigation,
      route: { name, key: name, params },
    } as unknown as NativeStackScreenProps<PublicStackParamList, T>;
  }
  function control(label: string) {
    return renderer.root.findAll(
      node =>
        node.props.accessibilityLabel === label &&
        typeof node.props.onPress === 'function',
    )[0];
  }
  beforeEach(() => {
    jest.resetAllMocks();
    (useSession as jest.Mock).mockReturnValue({ setAuthenticatedUser });
    (courseRepository.getCourseById as jest.Mock).mockResolvedValue(course);
    (courseRepository.getCourses as jest.Mock).mockResolvedValue([
      course,
      {
        ...course,
        id: 2,
        categoryId: 2,
        categoryName: 'Otra categoría',
        cost: '0.00',
      },
    ]);
  });
  afterEach(async () => {
    await act(async () => renderer?.unmount());
    jest.restoreAllMocks();
  });

  test('detalle público conserva el curso al elegir login o registro y no registra compras', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <CourseDetailScreen {...props('CourseDetail', { courseId: 1 })} />,
      );
    });
    await act(async () => control('Comprar curso').props.onPress());
    const options = alert.mock.calls.at(-1)?.[2];
    await act(async () =>
      options?.find(item => item.text === 'Iniciar sesión')?.onPress?.(),
    );
    expect(navigation.navigate).toHaveBeenCalledWith('Login', {
      purchaseCourseId: 1,
    });
    await act(async () =>
      options?.find(item => item.text === 'Crear cuenta')?.onPress?.(),
    );
    expect(navigation.navigate).toHaveBeenCalledWith('Register', {
      purchaseCourseId: 1,
    });
  });
  test('login publica identidad e intención solo tras autenticación válida', async () => {
    (authRepository.login as jest.Mock).mockResolvedValue({
      status: 'authenticated',
      user: { id: 1 },
    });
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <LoginScreen {...props('Login', { purchaseCourseId: 1 })} />,
      );
    });
    const inputs = renderer.root.findAllByType(TextInput);
    await act(async () => {
      inputs[0].props.onChangeText('fixture@example.com');
      inputs[1].props.onChangeText('fixture-password');
    });
    await act(async () =>
      renderer.root.findAllByType(TextInput)[1].props.onSubmitEditing(),
    );
    expect(setAuthenticatedUser).toHaveBeenCalledWith({ id: 1 }, 1);
  });
  test('credenciales rechazadas no habilitan navegación de adquisición', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (authRepository.login as jest.Mock).mockRejectedValue(
      new Error('Credenciales inválidas'),
    );
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <LoginScreen {...props('Login', { purchaseCourseId: 1 })} />,
      );
    });
    await act(async () => {
      const inputs = renderer.root.findAllByType(TextInput);
      inputs[0].props.onChangeText('fixture@example.com');
      inputs[1].props.onChangeText('fixture-password');
    });
    await act(async () =>
      renderer.root.findAllByType(TextInput)[1].props.onSubmitEditing(),
    );
    expect(setAuthenticatedUser).not.toHaveBeenCalled();
  });
  test('registro conserva el curso al regresar a login', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <RegisterScreen {...props('Register', { purchaseCourseId: 1 })} />,
      );
    });
    await act(async () =>
      control('Ya tengo cuenta: iniciar sesión').props.onPress(),
    );
    expect(navigation.replace).toHaveBeenCalledWith('Login', {
      purchaseCourseId: 1,
    });
  });
  test('recuperación no pierde la continuación al regresar a login', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <PasswordRecoveryScreen
          {...props('PasswordRecovery', { purchaseCourseId: 1 })}
        />,
      );
    });
    await act(async () => control('Volver a iniciar sesión').props.onPress());
    expect(navigation.navigate).toHaveBeenCalledWith('Login', {
      purchaseCourseId: 1,
    });
  });
  test('error de detalle ofrece reintento funcional', async () => {
    (courseRepository.getCourseById as jest.Mock).mockRejectedValueOnce(
      new Error('Sin conexión'),
    );
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <CourseDetailScreen {...props('CourseDetail', { courseId: 1 })} />,
      );
    });
    await act(async () =>
      control('Reintentar cargar el curso').props.onPress(),
    );
    expect(courseRepository.getCourseById).toHaveBeenCalledTimes(2);
    expect(control('Comprar curso')).toBeDefined();
  });
  test('filtrar precio y restablecer modifica las secciones visibles del catálogo sin otra carga', async () => {
    await act(async () => {
      renderer = ReactTestRenderer.create(<CatalogScreen />);
    });
    const input = renderer.root
      .findAllByType(TextInput)
      .find(
        node =>
          node.props.accessibilityLabel === 'Precio máximo en pesos mexicanos',
      )!;
    await act(async () => input.props.onChangeText('0'));
    expect(renderer.root.findByType(SectionList).props.sections).toEqual([
      expect.objectContaining({ data: [expect.objectContaining({ id: 2 })] }),
    ]);
    await act(async () =>
      control('Limpiar búsqueda y filtros').props.onPress(),
    );
    expect(renderer.root.findByType(SectionList).props.sections).toHaveLength(
      2,
    );
    expect(courseRepository.getCourses).toHaveBeenCalledTimes(1);
  });
});
