// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { createSingletonState } from '../../../../../lib/components/internal/hooks/use-singleton-handler';

function setup() {
  const state = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handler: (value: number) => {},
  };
  const useSingletonState = createSingletonState({
    initialState: 0,
    factory: handler => {
      state.handler = handler;
      return () => {};
    },
  });

  function Demo({ id }: { id: string }) {
    const state = useSingletonState();
    return (
      <div>
        {id}: {state}
      </div>
    );
  }

  return { Demo, state };
}

test('should render updated value', () => {
  const { Demo, state } = setup();
  const { container } = render(
    <>
      <Demo id="first" />
      <Demo id="second" />
    </>
  );
  expect(container).toHaveTextContent('first: 0');
  expect(container).toHaveTextContent('second: 0');
  state.handler(123);
  expect(container).toHaveTextContent('first: 123');
  expect(container).toHaveTextContent('second: 123');
});

test('should use updated value for late-rendered components', () => {
  const { Demo, state } = setup();
  const { container, rerender } = render(
    <>
      <Demo id="first" />
    </>
  );
  state.handler(123);
  rerender(
    <>
      <Demo id="first" />
      <Demo id="second" />
    </>
  );
  expect(container).toHaveTextContent('first: 123');
  expect(container).toHaveTextContent('second: 123');
});
