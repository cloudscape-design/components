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
const FUNNEL_IDENTIFIER = 'single-page-demo';
const STEP_IDENTIFIER = FUNNEL_IDENTIFIER;

class SinglePageCreate extends BasePageObject {
  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(wrapper.findAppLayout().findContentRegion().toSelector());
  }

  getFormAttribute(attribute: string) {
    return this.getElementAttribute(wrapper.findForm().toSelector(), attribute);
  }

  async getFunnelLog() {
    const funnelLog: ExtendedWindow['__awsuiFunnelMetrics__'] = await this.browser.execute(
      () => window.__awsuiFunnelMetrics__
    );
    const actions = funnelLog.map(item => item.action);
    return { funnelLog, actions };
  }
}

describe.each(['refresh', 'refresh-toolbar'] as Theme[])('%s', theme => {
  function setupTest(testFn: (page: SinglePageCreate) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new SinglePageCreate(browser);
      await page.visit(`#/light/funnel-analytics/static-single-page-flow?${getUrlParams(theme, {})}`);
      await new Promise(r => setTimeout(r, 10));
      await testFn(page);
    });
  }

  test(
    'Starts funnel and funnel step as page is loaded',
    setupTest(async page => {
      await expect(page.getFormAttribute('data-analytics-funnel-step')).resolves.toBe('1');
      await expect(page.getFormAttribute('data-analytics-funnel-interaction-id')).resolves.toBe(FUNNEL_INTERACTION_ID);

      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart']);

      const [funnelStartEvent, funnelStepStartEvent] = funnelLog;
      expect(funnelStartEvent.props).toEqual({
        componentVersion: expect.any(String),
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelName: 'Form Header',
        flowType: 'create',
        funnelType: 'single-page',
        resourceType: 'Components',
        optionalStepNumbers: [],
        componentTheme: 'default',
        totalFunnelSteps: 1,
        stepConfiguration: [
          {
            name: 'Form Header',
            isOptional: false,
            number: 1,
            stepIdentifier: FUNNEL_IDENTIFIER,
          },
        ],
      });
      expect(funnelStartEvent.resolvedProps).toEqual({
        funnelName: 'Form Header',
      });

      expect(funnelStepStartEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Form Header',
        subStepConfiguration: [
          { name: 'Container 1 - header', number: 1, subStepIdentifier: 'container-1' },
          { name: 'Container 2 - header', number: 2, subStepIdentifier: 'container-2' },
          { name: 'Expandable Section 1 - Header', number: 3, subStepIdentifier: 'expandable-section-1' },
        ],
        stepNumber: 1,
        totalSubSteps: 3,
      });
    })
  );

  test(
    'Starts and ends substep when navigating between containers',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.keys('Tab'); // From Input -> S3 Resource selector Info
      await page.keys('Tab'); // S3 Resource selector Info -> S3 Resource Selector Input
      await page.keys('Tab'); // S3 Resource selector Input -> S3 Resource selector Browse button
      await page.keys('Tab'); // S3 Resource selector Browse button -> Additional configuration header
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart',
        'funnelSubStepStart',
        'funnelSubStepComplete',
        'funnelSubStepStart',
        'funnelSubStepComplete',
        'funnelSubStepStart',
      ]);

      // funnelSubStepStart - Container 1
      expect(funnelLog[2].props).toEqual({
        stepNameSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-1',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Container 1 - header',
        subStepNumber: 1,
      });

      expect(funnelLog[2].resolvedProps).toEqual({
        subStepAllElements: expect.any(Object),
        subStepElement: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 1 - header',
      });

      // funnelSubStepComplete - Container 1
      expect(funnelLog[3].props).toEqual({
        stepNameSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-1',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Container 1 - header',
        subStepNumber: 1,
      });

      expect(funnelLog[3].resolvedProps).toEqual({
        subStepAllElements: expect.any(Object),
        subStepElement: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 1 - header',
      });

      // funnelSubStepStart - Container 2
      expect(funnelLog[4].props).toEqual({
        stepNameSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-2',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Container 2 - header',
        subStepNumber: 2,
      });

      expect(funnelLog[4].resolvedProps).toEqual({
        subStepAllElements: expect.any(Object),
        subStepElement: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 2 - header',
      });

      // funnelSubStepComplete - Container 2
      expect(funnelLog[5].props).toEqual({
        stepNameSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-2',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Container 2 - header',
        subStepNumber: 2,
      });

      expect(funnelLog[5].resolvedProps).toEqual({
        subStepAllElements: expect.any(Object),
        subStepElement: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 2 - header',
      });

      // funnelSubStepStart - Expandable Section 1
      expect(funnelLog[6].props).toEqual({
        stepNameSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'expandable-section-1',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Expandable Section 1 - Header',
        subStepNumber: 3,
      });

      expect(funnelLog[6].resolvedProps).toEqual({
        subStepAllElements: expect.any(Object),
        subStepElement: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Expandable Section 1 - Header',
      });
    })
  );

  test(
    'Form submission',
    setupTest(async page => {
      await page.click('[data-testid=submit]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart',
        'funnelComplete',
        'funnelSuccessful',
        'funnelStepComplete', // TODO: This is how it is currently. It should probably be triggered before funnelComplete
      ]);

      const [, , funnelCompleteEvent, funnelSuccessfulEvent, funnelStepCompleteEvent] = funnelLog;
      expect(funnelCompleteEvent.props).toEqual({
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });
      expect(funnelSuccessfulEvent.props).toEqual({
        funnelIdentifier: FUNNEL_IDENTIFIER,
        funnelInteractionId: FUNNEL_INTERACTION_ID,
      });

      expect(funnelStepCompleteEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        stepName: 'Form Header',
        stepNumber: 1,
        totalSubSteps: 3,
      });
      expect(funnelStepCompleteEvent.resolvedProps).toEqual({
        stepName: 'Form Header',
      });
    })
  );

  test(
    'Form cancelled',
    setupTest(async page => {
      await page.click('[data-testid=cancel]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelCancelled']);

      const funnelCancelledEvent = funnelLog[2];
      expect(funnelCancelledEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
      });
    })
  );

  test(
    'Form abandoned',
    setupTest(async page => {
      await page.click('[data-testid=unmount]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelCancelled']);

      const [, , funnelCancelledEvent] = funnelLog;
      expect(funnelCancelledEvent.props).toEqual({
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
      });
    })
  );

  test(
    'Form inline error',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.setValue(wrapper.findInput('[data-testid=field1]').findNativeInput().toSelector(), 'error');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelSubStepStart', 'funnelSubStepError']); // FIXME: Missing funnelStepError?

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
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-1',
        stepName: 'Form Header',
        stepNumber: 1,
        subStepName: 'Container 1 - header',
        errorContext: {
          errorCategory: 'INPUT_VALIDATION',
          errorSubCategory: 'ACCESS_CONTROL_ISSUES',
          errorMessage: 'Trigger error',
        },
        fieldIdentifier: 'field1',
      });

      expect(funnelSubStepErrorEvent.resolvedProps).toEqual({
        fieldLabel: 'This is an ordinary text field',
        fieldError: 'Trigger error',
        stepName: 'Form Header',
        subStepName: 'Container 1 - header',
      });
    })
  );

  test(
    'Form error',
    setupTest(async page => {
      await page.click('[data-testid=field1]');
      await page.setValue(wrapper.findInput('[data-testid=field1]').findNativeInput().toSelector(), 'error');
      await page.click('[data-testid=submit]');

      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual([
        'funnelStart',
        'funnelStepStart',
        'funnelSubStepStart',
        'funnelSubStepError',
        'funnelSubStepError',
        'funnelStepError',
        'funnelSubStepComplete',
      ]);
      const funnelErrorEvent = funnelLog[5];
      expect(funnelErrorEvent.props).toEqual(
        expect.objectContaining({
          funnelInteractionId: FUNNEL_INTERACTION_ID,
          funnelIdentifier: FUNNEL_IDENTIFIER,
          stepIdentifier: 'single-page-demo',
          stepName: 'Form Header',
          subStepAllSelector: '[data-analytics-funnel-substep]',
          totalSubSteps: 3,
        })
      );
    })
  );

  test(
    'Form external link',
    setupTest(async page => {
      await page.click('[data-testid=external-link]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions.includes('externalLinkInteracted')).toBe(true);

      const [, , externalLinkInteractedEvent] = funnelLog;
      expect(externalLinkInteractedEvent.props).toEqual({
        elementSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-1',
        stepName: 'Form Header',
        subStepName: 'Container 1 - header',
        stepNumber: 1,
      });
      expect(externalLinkInteractedEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        element: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 1 - header',
      });
    })
  );

  test(
    'Form help panel link',
    setupTest(async page => {
      await page.click('[data-testid=info-link]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions.includes('helpPanelInteracted')).toBe(true);

      const [, , helpPanelInteractedEvent] = funnelLog;
      expect(helpPanelInteractedEvent.props).toEqual({
        elementSelector: expect.any(String),
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        subStepNameSelector: expect.any(String),
        subStepSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        funnelIdentifier: FUNNEL_IDENTIFIER,
        stepIdentifier: STEP_IDENTIFIER,
        subStepIdentifier: 'container-2',
        stepName: 'Form Header',
        subStepName: 'Container 2 - header',
        stepNumber: 1,
      });
      expect(helpPanelInteractedEvent.resolvedProps).toEqual({
        subStepElement: expect.any(Object),
        subStepAllElements: expect.any(Object),
        element: expect.any(Object),
        stepName: 'Form Header',
        subStepName: 'Container 2 - header',
      });
    })
  );

  test(
    'Opening a modal based component does not end the substep',
    setupTest(async page => {
      const s3ResourceSelectorWrapper = wrapper.findS3ResourceSelector();
      await page.click(s3ResourceSelectorWrapper.findInContext().findUriInput().toSelector());
      await page.click(s3ResourceSelectorWrapper.findInContext().findBrowseButton().toSelector());
      await page.click(s3ResourceSelectorWrapper.findTable().findTextFilter().toSelector());
      await page.click(s3ResourceSelectorWrapper.findModal().findDismissButton().toSelector());
      const { actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelSubStepStart']);
    })
  );

  test.skip(
    'Forms embedded in Modal unrelated to the main Form',
    setupTest(async page => {
      await page.click('[data-testid=embedded-form-modal]');
      const { funnelLog, actions } = await page.getFunnelLog();
      expect(actions).toEqual(['funnelStart', 'funnelStepStart', 'funnelStart', 'funnelStepStart']);
      const [, , funnelStartEvent, funnelStepStartEvent] = funnelLog; // First two events are the main Form Funnel
      expect(funnelStartEvent.props).toEqual({
        componentVersion: expect.any(String),
        funnelNameSelector: expect.any(String),
        funnelVersion: expect.any(String),
        funnelType: 'single-page',
        optionalStepNumbers: [],
        componentTheme: 'default',
        totalFunnelSteps: 1,
        stepConfiguration: [
          {
            name: 'Modal title',
            isOptional: false,
            number: 1,
          },
        ],
      });
      expect(funnelStartEvent.resolvedProps).toEqual({
        funnelName: 'Modal title',
      });

      expect(funnelStepStartEvent.props).toEqual({
        stepNameSelector: expect.any(String),
        subStepAllSelector: expect.any(String),
        funnelInteractionId: FUNNEL_INTERACTION_ID,
        stepName: 'Modal title',
        subStepConfiguration: [], // FIXME: This does not return the correct value
        stepNumber: 1,
        totalSubSteps: 0,
      });
    })
  );
});
