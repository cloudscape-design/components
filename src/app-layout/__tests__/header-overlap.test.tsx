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

describe('Header overlap', () => {
  function ComponentWithDynamicOverlap() {
    const ref = useDynamicOverlap();
    const { hasHeaderOverlap, isHeaderOverlapDisabled } = useAppLayoutInternals();
    return (
      <>
        <div ref={ref} />
        <div data-testid="has-header-overlap">{hasHeaderOverlap.toString()}</div>
        <div data-testid="is-header-overlap-disabled">{isHeaderOverlapDisabled.toString()}</div>
      </>
    );
  }

  function ComponentWithoutDynamicOverlap() {
    const { hasHeaderOverlap, isHeaderOverlapDisabled } = useAppLayoutInternals();
    return (
      <>
        <div data-testid="has-header-overlap">{hasHeaderOverlap.toString()}</div>
        <div data-testid="is-header-overlap-disabled">{isHeaderOverlapDisabled.toString()}</div>
      </>
    );
  }

  function renderApp(appLayoutProps?: AppLayoutProps) {
    const { rerender } = render(<AppLayout {...appLayoutProps} />);
    return {
      hasHeaderOverlap: () => screen.getByTestId('has-header-overlap').textContent,
      isOverlapDisabled: () => screen.getByTestId('is-header-overlap-disabled').textContent,
      rerender: (appLayoutProps?: AppLayoutProps) => rerender(<AppLayout {...appLayoutProps} />),
    };
  }

  beforeEach(() => {
    positiveHeight = true;
  });

  describe('applies header overlap', () => {
    test('when a child component sets the height dynamically with a height higher than 0', () => {
      const { hasHeaderOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithDynamicOverlap />,
      });
      expect(hasHeaderOverlap()).toBe('true');
      expect(isOverlapDisabled()).toBe('false');
    });

    test('when content header is present', () => {
      const { hasHeaderOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithoutDynamicOverlap />,
        contentHeader: 'Content header',
      });
      expect(hasHeaderOverlap()).toBe('true');
      expect(isOverlapDisabled()).toBe('false');
    });
  });

  describe('does not apply header overlap', () => {
    test('when no content header is present and height is 0', () => {
      positiveHeight = false;
      const { hasHeaderOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithDynamicOverlap />,
      });
      expect(hasHeaderOverlap()).toBe('false');
      expect(isOverlapDisabled()).toBe('true');
    });

    test('when no content header is present and no child component sets the height dynamically', () => {
      const { hasHeaderOverlap, isOverlapDisabled } = renderApp({
        content: <ComponentWithoutDynamicOverlap />,
      });
      expect(hasHeaderOverlap()).toBe('false');
      expect(isOverlapDisabled()).toBe('true');
    });
  });

  test('disables header overlap when explicitly specified in the app layout props', () => {
    const { isOverlapDisabled } = renderApp({
      content: <ComponentWithDynamicOverlap />,
      disableContentHeaderOverlap: true,
    });
    expect(isOverlapDisabled()).toBe('true');
  });

  test('updates state accordingly when re-rendering', () => {
    const { hasHeaderOverlap, isOverlapDisabled, rerender } = renderApp({
      content: <ComponentWithDynamicOverlap />,
    });
    expect(hasHeaderOverlap()).toBe('true');
    expect(isOverlapDisabled()).toBe('false');
    rerender({ content: <ComponentWithoutDynamicOverlap /> });
    expect(hasHeaderOverlap()).toBe('false');
    expect(isOverlapDisabled()).toBe('true');
  });
});
