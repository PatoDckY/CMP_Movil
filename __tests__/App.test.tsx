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
  '../src/services/security/sslPinning',
  () => ({
    initializeCmpSslPinning:
      jest
        .fn()
        .mockResolvedValue(
          undefined,
        ),
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

test(
  'renders correctly after SSL Pinning initialization',
  async () => {
    await ReactTestRenderer.act(
      async () => {
        ReactTestRenderer.create(
          <App />,
        );

        await Promise.resolve();
      },
    );
  },
);