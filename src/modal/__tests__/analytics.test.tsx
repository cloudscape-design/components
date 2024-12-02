// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import Alert from '../../../lib/components/alert';
import Button from '../../../lib/components/button';
import FormField from '../../../lib/components/form-field';
import { FunnelMetrics } from '../../../lib/components/internal/analytics';
import Modal, { ModalProps } from '../../../lib/components/modal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { mockFunnelMetrics, mockGetBoundingClientRect, mockInnerText } from '../../internal/analytics/__tests__/mocks';

mockInnerText();
mockGetBoundingClientRect();

function renderModal(props: Partial<ModalProps> = {}) {
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const { container } = render(<Modal visible={false} {...props} modalRoot={modalRoot} />, {
    container: modalRoot,
  });

  return createWrapper(container).findModal()!;
}

describe('Modal Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('does not send any funnel start events when the modal is mounted but not visible', () => {
    render(<Modal visible={false} />);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(0);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(0);
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(0);
  });

  test('sends funnelStart and funnelStepStart metrics when Modal is visible', () => {
    render(<Modal header="Modal title" visible={true} />);
    act(() => void jest.runAllTimers());

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelType: 'modal',
        totalFunnelSteps: 1,
        optionalStepNumbers: [],
        funnelName: 'Modal title',
        stepConfiguration: [
          {
            isOptional: false,
            name: 'Modal title',
            number: 1,
          },
        ],
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
        stepName: 'Modal title',
        subStepConfiguration: [
          {
            name: '',
            number: 1,
          },
        ],
        totalSubSteps: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );
  });

  test('send funnelStart with the correct modal when multiple modals are present', () => {
    render(
      <>
        <Modal header="Wrong Modal title" visible={false} />
        <Modal header="Modal title" visible={true} />
      </>
    );
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelName: 'Modal title',
      })
    );
  });

  test('sends funnelCancelled when modal is dismissed', () => {
    const { rerender } = render(<Modal header="Modal title" visible={true} />);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);

    rerender(<Modal header="Modal title" visible={false} />);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
  });

  test('sends funnelCancelled when modal is unmounted', () => {
    const { rerender } = render(<Modal header="Modal title" visible={true} />);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);

    rerender(<></>);
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
  });

  test('sends funnelComplete when primary button in footer is clicked', () => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);
    const { container } = render(
      <Modal
        header="Modal title"
        footer={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
        visible={true}
        modalRoot={modalRoot}
      />,
      {
        container: modalRoot,
      }
    );

    const wrapper = createWrapper(container);
    wrapper.findModal()!.findFooter()!.findButton('[data-testid="submit"]')?.click();
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends funnelSuccessful when primary button in footer is clicked and modal is dismissed', () => {
    const modalRoot = document.createElement('div');
    document.body.appendChild(modalRoot);
    const { container, rerender } = render(
      <Modal
        header="Modal title"
        footer={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
        visible={true}
        modalRoot={modalRoot}
      />,
      {
        container: modalRoot,
      }
    );
    act(() => void jest.runAllTimers());

    const wrapper = createWrapper(container);
    wrapper.findModal()!.findFooter()!.findButton('[data-testid="submit"]')?.click();
    rerender(
      <Modal
        header="Modal title"
        footer={
          <Button data-testid="submit" variant="primary">
            Submit
          </Button>
        }
        visible={false}
        modalRoot={modalRoot}
      />
    );

    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelSuccessful).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSuccessful).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends funnelSubstepError when a FormField with errorText is present', () => {
    render(
      <Modal header="Modal title" visible={true}>
        <FormField label="Field Label" errorText="Error" />
      </Modal>
    );
    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
        fieldErrorSelector: expect.any(String),
        fieldLabelSelector: expect.any(String),
        subStepSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
      })
    );
  });

  test('sends funnelSubStepError when an Alert with type error is present', () => {
    render(
      <Modal header="Modal title" visible={true}>
        <Alert type="error">Error</Alert>
      </Modal>
    );

    act(() => void jest.runAllTimers());
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
        subStepSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
      })
    );
  });

  test('adds data-analytics-funnel-interaction-id to root node of modal', () => {
    const wrapper = renderModal({ visible: true });
    act(() => void jest.runAllTimers());

    expect(wrapper.getElement()).toHaveAttribute('data-analytics-funnel-interaction-id');
    expect(wrapper.getElement().getAttribute('data-analytics-funnel-interaction-id')).toEqual('mocked-funnel-id');
  });

  test('adds data-analytics-funnel-step to root node of modal', () => {
    const wrapper = renderModal({ visible: true });
    act(() => void jest.runAllTimers());

    expect(wrapper.getElement()).toHaveAttribute('data-analytics-funnel-step');
    expect(wrapper.getElement().getAttribute('data-analytics-funnel-step')).toEqual('1');
  });

  test('adds data-analytics-funnel-substep to content node of modal', () => {
    const wrapper = renderModal({ visible: true });
    act(() => void jest.runAllTimers());

    expect(wrapper.findContent().getElement()).toHaveAttribute('data-analytics-funnel-substep');
    expect(wrapper.findContent().getElement().getAttribute('data-analytics-funnel-substep')).not.toBeFalsy();
  });
});
