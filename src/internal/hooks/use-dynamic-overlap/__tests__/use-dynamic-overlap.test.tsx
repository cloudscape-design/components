// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';

import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';

import { DynamicOverlapContext } from '../../../../../lib/components/internal/context/dynamic-overlap-context';
import { useDynamicOverlap } from '../../../../../lib/components/internal/hooks/use-dynamic-overlap';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  useResizeObserver: (_getElement: () => null | HTMLElement, onObserve: (entry: ContainerQueryEntry) => void) => {
    useLayoutEffect(() => {
      onObserve({ contentBoxHeight: 800 } as ContainerQueryEntry);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  },
}));

function renderApp(children: React.ReactNode) {
  const testId = 'resolver';

  function App(props: { children: React.ReactNode }) {
    const [dynamicOverlapHeight, setDynamicOverlapHeight] = useState<number | undefined>(0);
    return (
      <DynamicOverlapContext.Provider value={setDynamicOverlapHeight}>
        <div data-testid={testId}>{dynamicOverlapHeight}</div>
        {props.children}
      </DynamicOverlapContext.Provider>
    );
  }

  const { rerender } = render(<App>{children}</App>);
  return {
    getDynamicOverlap: () => Number.parseInt(screen.getByTestId(testId).textContent ?? ''),
    rerender: (children: React.ReactNode) => rerender(<App>{children}</App>),
  };
}

test('is zero when disabled', () => {
  function Component() {
    const ref = useDynamicOverlap({ disabled: true });
    return <div ref={ref}></div>;
  }
  const { getDynamicOverlap } = renderApp(<Component />);
  expect(getDynamicOverlap()).toBe(0);
});

test('sets and resets dynamic overlap', () => {
  function Component() {
    const ref = useDynamicOverlap();
    return <div ref={ref}></div>;
  }
  const { getDynamicOverlap, rerender } = renderApp(<Component />);
  expect(getDynamicOverlap()).toBe(800);

  rerender(<div />);
  expect(getDynamicOverlap()).toBe(0);
});
