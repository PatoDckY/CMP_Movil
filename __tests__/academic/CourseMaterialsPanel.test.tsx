import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {AppState, Linking} from 'react-native';
import {CourseMaterialsPanel} from '../../src/components/myCourses/CourseMaterialsPanel';
import {PrimaryButton} from '../../src/components/common/PrimaryButton';
import {courseMaterialsRepository} from '../../src/config/dependencies';
import {ApiError} from '../../src/services/http/httpClient';

jest.mock('../../src/config/dependencies', () => ({
  courseMaterialsRepository: {getMaterials: jest.fn()},
  courseMaterialsSessionScope: {version: () => 0, subscribe: () => () => {}},
}));
jest.mock('../../src/session/SessionContext', () => ({useSession: () => ({user: {id: 1}})}));
const link = 'https://drive.google.com/drive/folders/fixture';
describe('Pantalla real de materiales', () => {
  let renderer: ReturnType<typeof ReactTestRenderer.create>;
  beforeEach(() => {jest.clearAllMocks(); jest.spyOn(AppState, 'addEventListener').mockReturnValue({remove: jest.fn()});});
  afterEach(async () => {await act(async () => renderer?.unmount()); jest.restoreAllMocks();});
  test.each([
    ['no_iniciado', 'Los materiales estarán disponibles cuando comience el curso'],
    ['finalizado', 'El periodo de acceso a materiales ha finalizado'],
    ['sin_materiales', 'Aún no hay materiales disponibles'],
    ['disponible', 'Consulta los materiales de tu curso en Google Drive.'],
  ])('%s muestra mensaje y protege el botón', async (status, message) => {
    (courseMaterialsRepository.getMaterials as jest.Mock).mockResolvedValue({enrollmentId:7,courseId:2,status,url:status==='disponible'?link:undefined});
    await act(async () => {renderer = ReactTestRenderer.create(<CourseMaterialsPanel enrollmentId={7} courseId={2} />);});
    expect(JSON.stringify(renderer.toJSON())).toContain(message);
    const button = renderer.root.findAllByType(PrimaryButton).find(node => node.props.label === 'Ver materiales del curso');
    expect(Boolean(button)).toBe(status === 'disponible');
    expect(renderer.root.findAllByType(PrimaryButton)).toHaveLength(1);
    expect(JSON.stringify(renderer.toJSON())).not.toContain(link);
  });
  test('reintenta un error y reautoriza al pulsar, aunque cambie el periodo', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    (courseMaterialsRepository.getMaterials as jest.Mock).mockRejectedValueOnce(new ApiError('private '+link,403,null))
      .mockResolvedValueOnce({enrollmentId:7,courseId:2,status:'disponible',url:link})
      .mockResolvedValueOnce({enrollmentId:7,courseId:2,status:'finalizado'});
    await act(async () => {renderer = ReactTestRenderer.create(<CourseMaterialsPanel enrollmentId={7} courseId={2} />);});
    expect(JSON.stringify(renderer.toJSON())).toContain('No tienes autorización');
    expect(JSON.stringify(renderer.toJSON())).not.toContain(link);
    await act(async () => renderer.root.findAllByType(PrimaryButton).find(node => node.props.label === 'Reintentar materiales')?.props.onPress());
    await act(async () => renderer.root.findAllByType(PrimaryButton).find(node => node.props.label === 'Ver materiales del curso')?.props.onPress());
    expect(courseMaterialsRepository.getMaterials).toHaveBeenCalledTimes(3);
    expect(open).not.toHaveBeenCalled();
    expect(JSON.stringify(renderer.toJSON())).toContain('El periodo de acceso a materiales ha finalizado');
  });
});
