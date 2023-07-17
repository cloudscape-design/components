// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { useDynamicOverlap } from '../../../lib/components/internal/hooks/use-dynamic-overlap';
import { useAppLayoutInternals } from '../../../lib/components/app-layout/visual-refresh/context';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

const mockedHeight = 800;

jest.mock('../../../lib/components/internal/hooks/container-queries/utils', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/container-queries/utils'),
  convertResizeObserverEntry: () => ({ contentBoxHeight: mockedHeight }),
}));

const testId = 'resolver';

function renderApp(children: React.ReactNode) {
  function App(props: { children: React.ReactNode }) {
    return <AppLayout content={props.children} />;
  }

  const { container, rerender } = render(<App>{children}</App>);
  return {
    getDynamicOverlap: () => Number.parseInt(screen.getByTestId(testId).textContent ?? ''),
    rerender: (children: React.ReactNode) => rerender(<App>{children}</App>),
    wrapper: createWrapper(container),
  };
}

describe('Visual Refresh context', () => {
  test('updates dynamic overlap on resize', () => {
    function Component() {
      const ref = useDynamicOverlap();
      const { dynamicOverlapHeight } = useAppLayoutInternals();
      return (
        <div ref={ref} data-testid={testId}>
          {dynamicOverlapHeight}
        </div>
      );
    }
    const { getDynamicOverlap } = renderApp(<Component />);
    expect(getDynamicOverlap()).toBe(mockedHeight);
  });
});
