// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import FormField from '../../../lib/components/form-field';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { DATA_ATTR_FIELD_LABEL, DATA_ATTR_FIELD_ERROR } from '../../../lib/components/internal/analytics/selectors';
import { useFunnel } from '../../../lib/components/internal/analytics/hooks/use-funnel';

import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
  AnalyticsFunnelSubStep,
} from '../../../lib/components/internal/analytics/components/analytics-funnel';

import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

describe('FormField Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('sends funnelSubStepError metric when errorText is present', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField label="Label" errorText="Error" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: 'mocked-funnel-id',
        fieldErrorSelector: expect.any(String),
        fieldLabelSelector: expect.any(String),
        subStepSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
      })
    );
  });

  test('sends a funnelSubStepError metric when there is an error and the errorText is changed', () => {
    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="Error" label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="New Error" label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(2);
  });

  test('sends a funnelSubStepError metric when there is an error and the user attempts to submit the form', () => {
    let funnelNextOrSubmitAttempt: undefined | (() => void) = undefined;

    const ChildComponent = () => {
      funnelNextOrSubmitAttempt = useFunnel().funnelNextOrSubmitAttempt;
      return <></>;
    };

    const jsx = (
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="Error" label="Label" />
          </AnalyticsFunnelSubStep>

          <ChildComponent />
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    const { rerender } = render(jsx);
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);

    act(() => funnelNextOrSubmitAttempt!());
    rerender(jsx);

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(2);
  });

  test('does not send a funnelSubStepError metric when outside of a funnel context', () => {
    render(<FormField errorText="Error" />);
    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
  });

  test('does not send a funnelSubStepError metric when there is no error', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
  });

  test('does not send multiple funnelSubStepError metrics on rerender', () => {
    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="Error" label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="Error" label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
  });

  test('does not send a funnelSubStepError metric when the errorText is removed', () => {
    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField errorText="Error" label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    jest.clearAllMocks(); // Reset all mock function call counters

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <FormField label="Label" />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
  });

  test('adds data-analytics attributes for label and error selectors', () => {
    const { getByTestId } = render(<FormField errorText="Error" label="Label" data-testid="form-field" />);

    const formField = getByTestId('form-field');
    expect(formField).toHaveAttribute(DATA_ATTR_FIELD_LABEL, expect.any(String));
    expect(formField).toHaveAttribute(DATA_ATTR_FIELD_ERROR, expect.any(String));
  });
});
