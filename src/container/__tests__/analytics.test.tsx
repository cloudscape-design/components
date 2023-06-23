// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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

    expect(getByTestId('container')).toHaveAttribute(DATA_ATTR_FUNNEL_SUBSTEP, expect.any(String));
  });

  test('sends funnelSubStepStart and funnelSubStepComplete metric when focussed and blurred', () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input" />
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(0);

    fireEvent.focus(getByTestId('input'));
    fireEvent.blur(getByTestId('input'));

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);
  });
});
