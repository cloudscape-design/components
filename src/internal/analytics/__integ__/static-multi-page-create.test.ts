// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../lib/components/test-utils/selectors';
import { Theme } from '../../../__integ__/utils';
import { getUrlParams } from '../../../app-layout/__integ__/utils';

interface ExtendedWindow extends Window {
  __awsuiFunnelMetrics__: Array<any>;
}

declare const window: ExtendedWindow;

const wrapper = createWrapper();
const FUNNEL_INTERACTION_ID = 'mocked-funnel-id';
const FUNNEL_IDENTIFIER = 'multi-page-demo';

class MultiPageCreate extends BasePageObject {
  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(wrapper.findAppLayout().findContentRegion().toSelector());
  }

  async getFunnelLog() {
    const funnelLog: ExtendedWindow['__awsuiFunnelMetrics__'] = await this.browser.execute(
      () => window.__awsuiFunnelMetrics__
    );
    const actions = funnelLog.map(item => item.action);
    return { funnelLog, actions };
  }

  async getFunnelLogItem(index: number) {
    const item = await this.browser.execute(index => window.__awsuiFunnelMetrics__[index], index);
    if (!item) {
      throw new Error(`No funnel log item at index ${index}`);
    }
    return item;
  }
}

describe.each(['refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest(testFn: (page: MultiPageCreate) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new MultiPageCreate(browser);
      await browser.url(`#/light/funnel-analytics/static-multi-page-flow?${getUrlParams(theme, {})}`);
      await new Promise(r => setTimeout(r, 10));
      await testFn(page);
    });
  }

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
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelName: 'Create Resource',
        flowType: 'create',
        funnelType: 'multi-page',
        resourceType: 'Components',
        optionalStepNumbers: [2],
        componentTheme: 'default',
        totalFunnelSteps: 3,
        stepConfiguration: [
          {
            name: 'Step 1',
            number: 1,
            isOptional: false,
            stepIdentifier: 'step-1',
          },
          {
            name: 'Step 2',
            number: 2,
            isOptional: true,
            stepIdentifier: 'step-2',
          },
          {
            name: 'Step 3',
            number: 3,
            isOptional: false,
            stepIdentifier: 'step-3',
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
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: 'step-1',
        stepName: 'Step 1',
        subStepConfiguration: [
          {
            name: 'Container 1 - header',
            number: 1,
            subStepIdentifier: 'step1-container1',
          },
          {
            name: 'Container 2 - header',
            number: 2,
            subStepIdentifier: 'step1-container2',
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
      const [, , funnelSubStep1StartEvent, funnelSubStep1CompleteEvent, funnelSubStep2StartEvent] = funnelLog;

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
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepIdentifier: 'step-1',
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
        subStepNumber: 1,
        subStepIdentifier: 'step1-container1',
        stepNumber: 1,
      });
      expect(funnelSubStep1StartEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
      });
      expect(funnelSubStep1StartEvent.resolvedProps.subStepAllElements.length).toBe(2);

      expect(funnelSubStep1CompleteEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepIdentifier: 'step-1',
        stepName: 'Step 1',
        subStepName: 'Container 1 - header',
        subStepNumber: 1,
        subStepIdentifier: 'step1-container1',
        stepNumber: 1,
      });
      expect(funnelSubStep1CompleteEvent.resolvedProps).toEqual({
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
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepIdentifier: 'step-1',
        stepName: 'Step 1',
        subStepName: 'Container 2 - header',
        subStepNumber: 2,
        stepNumber: 1,
        subStepIdentifier: 'step1-container2',
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

      const funnelCompleteEventIndex = actions.findIndex(action => action === 'funnelComplete');
      const funnelCompleteEvent = funnelLog[funnelCompleteEventIndex];
      expect(funnelCompleteEvent.props).toEqual({
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });

      const funnelSucessEventIndex = actions.findIndex(action => action === 'funnelSuccessful');
      const funnelSuccessfulEvent = funnelLog[funnelSucessEventIndex];
      expect(funnelSuccessfulEvent.props).toEqual({
        funnelIdentifier: FUNNEL_IDENTIFIER,
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
        funnelIdentifier: FUNNEL_IDENTIFIER,
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
        funnelIdentifier: FUNNEL_IDENTIFIER,
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
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: 'step-1',
        stepName: 'Step 1',
        stepNumber: 1,
        subStepName: 'Container 1 - header',
        subStepIdentifier: 'step1-container1',
        errorContext: null,
        fieldIdentifier: null,
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
    'Emits a funnelStepError when an error is shown on the last step',
    setupTest(async page => {
      const nextButton = wrapper.findWizard().findPrimaryButton().toSelector();
      await page.click(nextButton); // Step 1 -> Step 2
      await page.click(nextButton); // Step 2 -> Step 3 (Last step)

      const { funnelLog, actions } = await page.getFunnelLog();
      const funnelStepErrorIndex = actions.findIndex(entry => entry === 'funnelStepError');
      const funnelStepErrorEvent = funnelLog[funnelStepErrorIndex];

      expect(funnelStepErrorEvent.props).toEqual(
        expect.objectContaining({
          funnelIdentifier: FUNNEL_IDENTIFIER,
          funnelInteractionId: FUNNEL_INTERACTION_ID,
          errorContext: null,
          stepErrorSelector: expect.stringContaining('#wizard-error-'),
          stepIdentifier: 'step-3',
          stepName: 'Step 3',
          stepNameSelector: '[data-analytics-funnel-key="step-name"]',
          stepNumber: 3,
          subStepAllSelector: '[data-analytics-funnel-substep]',
          subStepConfiguration: null,
          totalSubSteps: 0,
        })
      );
    })
  );

  test(
    'Correct substep number when the step is unmounted before blurring the substep',
    setupTest(async page => {
      await page.click(wrapper.findInput('[data-testid=field4]').findNativeInput().toSelector());
      await page.click(wrapper.findWizard().findPrimaryButton().toSelector());

      const funnelSubStepCompleteEvent = await page.getFunnelLogItem(6);

      expect(funnelSubStepCompleteEvent.action).toEqual('funnelSubStepComplete');
      expect(funnelSubStepCompleteEvent.props).toEqual(
        expect.objectContaining({
          subStepNumber: 2,
        })
      );
    })
  );
});
