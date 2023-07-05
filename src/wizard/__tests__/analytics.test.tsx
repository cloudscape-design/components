// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Wizard, { WizardProps } from '../../../lib/components/wizard';

import { FunnelMetrics, setFunnelMetrics } from '../../../lib/components/internal/analytics';
import { useFunnel } from '../../../lib/components/internal/analytics/hooks/use-funnel';

import { DEFAULT_I18N_SETS, DEFAULT_STEPS } from './common';

const mockedFunnelInteractionId = 'mocked-funnel-id';
function mockFunnelMetrics() {
  setFunnelMetrics({
    funnelStart: jest.fn(() => mockedFunnelInteractionId),
    funnelError: jest.fn(),
    funnelComplete: jest.fn(),
    funnelSuccessful: jest.fn(),
    funnelCancelled: jest.fn(),
    funnelStepStart: jest.fn(),
    funnelStepComplete: jest.fn(),
    funnelStepNavigation: jest.fn(),
    funnelSubStepStart: jest.fn(),
    funnelSubStepComplete: jest.fn(),
    funnelSubStepError: jest.fn(),
    helpPanelInteracted: jest.fn(),
    externalLinkInteracted: jest.fn(),
  });
}

describe('Wizard Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('calls funnelStart when the component is mounted', () => {
    render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelType: 'multi-page',
        totalFunnelSteps: 3, // Length of DEFAULT_STEPS.length,
        optionalStepNumbers: [1], // DEFAULT_STEPS[1] is optional
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        componentVersion: expect.any(String),
        theme: expect.any(String),
      })
    );
  });

  test('calls funnelStepStart when a step is mounted', () => {
    render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);

    // Step 1 is started
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

  test('navigating to the next step will call funnelStepComplete and funnelStepNavigation', () => {
    const { container } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    const wizardWrapper = createWrapper(container).findWizard();

    wizardWrapper!.findPrimaryButton().click(); // Click the primary button to navigate to the next step

    // Step 1 is completed
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );

    // Navigate from Step 1 to Step 2
    expect(FunnelMetrics.funnelStepNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        navigationType: 'next',
        stepNumber: 1,
        destinationStepNumber: 2,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
      })
    );
  });

  test('calls funnelStepStart when navigating to the next step', () => {
    const { container } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    const wizardWrapper = createWrapper(container).findWizard();

    // Clear initial funnelStepStart call from render
    jest.clearAllMocks();

    wizardWrapper!.findPrimaryButton().click(); // Click the primary button to navigate to the next step

    // Step 2 is started
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 2,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );
  });

  const ChildComponent = () => {
    const { submissionAttempt } = useFunnel();
    return <div data-testid="submission-attempt">{submissionAttempt}</div>;
  };

  test('increments the submissionAttempt counter when clicking Next', () => {
    const { container, getByTestId } = render(
      <Wizard
        steps={[
          { title: 'Counter step', content: <ChildComponent /> },
          { title: 'Other step', content: <></> },
        ]}
        activeStepIndex={0}
        onNavigate={() => {}}
        i18nStrings={DEFAULT_I18N_SETS[0]}
      />
    );
    const wizardWrapper = createWrapper(container).findWizard();

    expect(getByTestId('submission-attempt').textContent).toBe('0');

    wizardWrapper!.findPrimaryButton().click();
    expect(getByTestId('submission-attempt').textContent).toBe('1');
  });

  test('increments the submissionAttempt counter when clicking Submit', () => {
    const { container, getByTestId } = render(
      <Wizard
        steps={[{ title: 'Counter step', content: <ChildComponent /> }]}
        activeStepIndex={0}
        onNavigate={() => {}}
        i18nStrings={DEFAULT_I18N_SETS[0]}
      />
    );
    const wizardWrapper = createWrapper(container).findWizard();

    expect(getByTestId('submission-attempt').textContent).toBe('0');

    wizardWrapper!.findPrimaryButton().click();
    expect(getByTestId('submission-attempt').textContent).toBe('1');
  });

  test('sends a startStep metric when navigating to a new step when navigating with the navigation', () => {
    const { container } = render(
      <Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} allowSkipTo={true} />
    );
    const wizardWrapper = createWrapper(container).findWizard();

    // Clear initial funnelStepStart call from render
    jest.clearAllMocks();

    wizardWrapper!.findMenuNavigationLink(2)!.click();

    // Step 2 is started
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 2,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );

    expect(FunnelMetrics.funnelStepNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        navigationType: 'skip',
        stepNumber: 1,
        destinationStepNumber: 2,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
      })
    );
  });

  test('navigating to the previous step will call funnelStepComplete and funnelStepNavigation', () => {
    const { container } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    const wizardWrapper = createWrapper(container).findWizard();

    // Navigate to Step 2
    wizardWrapper!.findPrimaryButton().click();
    wizardWrapper!.findPreviousButton()!.click(); // Click the previous button to navigate to the previous step

    // Step 2 is completed
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        stepNumber: 2,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
      })
    );

    // Navigate from Step 2 to Step 1
    expect(FunnelMetrics.funnelStepNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        navigationType: 'previous',
        stepNumber: 2,
        destinationStepNumber: 1,
        funnelInteractionId: expect.any(String),
        stepNameSelector: expect.any(String),
      })
    );
  });

  test('does not send multiple funnelStart or funnelStepStart metrics on rerenders', () => {
    const { rerender } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    rerender(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    rerender(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    rerender(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);

    expect(FunnelMetrics.funnelStart).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toBeCalledTimes(1);
  });

  test('sends a funnelComplete metric clicking the submit button', () => {
    const { unmount, container } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    const wizardWrapper = createWrapper(container).findWizard();

    wizardWrapper!.findPrimaryButton().click(); // Step 1 -> Step 2
    wizardWrapper!.findPrimaryButton().click(); // Step 2 -> Step 3
    wizardWrapper!.findPrimaryButton().click(); // Submit

    // funnelComplete is called in the next tick after unmounting
    unmount();

    expect(FunnelMetrics.funnelComplete).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends a funnelCancelled metric clicking the cancel button', () => {
    const { unmount, container } = render(<Wizard steps={DEFAULT_STEPS} i18nStrings={DEFAULT_I18N_SETS[0]} />);
    const wizardWrapper = createWrapper(container).findWizard();

    wizardWrapper!.findCancelButton().click();

    // funnelCancel is called in the next tick after unmounting
    unmount();

    expect(FunnelMetrics.funnelCancelled).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });

  test('sends a funnelError metric when an error is rendered', () => {
    const steps: WizardProps['steps'] = [
      {
        ...DEFAULT_STEPS[0],
        errorText: 'Error',
      },
    ];

    render(<Wizard steps={steps} i18nStrings={DEFAULT_I18N_SETS[0]} />);

    expect(FunnelMetrics.funnelError).toBeCalledTimes(1);
    expect(FunnelMetrics.funnelError).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelInteractionId: expect.any(String),
      })
    );
  });
});
