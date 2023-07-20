// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { useDynamicOverlap } from '../../../lib/components/internal/hooks/use-dynamic-overlap';
import { useAppLayoutInternals } from '../../../lib/components/app-layout/visual-refresh/context';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

let positiveHeight = true;

jest.mock('../../../lib/components/internal/hooks/container-queries/utils', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/container-queries/utils'),
  convertResizeObserverEntry: () => ({ contentBoxHeight: positiveHeight ? 800 : 0 }),
}));

describe('Dynamic overlap context', () => {
  function renderApp(appLayoutProps?: AppLayoutProps) {
    function InternalComponentWithOverlap() {
      const ref = useDynamicOverlap();
      const { isDynamicOverlapSet, isDynamicOverlapDisabled } = useAppLayoutInternals();
      return (
        <>
          <div ref={ref} />
          <div data-testid="is-dynamic-overlap-set">{isDynamicOverlapSet.toString()}</div>
          <div data-testid="is-dynamic-overlap-disabled">{isDynamicOverlapDisabled.toString()}</div>
        </>
      );
    }

    function App(props: { children: React.ReactNode }) {
      return <AppLayout {...appLayoutProps} content={props.children} />;
    }

    render(
      <App>
        <InternalComponentWithOverlap />
      </App>
    );
    return {
      isDynamicOverlapSet: () => screen.getByTestId('is-dynamic-overlap-set').textContent,
      isDynamicOverlapDisabled: () => screen.getByTestId('is-dynamic-overlap-disabled').textContent,
    };
  }

  beforeEach(() => {
    positiveHeight = true;
  });

  test('sets dynamic overlap when content header is present', () => {
    const { isDynamicOverlapSet, isDynamicOverlapDisabled } = renderApp({ contentHeader: 'Content header' });
    expect(isDynamicOverlapSet()).toBe('true');
    expect(isDynamicOverlapDisabled()).toBe('false');
  });
  test('sets dynamic overlap when height is higher than 0', () => {
    const { isDynamicOverlapSet, isDynamicOverlapDisabled } = renderApp();
    expect(isDynamicOverlapSet()).toBe('true');
    expect(isDynamicOverlapDisabled()).toBe('false');
  });
  test('does not set dynamic overlap when no content header is present and height is 0', () => {
    positiveHeight = false;
    const { isDynamicOverlapSet, isDynamicOverlapDisabled } = renderApp();
    expect(isDynamicOverlapSet()).toBe('false');
    expect(isDynamicOverlapDisabled()).toBe('true');
  });
  test('disables dynamic overlap when explicitly specified in the app layout props', () => {
    const { isDynamicOverlapDisabled } = renderApp({ disableContentHeaderOverlap: true });
    expect(isDynamicOverlapDisabled()).toBe('true');
  });
});
