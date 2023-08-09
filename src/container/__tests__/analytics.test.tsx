// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, act } from '@testing-library/react';

import Container from '../../../lib/components/container';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { DATA_ATTR_FUNNEL_SUBSTEP } from '../../../lib/components/internal/analytics/selectors';

import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
} from '../../../lib/components/internal/analytics/components/analytics-funnel';

describe('Funnel Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('renders normally when outside the context of a funnel', () => {
    const { getByTestId } = render(<Container data-testid="container" />);
    expect(getByTestId('container')).not.toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP);
  });

  test('adds additional analytics attributes', () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container data-testid="container">Hello</Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(getByTestId('container')).toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP, expect.any(String));
  });

  test('sends funnelSubStepStart and funnelSubStepComplete metric when focussed and blurred', async () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input" />
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(0);

    getByTestId('input').focus();
    await runPendingPromises();
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();

    getByTestId('input').blur();
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);
  });

  test('moving the focus inside one container does not emit metrics', async () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input-one" />

            <input data-testid="input-two" />
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();

    getByTestId('input-one').focus();
    getByTestId('input-two').focus();
    getByTestId('input-one').focus();

    await runPendingPromises();

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();
  });

  test('nested containers do not send their own events', async () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input-one" />

            <Container>
              <input data-testid="input-two" />
            </Container>
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();

    getByTestId('input-one').focus();
    getByTestId('input-two').focus();
    getByTestId('input-one').focus();

    await runPendingPromises();

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();
  });

  test('sibling containers send their own events', async () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input-one" />
          </Container>
          <Container>
            <input data-testid="input-two" />
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();

    act(() => getByTestId('input-one').focus());
    await runPendingPromises();
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();

    act(() => getByTestId('input-two').focus());
    await runPendingPromises();
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(2);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);

    act(() => getByTestId('input-one').focus());
    await runPendingPromises();
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(3);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(2);
  });
});

const runPendingPromises = async () => {
  jest.runAllTimers();
  await Promise.resolve();
};
