// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Button from '../../../lib/components/button';
import Form from '../../../lib/components/form';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';

import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

describe('Form Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('sends funnelStart and funnelStepStart metrics when Form is mounted', () => {
    render(<Form />);

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelType: 'single-page',
        totalFunnelSteps: 1,
        optionalStepNumbers: [],
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        componentVersion: expect.any(String),
        componentTheme: expect.any(String),
      })
    );

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('sends a funnelStepComplete metric when Form is unmounted', () => {
    const { unmount } = render(<Form />);

    unmount();

    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends a funnelCancelled metric when Form is unmounted without clicking submit', () => {
    const { unmount } = render(<Form />);

    unmount();

    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  /**
   * For the funnelComplete metric is emitted under the following assumptions:
   * 1. The submit button is the only primary button in the form
   * 2. The submit button is clicked before the Form is unmounted
   */
  test('sends a funnelComplete metric when Form is unmounted after clicking submit', () => {
    const { container, unmount } = render(
      <Form
        secondaryActions={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
      />
    );
    const formWrapper = createWrapper(container).findForm();
    const submitButton = formWrapper!.findSecondaryActions()!.findButton('[data-testid="submit"]');

    // funnelComplete is called in the next tick after unmounting
    submitButton!.click();
    unmount();

    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends a funnelError metric when an error is rendered', () => {
    render(<Form errorText="Error" />);

    expect(FunnelMetrics.funnelError).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('does not send multiple funnelStart and funnelStepStart metrics when Form is re-rendered', () => {
    const { rerender } = render(<Form />);
    rerender(<Form />);
    rerender(<Form />);
    rerender(<Form />);

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
  });
});
