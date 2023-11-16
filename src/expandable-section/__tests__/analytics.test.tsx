// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import ExpandableSection from '../../../lib/components/expandable-section';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { DATA_ATTR_FUNNEL_SUBSTEP } from '../../../lib/components/internal/analytics/selectors';

import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
} from '../../../lib/components/internal/analytics/components/analytics-funnel';

describe('Expandable section funnel analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  describe.each(['container', 'stacked'] as const)('%p variant', variant => {
    test('renders normally when outside the context of a funnel', () => {
      const { getByTestId } = render(<ExpandableSection variant={variant} data-testid="container" />);
      expect(getByTestId('container')).not.toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP);
    });

    test('adds additional analytics attributes', () => {
      const { getByTestId } = render(
        <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
          <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
            <ExpandableSection variant={variant} data-testid="container">
              Hello
            </ExpandableSection>
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
            <ExpandableSection variant={variant}>
              <input data-testid="input" />
            </ExpandableSection>
          </AnalyticsFunnelStep>
        </AnalyticsFunnel>
      );
      act(() => void jest.runAllTimers());

      expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(0);

      getByTestId('input').focus();
      await runPendingPromises();

      getByTestId('input').blur();

      expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
      expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe.each(['default', 'footer', 'navigation'] as const)('%p variant', variant => {
    test('does not add additional analytics attributes', () => {
      const { getByTestId } = render(
        <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
          <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
            <ExpandableSection variant={variant} data-testid="container">
              Hello
            </ExpandableSection>
          </AnalyticsFunnelStep>
        </AnalyticsFunnel>
      );
      act(() => void jest.runAllTimers());

      expect(getByTestId('container')).not.toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP, expect.any(String));
    });

    test('does not send any metrics when focused and blurred', () => {
      const { getByTestId } = render(
        <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
          <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
            <ExpandableSection variant={variant}>
              <input data-testid="input" />
            </ExpandableSection>
          </AnalyticsFunnelStep>
        </AnalyticsFunnel>
      );
      act(() => void jest.runAllTimers());

      expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();

      fireEvent.focus(getByTestId('input'));
      fireEvent.blur(getByTestId('input'));

      expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();
      expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();
    });
  });
});

const runPendingPromises = async () => {
  jest.runAllTimers();
  await Promise.resolve();
};
