import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {CourseProgressBar} from '../../src/components/myCourses/CourseProgressBar';

function render(percentage: number, completed = 1, total = 4) {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    renderer = ReactTestRenderer.create(
      <CourseProgressBar
        progress={{
          completedSessions: completed,
          totalSessions: total,
          progressPercentage: percentage,
        }}
        testID="bar"
      />,
    );
  });
  return JSON.stringify(renderer.toJSON());
}

describe('CourseProgressBar: avance del curso calculado por el servidor', () => {
  test('muestra porcentaje, sesiones y etiqueta accesible', () => {
    const tree = render(25);
    expect(tree).toContain('25%');
    expect(tree).toContain('"1"," de ","4"," sesiones"');
    expect(tree).toContain('Avance del curso: 25%, 1 de 4 sesiones');
    expect(tree).toContain('"width":"25%"');
  });

  test.each([
    [-5, '0%'],
    [150, '100%'],
    [NaN, '0%'],
  ])('un valor fuera de rango (%p) se limita a %s', (value, expected) => {
    expect(render(value)).toContain(`"width":"${expected}"`);
  });
});
