// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import { InternalButton } from '../../../lib/components/button/internal';
import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { AnalyticsFunnel } from '../../../lib/components/internal/analytics/components/analytics-funnel';
import createWrapper from '../../../lib/components/test-utils/dom';
import { mockedFunnelInteractionId, mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

import styles from '../../../lib/components/button/styles.css.js';

test('specific properties take precedence over nativeAttributes', () => {
  const { container } = render(
    <InternalButton ariaLabel="property" __nativeAttributes={{ 'aria-label': 'native attribute' }} />
  );
  expect(container.querySelector('button')).toHaveAttribute('aria-label', 'property');
});

test('supports providing custom attributes', () => {
  const { container } = render(<InternalButton __nativeAttributes={{ 'aria-hidden': 'true' }} />);
  expect(container.querySelector('button')).toHaveAttribute('aria-hidden', 'true');
});

test('supports __iconClass property', () => {
  const { container } = render(
    <InternalButton __iconClass="example-class" iconName="settings" __nativeAttributes={{ 'aria-expanded': 'true' }} />
  );
  expect(container.querySelector(`button .${styles.icon}`)).toHaveClass('example-class');
});

test('sets disabled and does not set aria-disabled, when __focusable is not provided', () => {
  const { container } = render(<InternalButton disabled={true} />);

  const button = container.querySelector('button');

  expect(button).toHaveAttribute('disabled');
  expect(button).not.toHaveAttribute('aria-disabled');
});

test('sets aria-disabled when __focusable is provided', () => {
  const { container } = render(<InternalButton disabled={true} __focusable={true} />);
  const button = container.querySelector('button');

  expect(button).toHaveAttribute('aria-disabled', 'true');
  expect(button).not.toHaveAttribute('disabled');
});

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('does not send any metrics when not in a funnel context', () => {
    const { container } = render(<Button iconName="external" target="_blank" href="https://example.com" />);
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
  });

  test('sends an externalLinkInteracted metric within a Funnel Context with iconName=external', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button iconName="external" href="https://example.com" />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalled();
    expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: mockedFunnelInteractionId,
        elementSelector: expect.any(String),
      })
    );
  });

  test('does not send an externalLinkInteracted metric when the button is not a link', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button iconName="external" data-testid="1" />
        <Button target="_blank" data-testid="2" />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton('[data-testid="1"]')!.click();
    createWrapper(container).findButton('[data-testid="2"]')!.click();

    expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
  });

  test('sends an externalLinkInteracted metric within a Funnel Context with target=_blank', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button target="_blank" href="https://example.com" />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalled();
    expect(FunnelMetrics.externalLinkInteracted).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: mockedFunnelInteractionId,
        elementSelector: expect.any(String),
      })
    );
  });

  test('does not send an externalLinkInteracted metric for non-external links', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button href="https://example.com" />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
  });
});
