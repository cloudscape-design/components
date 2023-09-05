// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect } from 'react';
import { render, screen } from '@testing-library/react';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { useDynamicOverlap } from '../../../lib/components/internal/hooks/use-dynamic-overlap';
import { useAppLayoutInternals } from '../../../lib/components/app-layout/visual-refresh/context';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

let positiveHeight = true;

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  useResizeObserver: (_getElement: () => null | HTMLElement, onObserve: (entry: ContainerQueryEntry) => void) => {
    useLayoutEffect(() => {
      onObserve({ contentBoxHeight: positiveHeight ? 800 : 0 } as ContainerQueryEntry);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  },
}));

describe('Background overlap', () => {
  function ComponentWithDynamicOverlap() {
    const ref = useDynamicOverlap();
    const { hasBackgroundOverlap, isBackgroundOverlapDisabled } = useAppLayoutInternals();
    return (
      <>
        <div ref={ref} />
        <div data-testid="has-background-overlap">{hasBackgroundOverlap.toString()}</div>
        <div data-testid="is-background-overlap-disabled">{isBackgroundOverlapDisabled.toString()}</div>
      </>
    );
  }

  function ComponentWithoutDynamicOverlap() {
    const { hasBackgroundOverlap, isBackgroundOverlapDisabled } = useAppLayoutInternals();
    return (
      <>
        <div data-testid="has-background-overlap">{hasBackgroundOverlap.toString()}</div>
        <div data-testid="is-background-overlap-disabled">{isBackgroundOverlapDisabled.toString()}</div>
      </>
    );
  }

  function renderApp(appLayoutProps?: AppLayoutProps) {
    const { rerender } = render(<AppLayout {...appLayoutProps} />);
    return {
      hasBackgroundOverlap: () => screen.getByTestId('has-background-overlap').textContent,
      isOverlapDisabled: () => screen.getByTestId('is-background-overlap-disabled').textContent,
      rerender: (appLayoutProps?: AppLayoutProps) => rerender(<AppLayout {...appLayoutProps} />),
    };
  }

  beforeEach(() => {
    positiveHeight = true;
  });

  describe('is applied', () => {
    test('when a child component sets the height dynamically with a height higher than 0', () => {
      const { hasBackgroundOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithDynamicOverlap />,
      });
      expect(hasBackgroundOverlap()).toBe('true');
      expect(isOverlapDisabled()).toBe('false');
    });

    test('when content header is present', () => {
      const { hasBackgroundOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithoutDynamicOverlap />,
        contentHeader: 'Content header',
      });
      expect(hasBackgroundOverlap()).toBe('true');
      expect(isOverlapDisabled()).toBe('false');
    });
  });

  describe('is not applied', () => {
    test('when no content header is present and height is 0', () => {
      positiveHeight = false;
      const { hasBackgroundOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithDynamicOverlap />,
      });
      expect(hasBackgroundOverlap()).toBe('false');
      expect(isOverlapDisabled()).toBe('true');
    });

    test('when no content header is present and no child component sets the height dynamically', () => {
      const { hasBackgroundOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithoutDynamicOverlap />,
      });
      expect(hasBackgroundOverlap()).toBe('false');
      expect(isOverlapDisabled()).toBe('true');
    });
  });

  test('is disabled when explicitly specified in the app layout props', () => {
    const { isOverlapDisabled } = renderApp({
      content: <ComponentWithDynamicOverlap />,
      disableContentHeaderOverlap: true,
    });
    expect(isOverlapDisabled()).toBe('true');
  });

  test('is updated accordingly when re-rendering', () => {
    const { hasBackgroundOverlap, isOverlapDisabled, rerender } = renderApp({
      content: <ComponentWithDynamicOverlap />,
    });
    expect(hasBackgroundOverlap()).toBe('true');
    expect(isOverlapDisabled()).toBe('false');
    rerender({ content: <ComponentWithoutDynamicOverlap /> });
    expect(hasBackgroundOverlap()).toBe('false');
    expect(isOverlapDisabled()).toBe('true');
  });
});
