// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { useDynamicOverlap } from '../../../../../lib/components/internal/hooks/use-dynamic-overlap';
import { AppContext } from '../../../../../lib/components/contexts/app-context';
import customCssProps from '../../../generated/custom-css-properties';

jest.mock('../../../../../lib/components/internal/hooks/container-queries/use-container-query', () => ({
  useContainerQuery: () => [800, () => {}],
}));

const testId = 'resolver';
const getDynamicOverlap = () => screen.getByTestId(testId).style.getPropertyValue(customCssProps.overlapHeight);

function renderApp(children: React.ReactNode) {
  function App(props: { children: React.ReactNode }) {
    const ref = createRef<HTMLElement>();
    return (
      <>
        <div data-testid={testId} ref={ref as React.Ref<HTMLDivElement>} />
        <AppContext.Provider value={{ rootElement: ref }}>{props.children}</AppContext.Provider>
      </>
    );
  }

  render(<App>{children}</App>);
}

test('is not defined when disabled', () => {
  function Component() {
    const ref = useDynamicOverlap({ disabled: true });
    return <div ref={ref}></div>;
  }
  renderApp(<Component />);
  expect(getDynamicOverlap()).toBe('');
});

test('sets dynamic overlap', () => {
  function Component() {
    const ref = useDynamicOverlap();
    return <div ref={ref}></div>;
  }
  renderApp(<Component />);
  expect(getDynamicOverlap()).toBe('800px');
});
