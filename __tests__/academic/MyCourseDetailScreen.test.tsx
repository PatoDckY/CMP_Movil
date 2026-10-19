import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, AppState, Linking, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MyCourseDetailScreen } from '../../src/screens/myCourses/MyCourseDetailScreen';
import { PrimaryButton } from '../../src/components/common/PrimaryButton';
import {
  myCoursesRepository,
  courseMaterialsRepository,
} from '../../src/config/dependencies';
import { mapMyCourseDetailDtoToModel } from '../../src/mappers/myCourseMapper';
import { AuthenticatedStackParamList } from '../../src/navigation/types';
import { myCourseDto } from '../helpers/fixtures';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (effect: () => void) =>
    require('react').useEffect(effect, [effect]),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));
jest.mock('../../src/session/SessionContext', () => ({
  useSession: () => ({ user: { id: 1 } }),
}));
jest.mock('../../src/config/dependencies', () => ({
  myCoursesRepository: {
    getMyCourseDetail: jest.fn(),
    getMyCourses: jest.fn(),
  },
  courseMaterialsRepository: { getMaterials: jest.fn() },
  courseMaterialsSessionScope: { version: () => 0, subscribe: () => () => {} },
}));
const link = 'https://drive.google.com/drive/folders/fixture';
const dto = {
  ...myCourseDto,
  idCurso: 2502,
  tituloCurso: 'Prueba de Compra',
  sesiones: [
    {
      ...myCourseDto.sesiones[0],
      idSesion: 22,
      numeroSesion: 2,
      titulo: 'Encuentro posterior',
      fecha: '2026-10-20',
      estadoAsistencia: 'Falta',
      justificada: true,
      motivoJustificacion: 'Motivo ficticio',
    },
    {
      ...myCourseDto.sesiones[0],
      idSesion: 11,
      numeroSesion: 1,
      titulo: 'Encuentro inicial',
      fecha: '2026-10-15',
      estadoAsistencia: 'Retardo',
      minutosRetardo: 7,
      horaEntrada: '09:07',
      ubicacionNombre: 'Sala de pruebas',
      direccionCompleta: 'Dirección ficticia de la sesión',
      observacionesAsistencia: 'Observación ficticia',
    },
  ],
};
type Props = NativeStackScreenProps<
  AuthenticatedStackParamList,
  'MyCourseDetail'
>;
const navigation = { goBack: jest.fn() };
const props = {
  navigation,
  route: { params: { enrollmentId: 7 } },
} as unknown as Props;
function text(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(text).join('');
  }
  if (node && typeof node === 'object' && 'children' in node) {
    return text(node.children);
  }
  return '';
}

describe('Detalle de inscripción con sesiones, asistencia y materiales reales de las capas móviles', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(AppState, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() });
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(
      mapMyCourseDetailDtoToModel(dto),
    );
    (courseMaterialsRepository.getMaterials as jest.Mock).mockResolvedValue({
      enrollmentId: 7,
      courseId: 2502,
      status: 'disponible',
      url: link,
    });
  });
  afterEach(async () => {
    await act(async () => renderer?.unmount());
    jest.restoreAllMocks();
  });
  async function render() {
    await act(async () => {
      renderer = ReactTestRenderer.create(<MyCourseDetailScreen {...props} />);
    });
  }
  const card = (id: string) =>
    renderer.root.findAll(node => node.props.testID === id)[0];

  test('organiza encabezado, materiales, sesiones y asistencia en ese orden y usa ID de inscripción', async () => {
    await render();
    const tree = JSON.stringify(renderer.toJSON());
    const ids = [
      'course-heading',
      'course-materials-card',
      'course-sessions-section',
      'course-attendance-section',
    ];
    const positions = ids.map(id => tree.indexOf(id));
    expect(positions.every(position => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(myCoursesRepository.getMyCourseDetail).toHaveBeenCalledWith(7);
    expect(courseMaterialsRepository.getMaterials).toHaveBeenCalledWith(7);
    expect(text(renderer.toJSON())).not.toMatch(
      /%|Sesiones completadas|lecciones|módulos/,
    );
    expect(
      renderer.root
        .findAllByType(PrimaryButton)
        .filter(node => node.props.label === 'Ver materiales del curso'),
    ).toHaveLength(1);
    expect(tree).not.toContain(link);
  });
  test('ordena sesiones y conserva sus estados, modalidad, hora y asistencia asociada', async () => {
    await render();
    const sessions = text(
      card('course-sessions-section')
        .findAllByType(Text)
        .map(node => node.props.children),
    );
    expect(sessions.indexOf('Encuentro inicial')).toBeLessThan(
      sessions.indexOf('Encuentro posterior'),
    );
    expect(sessions).toContain('Virtual');
    expect(sessions).toContain('09:00');
    expect(sessions).toContain('Programada');
    expect(sessions).toContain('Sala de pruebas');
    expect(sessions).toContain('Dirección ficticia de la sesión');
    const early = text(
      card('attendance-session-11')
        .findAllByType(Text)
        .map(node => node.props.children),
    );
    const later = text(
      card('attendance-session-22')
        .findAllByType(Text)
        .map(node => node.props.children),
    );
    expect(early).toContain('Retardo: 7 minutos');
    expect(early).toContain('Entrada: 09:07');
    expect(early).toContain('Observación ficticia');
    expect(early).not.toContain('Motivo ficticio');
    expect(later).toContain('Falta');
    expect(later).toContain('Justificación registrada');
    expect(later).toContain('Motivo ficticio');
    expect(later).not.toContain('Retardo:');
    expect(
      renderer.root.findAll(node =>
        /marcar.*asistencia/i.test(node.props.accessibilityLabel ?? ''),
      ).length > 0,
    ).toBe(false);
  });
  test('sin sesiones ni registros informa ausencia sin fabricar asistencias', async () => {
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(
      mapMyCourseDetailDtoToModel({ ...dto, sesiones: [] }),
    );
    await render();
    expect(text(renderer.toJSON())).toContain(
      'Todavía no hay sesiones programadas',
    );
    expect(text(renderer.toJSON())).toContain(
      'No hay sesiones para consultar registros de asistencia',
    );
  });
  test('un estado ausente se muestra sin registro, sin convertirlo en falta', async () => {
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(
      mapMyCourseDetailDtoToModel({
        ...dto,
        sesiones: [
          {
            ...dto.sesiones[1],
            estadoAsistencia: '',
            minutosRetardo: null,
            horaEntrada: null,
          },
        ],
      }),
    );
    await render();
    const attendance = text(
      card('course-attendance-section')
        .findAllByType(Text)
        .map(node => node.props.children),
    );
    expect(attendance).toContain('Sin registro');
    expect(attendance).not.toContain('Falta');
    expect(attendance).not.toContain('Retardo:');
  });
  test('conserva un timestamp de entrada completo sin recortarlo como una hora', async () => {
    const timestamp = '2026-10-15T09:07:00Z';
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(mapMyCourseDetailDtoToModel({...dto, sesiones: [{...dto.sesiones[1], horaEntrada: timestamp}]}));
    await render();
    const attendance = text(card('course-attendance-section').findAllByType(Text).map(node => node.props.children));
    expect(attendance).toContain(`Entrada: ${timestamp}`);
  });
  test('al abrir materiales vuelve a autorizar con ID 7, aunque el curso sea 2502', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await render();
    await act(async () =>
      renderer.root
        .findAllByType(PrimaryButton)
        .find(node => node.props.label === 'Ver materiales del curso')
        ?.props.onPress(),
    );
    expect(courseMaterialsRepository.getMaterials).toHaveBeenNthCalledWith(
      2,
      7,
    );
    expect(open).toHaveBeenCalledWith(link);
  });
  test.each([
    ['https://example.com/session', true],
    ['http://example.com/session', false],
    ['javascript:alert(1)', false], // eslint-disable-line no-script-url -- Verifica el rechazo de un esquema inseguro.
  ])('sesión virtual %s respeta HTTPS', async (url, permitted) => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(
      mapMyCourseDetailDtoToModel({
        ...dto,
        sesiones: [{ ...dto.sesiones[0], enlaceVirtual: url }],
      }),
    );
    await render();
    await act(async () =>
      renderer.root
        .findByProps({
          accessibilityLabel: 'Abrir sesión virtual Encuentro posterior',
        })
        .props.onPress(),
    );
    expect(open).toHaveBeenCalledTimes(permitted ? 1 : 0);
    expect(alert).toHaveBeenCalledTimes(permitted ? 0 : 1);
  });
  test('errores de consulta permiten reintentar sin mostrar datos anteriores', async () => {
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockRejectedValueOnce(
      new Error('Sin conexión'),
    );
    await render();
    expect(text(renderer.toJSON())).toContain('Sin conexión');
    expect(JSON.stringify(renderer.toJSON())).not.toContain(
      'course-materials-card',
    );
    await act(async () =>
      renderer.root
        .findAllByType(PrimaryButton)
        .find(node => node.props.label === 'Reintentar')
        ?.props.onPress(),
    );
    expect(text(renderer.toJSON())).toContain('Prueba de Compra');
  });
  test('conserva títulos y observaciones largos sin truncar el contenido', async () => {
    const title =
      'Curso con título extenso para formación institucional '.repeat(8);
    const note = 'Observación registrada por la institución '.repeat(10);
    (myCoursesRepository.getMyCourseDetail as jest.Mock).mockResolvedValue(
      mapMyCourseDetailDtoToModel({
        ...dto,
        tituloCurso: title,
        sesiones: [{ ...dto.sesiones[0], observacionesAsistencia: note }],
      }),
    );
    await render();
    expect(text(renderer.toJSON())).toContain(title);
    expect(text(renderer.toJSON())).toContain(note);
    expect(
      renderer.root
        .findAllByType(Text)
        .filter(node => node.props.numberOfLines),
    ).toHaveLength(0);
  });
});
