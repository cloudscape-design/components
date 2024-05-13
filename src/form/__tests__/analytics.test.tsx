// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Button from '../../../lib/components/button';
import Container from '../../../lib/components/container';
import Form from '../../../lib/components/form';
import Header from '../../../lib/components/header';
import Modal from '../../../lib/components/modal';

import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import { useFunnel } from '../../../lib/components/internal/analytics/hooks/use-funnel';

import { mockFunnelMetrics, mockInnerText } from '../../internal/analytics/__tests__/mocks';

import headerStyles from '../../../lib/components/header/styles.selectors.js';
import modalStyles from '../../../lib/components/modal/styles.selectors.js';

mockInnerText();

describe('Form Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('sends funnelStart and funnelStepStart metrics when Form is mounted', () => {
    render(
      <Form
        header={
          <Header info="This is info" description="This is a description">
            My funnel
          </Header>
        }
      >
        <Container header={<Header>Substep one</Header>}></Container>
        <Container header={<Header>Substep two</Header>}></Container>
      </Form>
    );
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelType: 'single-page',
        totalFunnelSteps: 1,
        optionalStepNumbers: [],
        funnelNameSelector: `.${headerStyles['heading-text']}`,
        funnelVersion: expect.any(String),
        componentVersion: expect.any(String),
        componentTheme: expect.any(String),
        stepConfiguration: [{ isOptional: false, name: 'My funnel', number: 1 }],
      })
    );

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepConfiguration: [
          { name: 'Substep one', number: 1 },
          { name: 'Substep two', number: 2 },
        ],
      })
    );
  });

  test('includes the current Form Header as the step name in the funnelStepStart event', () => {
    render(
      <Form
        header={
          <Header info="This is info" description="This is a description">
            My creation flow
          </Header>
        }
      />
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

  test('send a funnelStepChange event when the substeps change', () => {
    const { rerender } = render(
      <Form>
        <Container header={<Header>Substep 1</Header>}></Container>
        <Container header={<Header>Substep 2</Header>}></Container>
        <Container header={<Header>Substep 3</Header>}></Container>
      </Form>
    );
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStepChange).not.toHaveBeenCalled();

    rerender(
      <Form>
        <Container header={<Header>Substep 1</Header>}></Container>
        <Container header={<Header>Substep 3</Header>}></Container>
      </Form>
    );
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStepChange).toHaveBeenCalledTimes(1);

    expect(FunnelMetrics.funnelStepChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        subStepConfiguration: [
          { name: 'Substep 1', number: 1 },
          { name: 'Substep 3', number: 2 },
        ],
      })
    );

    rerender(
      <Form>
        <Container header={<Header>Substep 0</Header>}></Container>
        <Container header={<Header>Substep 1</Header>}></Container>
        <Container header={<Header>Substep 2</Header>}></Container>
        <Container header={<Header>Substep 3</Header>}></Container>
        <Container header={<Header>Substep 4</Header>}></Container>
      </Form>
    );
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStepChange).toHaveBeenCalledTimes(2);

    expect(FunnelMetrics.funnelStepChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        subStepConfiguration: [
          { name: 'Substep 0', number: 1 },
          { name: 'Substep 1', number: 2 },
          { name: 'Substep 2', number: 3 },
          { name: 'Substep 3', number: 4 },
          { name: 'Substep 4', number: 5 },
        ],
      })
    );
  });

  test('forms embedded inside a Modal use Modal header for the Funnel Name', () => {
    render(
      <Modal header="My Modal Funnel" visible={true}>
        <Form>
          <Container header={<Header>Substep one</Header>}></Container>
          <Container header={<Header>Substep two</Header>}></Container>
        </Form>
      </Modal>
    );

    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelNameSelector: `.${modalStyles['header--text']}`,
        stepConfiguration: [{ isOptional: false, name: 'My Modal Funnel', number: 1 }],
      })
    );
  });

  test('adds a data-analytics-funnel-step attribute to the root of form', () => {
    const { container } = render(<Form></Form>);
    const form = createWrapper(container).findForm()!.getElement();
    expect(form).toHaveAttribute('data-analytics-funnel-step', '1');
  });
});
