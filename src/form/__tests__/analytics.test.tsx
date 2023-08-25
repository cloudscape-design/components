// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Button from '../../../lib/components/button';
import Form from '../../../lib/components/form';
import Modal from '../../../lib/components/modal';
import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { useFunnel } from '../../../lib/components/internal/analytics/hooks/use-funnel';

import { mockFunnelMetrics } from '../../internal/analytics/__tests__/mocks';

// JSDom does not support the `innerText` property. For this test, `textContent` is close enough.
Object.defineProperty(HTMLElement.prototype, 'innerText', {
  get() {
    return this.textContent;
  },
  set(v) {
    this.textContent = v;
  },
});

describe('Form Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('sends funnelStart and funnelStepStart metrics when Form is mounted', () => {
    render(<Form />);
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelType: 'single-page',
        totalFunnelSteps: 1,
        optionalStepNumbers: [],
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        componentVersion: expect.any(String),
        theme: expect.any(String),
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

  test('includes the current breadcrumb as the step name in the funnelStepStart event', () => {
    render(
      <>
        <BreadcrumbGroup
          items={[
            { text: 'Resources', href: '' },
            { text: 'My creation flow', href: '' },
          ]}
        />
        <Form />
      </>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        stepName: 'My creation flow',
      })
    );
  });

  test('defers to a parent Form if present', () => {
    render(
      <Form>
        <Form>
          <Form>Content</Form>
        </Form>
      </Form>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
  });

  test('does not send a funnelStepComplete metric when Form is unmounted', () => {
    const { unmount } = render(<Form />);
    act(() => void jest.runAllTimers());

    unmount();

    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();
  });

  test('sends a funnelCancelled metric when Form is unmounted', () => {
    const { unmount } = render(<Form />);
    act(() => void jest.runAllTimers());

    unmount();
    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('does not send a funnelComplete when the form is unmounted after clicking a non-primary button in the actions slot', () => {
    const { container, unmount } = render(<Form actions={<Button data-testid="cancel">Cancel</Button>} />);
    act(() => void jest.runAllTimers());
    const formWrapper = createWrapper(container).findForm();
    const cancelButton = formWrapper!.findActions()!.findButton('[data-testid="cancel"]');

    act(() => cancelButton!.click());
    unmount();

    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('does not send a funnelComplete metric when the form is unmounted after clicking a primary button in a modal', () => {
    const { container } = render(
      <Form>
        <Modal
          visible={true}
          footer={
            <Button data-testid="submit" variant="primary">
              Submit
            </Button>
          }
        >
          Modal content
        </Modal>
      </Form>
    );
    act(() => void jest.runAllTimers());
    const submitButton = createWrapper(container.ownerDocument.body).findButton('[data-testid="submit"]');

    act(() => submitButton!.click());

    expect(FunnelMetrics.funnelCancelled).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();
  });

  test('sends a funnelComplete and funnelStepComplete metric when the form is unmounted after clicking a primary button in the children slot', () => {
    const { container, unmount } = render(
      <Form>
        <Button data-testid="submit" variant="primary">
          Submit
        </Button>
      </Form>
    );
    act(() => void jest.runAllTimers());
    const formWrapper = createWrapper(container).findForm();
    const submitButton = formWrapper!.findContent()!.findButton('[data-testid="submit"]');

    act(() => submitButton!.click());
    unmount();

    expect(FunnelMetrics.funnelCancelled).not.toHaveBeenCalled();

    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );

    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );
  });

  /**
   * For the funnelComplete metric is emitted under the following assumptions:
   * 1. The submit button is the only primary button in the form
   * 2. The submit button is clicked before the Form is unmounted
   */
  test('sends a funnelComplete and funnelStepComplete metric when the Form is unmounted after clicking a primary button in the actions slot', () => {
    const { container, unmount } = render(
      <Form
        actions={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
      />
    );
    act(() => void jest.runAllTimers());
    const formWrapper = createWrapper(container).findForm();
    const submitButton = formWrapper!.findActions()!.findButton('[data-testid="submit"]');

    act(() => submitButton!.click());
    unmount();

    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );

    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('increments the submissionAttempt counter when clicking Submit', () => {
    const ChildComponent = () => {
      const { submissionAttempt } = useFunnel();
      return <div data-testid="submission-attempt">{submissionAttempt}</div>;
    };

    const { container, getByTestId } = render(
      <Form
        actions={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
      >
        <ChildComponent />
      </Form>
    );
    act(() => void jest.runAllTimers());
    const formWrapper = createWrapper(container).findForm();
    const submitButton = formWrapper!.findActions()!.findButton('[data-testid="submit"]');

    expect(getByTestId('submission-attempt').textContent).toBe('0');

    act(() => submitButton!.click());
    expect(getByTestId('submission-attempt').textContent).toBe('1');
  });

  test('sends a funnelError metric when an error is rendered', () => {
    render(<Form errorText="Error" />);
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelError).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('does not send multiple funnelStart and funnelStepStart metrics when Form is re-rendered', () => {
    const { rerender } = render(<Form />);
    act(() => void jest.runAllTimers());
    rerender(<Form />);
    act(() => void jest.runAllTimers());
    rerender(<Form />);
    act(() => void jest.runAllTimers());
    rerender(<Form />);
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
  });
});
