// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import Button from '../../../lib/components/button/index.js';
import { InternalButton } from '../../../lib/components/button/internal.js';
import { AnalyticsFunnel } from '../../../lib/components/internal/analytics/components/analytics-funnel.js';
import { FunnelMetrics } from '../../../lib/components/internal/analytics/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { mockedFunnelInteractionId, mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks.js';

import styles from '../../../lib/components/button/styles.css.js';

test('supports __iconClass property', () => {
  const { container } = render(<InternalButton __iconClass="example-class" iconName="settings" />);
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

  test('does not send an externalLinkInteracted metric when button is disabled', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button iconName="external" href="https://example.com" disabled={true} />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
  });

  test('does not send an externalLinkInteracted metric when the button is not a link', () => {
    const onClick = jest.fn();
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button iconName="external" onClick={onClick} />
        <Button target="_blank" onClick={onClick} />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container)
      .findAllButtons()
      .forEach(wrapper => wrapper.click());

    expect(onClick).toHaveBeenCalledTimes(2);
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

  test('does not send an externalLinkInteracted metric when button with target=_blank is disabled', () => {
    const { container } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <Button target="_blank" href="https://example.com" disabled={true} />
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());
    createWrapper(container).findButton()!.click();

    expect(FunnelMetrics.externalLinkInteracted).not.toHaveBeenCalled();
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
