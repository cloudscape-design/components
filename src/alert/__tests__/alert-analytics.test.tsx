// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import Alert from '../../../lib/components/alert';
import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
  AnalyticsFunnelSubStep,
} from '../../../lib/components/internal/analytics/components/analytics-funnel';
import { useFunnel } from '../../../lib/components/internal/analytics/hooks/use-funnel';
import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

describe('Alert Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();

    // These numbers were chosen at random
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 200,
      x: 30,
      y: 50,
      left: 30,
      top: 50,
      bottom: 100,
      right: 400,
      toJSON: () => '',
    });
  });

  test('sends funnelSubStepError metric when the alert is placed inside a substep', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <Alert type="error">This is the error text</Alert>
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelError).not.toHaveBeenCalled();

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: 'mocked-funnel-id',
        subStepSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
      })
    );
  });

  test('sends funnelError metric when the alert is placed inside a step', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Alert type="error">This is the error text</Alert>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();

    expect(FunnelMetrics.funnelError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: 'mocked-funnel-id',
      })
    );
  });

  test('does not send any error metric when the alert is invisible', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <Alert type="error" visible={false}>
              This is the error text
            </Alert>
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelError).not.toHaveBeenCalled();
  });

  test('does not send any error metrics for non-error alerts', () => {
    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <Alert>Default</Alert>
            <Alert type="info">Info</Alert>
            <Alert type="success">Success</Alert>
            <Alert type="warning">Warning</Alert>
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelError).not.toHaveBeenCalled();
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
            <Alert type="error">This is the error text</Alert>
          </AnalyticsFunnelSubStep>

          <ChildComponent />
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    const { rerender } = render(jsx);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);

    act(() => funnelNextOrSubmitAttempt!());
    rerender(jsx);
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(2);
  });

  test('does not send any error metrics when outside of a funnel context', () => {
    render(<Alert type="error">This is the error text</Alert>);
    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelError).not.toHaveBeenCalled();
  });

  test('does not send multiple funnelSubStepError metrics on rerender', () => {
    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <Alert type="error">This is the error text</Alert>
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <AnalyticsFunnelSubStep>
            <Alert type="error">This is the error text</Alert>
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelError).not.toHaveBeenCalled();
  });

  test('does not send multiple funnelError metrics on rerender', () => {
    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Alert type="error">This is the error text</Alert>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Alert type="error">This is the error text</Alert>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepError).not.toHaveBeenCalled();
  });
});
