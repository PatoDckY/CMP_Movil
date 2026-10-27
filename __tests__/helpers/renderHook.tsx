import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
export { act };
export async function renderHook<T>(hook: () => T) {
  let current!: T;
  function Probe() {
    current = hook();
    return null;
  }
  let renderer!: ReturnType<typeof ReactTestRenderer.create>;
  await act(async () => {
    renderer = ReactTestRenderer.create(<Probe />);
  });
  return {
    get current() {
      return current;
    },
    async unmount() {
      await act(async () => renderer.unmount());
    },
  };
}
export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
