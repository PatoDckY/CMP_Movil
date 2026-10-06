/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock(
  'react-native-keyboard-controller',
  () => ({
    KeyboardProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => children,
    KeyboardAwareScrollView: ({
      children,
    }: {
      children: React.ReactNode;
    }) => children,
  }),
);

jest.mock(
  '../src/session/SessionContext',
  () => ({
    SessionProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => children,
  }),
);

jest.mock(
  '../src/navigation/RootNavigator',
  () => ({
    RootNavigator: () => null,
  }),
);

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <App />,
    );
  });
});