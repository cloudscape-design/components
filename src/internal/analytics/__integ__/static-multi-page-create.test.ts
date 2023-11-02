// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../../lib/components/test-utils/selectors';

interface ExtendedWindow extends Window {
  __awsuiFunnelMetrics__: Array<any>;
}

declare const window: ExtendedWindow;

const wrapper = createWrapper();
const FUNNEL_INTERACTION_ID = 'mocked-funnel-id';

class MultiPageCreate extends BasePageObject {
  async getFunnelLog() {
    const funnelLog = await this.browser.execute(() => window.__awsuiFunnelMetrics__);
    const actions = funnelLog.map(item => item.action);
    return { funnelLog, actions };
  }
}

const setupTest = (testFn: (page: MultiPageCreate) => Promise<void>) => {
  return useBrowser(async browser => {
    const page = new MultiPageCreate(browser);
    await browser.url('#/light/funnel-analytics/static-multi-page-flow');
    await testFn(page);
  });
};

describe('Multi-page create', () => {
  test(
    'Starts funnel and funnel step and page is loaded',
    setupTest(async page => {
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart']);

      const [funnelStartEvent, funnelStartStepEvent] = funnelLog;
      expect(funnelStartEvent.props).toEqual({
        componentVersion: expect.any(String),
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        funnelType: 'multi-page',
        optionalStepNumbers: [2],
        theme: 'vr',
        totalFunnelSteps: 3,
        stepConfiguration: [
          {
            name: 'Step 1',
            number: 1,
            isOptional: false,
          },
          {
            name: 'Step 2',
            number: 2,
            isOptional: true,
          },
          {
            name: 'Step 3',
            number: 3,
            isOptional: false,
          },
        ],
      });

      expect(funnelStartEvent.resolvedProps).toEqual({
        funnelName: 'Create Resource',
      });

      expect(funnelStartStepEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        subStepConfiguration: [
          {
            name: 'Container 1 - header',
            number: 1,
          },
          {
            name: 'Container 2 - header',
            number: 2,
          },
        ],
        stepNumber: 1,
        totalSubSteps: 2,
      });
    })
  );

  test(
    'Starts and ends substep when navigating between containers',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.keys('Tab'); // Input 1 -> Input 2
      await page.keys('Tab'); // Input 2 -> Form Field 3 External Link

      const { funnelLog, actions } = await page.getFunnelLog();
      const [, , funnelSubStep1StartEvent, funnelSubsteStep1CompleteEvent, funnelSubStep2StartEvent] = funnelLog;

      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart',
        'funnelSubStepStart',
        'funnelSubStepComplete',
        'funnelSubStepStart',
      ]);

      expect(funnelSubStep1StartEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
        stepNumber: 1,
      });
      expect(funnelSubStep1StartEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
      });
      expect(funnelSubStep1StartEvent.resolvedProps.subStepAllElements.length).toBe(2);

      expect(funnelSubsteStep1CompleteEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
        stepNumber: 1,
      });
      expect(funnelSubsteStep1CompleteEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
      });

      expect(funnelSubStep2StartEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        subStepName: 'Container 2 - header',
        stepNumber: 1,
      });
      expect(funnelSubStep2StartEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        stepName: 'Step 1',
        subStepName: 'Container 2 - header',
      });
      expect(funnelSubStep2StartEvent.resolvedProps.subStepAllElements.length).toBe(2);
    })
  );

  test(
    'wizard step navigation',
    setupTest(async page => {
      await page.click(wrapper.findWizard().findPrimaryButton().toSelector());
      await page.click(wrapper.findWizard().findPreviousButton().toSelector());
      const { funnelLog, actions } = await page.getFunnelLog();
      const [, , funnelStepNavigationEvent, , , funnelStepPreviousNavigationEvent] = funnelLog;

      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart', // Step 1 - Start
        'funnelStepNavigation', // Navigate to Step 2
        'funnelStepComplete', // Step 1 - Complete
        'funnelStepStart', // Step 2 - Start
        'funnelStepNavigation', // Navigate back to Step 1
        'funnelStepComplete', // Step 2 - Complete
        'funnelStepStart', // Step 1 - Start
      ]);

      expect(funnelStepNavigationEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        navigationType: 'next',
        destinationStepNumber: 2,
        stepNumber: 1,
      });

      expect(funnelStepNavigationEvent.resolvedProps).toEqual({
        stepName: 'Step 1',
      });

      expect(funnelStepPreviousNavigationEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 2',
        navigationType: 'previous',
        destinationStepNumber: 1,
        stepNumber: 2,
      });

      expect(funnelStepPreviousNavigationEvent.resolvedProps).toEqual({
        stepName: 'Step 2',
      });
    })
  );

  test(
    'wizard submission',
    setupTest(async page => {
      const primaryButton = wrapper.findWizard().findPrimaryButton().toSelector();
      await page.click(primaryButton);
      await page.click(primaryButton);
      await page.click(primaryButton); // Create

      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart', // Step 1 - Start
        'funnelStepNavigation', // Navigate to Step 2
        'funnelStepComplete', // Step 1 - Complete
        'funnelStepStart', // Step 2 - Start
        'funnelStepNavigation', // Navigate to Step 3
        'funnelStepComplete', // Step 2 - Complete
        'funnelStepStart', // Step 3 - Start
        'funnelComplete',
        'funnelSuccessful',
        'funnelStepComplete', // TODO: This is the current order, it needs work :(
      ]);

      const funnelCompleteEvent = funnelLog[8];
      const funnelSuccessfulEvent = funnelLog[9];

      expect(funnelCompleteEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });

      expect(funnelSuccessfulEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });
    })
  );

  test(
    'wizard cancelled',
    setupTest(async page => {
      await page.click(wrapper.findWizard().findPrimaryButton().toSelector());
      await page.click(wrapper.findWizard().findCancelButton().toSelector());

      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart', // Step 1 - Start
        'funnelStepNavigation', // Navigate to Step 2
        'funnelStepComplete', // Step 1 - Complete
        'funnelStepStart', // Step 2 - Start
        'funnelCancelled',
      ]);
      const funnelCancelledEvent = funnelLog[5];
      expect(funnelCancelledEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });
    })
  );

  test(
    'wizard abandoned',
    setupTest(async page => {
      await page.click('[data-testid=unmount]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelCancelled']);

      const funnelCancelledEvent = funnelLog[2];
      expect(funnelCancelledEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });
    })
  );

  test(
    'Field error',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.setValue(wrapper.findInput('[data-testid=field1]').findNativeInput().toSelector(), 'error');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelSubStepStart', 'funnelSubStepError']);

      const funnelSubStepErrorEvent = funnelLog[3];
      expect(funnelSubStepErrorEvent.props).toEqual({
        fieldErrorSelector: expect.any(String),
        fieldLabelSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Step 1',
        stepNumber: 1,
        subStepName: 'Container 1 - header',
      });

      expect(funnelSubStepErrorEvent.resolvedProps).toEqual({
        fieldLabel: 'Field 1',
        fieldError: 'Trigger error',
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
      });
    })
  );

  test(
    'Wizard error',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.setValue(wrapper.findInput('[data-testid=field1]').findNativeInput().toSelector(), 'error');
      await page.click(wrapper.findWizard().findPrimaryButton().toSelector());

      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart',
        'funnelSubStepStart',
        'funnelSubStepError',
        'funnelStepNavigation', // Navigation "attempt"
        'funnelSubStepError', // FIXME: Should be a funnelStepError with error message
        'funnelError',
        'funnelSubStepComplete',
      ]);
      const funnelErrorEvent = funnelLog[6];
      expect(funnelErrorEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });
    })
  );
});
