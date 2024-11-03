// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import { Action } from '../../../../../lib/components/internal/analytics/funnel/funnel-logger';
import { FunnelTestAPI, FunnelTestEvent } from '../../../../../lib/components/internal/analytics/funnel/test-api';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

type EventAssertion = (event: FunnelTestEvent, index: number) => void;
type EventAssertions = Partial<Record<Action, EventAssertion | EventAssertion[]>>;
interface ExtendedWindow extends Window {
  __funnelTestAPI?: FunnelTestAPI;
}

declare const window: ExtendedWindow;

const wrapper = createWrapper();

class FunnelTestingPage extends BasePageObject {
  async navigate(url: string) {
    await this.browser.url(url);
  }

  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(wrapper.findAppLayout().findContentRegion().toSelector());
  }

  async clearFunnelEvents() {
    await this.browser.execute(() => {
      window.__funnelTestAPI?.clear();
    });
  }

  async getFunnelEvents() {
    const funnelEvents = await this.browser.execute(() => window.__funnelTestAPI?.events || []);
    return funnelEvents;
  }

  async getLastFunnelEvent() {
    const lastFunnelEvent = await this.browser.execute(() => window.__funnelTestAPI?.getLastEvent());
    return lastFunnelEvent;
  }

  async getFunnelEventsByAction(action: string) {
    const funnelEventsByAction = await this.browser.execute(
      actionArg => window.__funnelTestAPI?.getEventsByAction(actionArg),
      action
    );
    return funnelEventsByAction || [];
  }

  async waitForFunnelEvent(action: string, timeout = 5000) {
    await this.browser.waitUntil(
      async () => {
        const events = await this.getFunnelEventsByAction(action);
        return events.length > 0;
      },
      {
        timeout,
        timeoutMsg: `Expected funnel event ${action} was not emitted within ${timeout}ms`,
      }
    );
  }

  // Helper methods for common test scenarios
  async getFunnelEventByAction(action: string) {
    const events = await this.getFunnelEventsByAction(action);
    return events[events.length - 1];
  }

  async assertFunnelSequence(expectedActions: Action[], eventAssertions: EventAssertions = {}) {
    const events = await this.getFunnelEvents();
    const actualActions = events.map(e => e.action);
    expect(actualActions).toEqual(expectedActions);

    const actionOccurrences: Partial<Record<Action, number>> = {};
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const action = event.action as Action;
      const assertion = eventAssertions[action];

      if (assertion) {
        actionOccurrences[action] = (actionOccurrences[action] || 0) + 1;
        const occurrenceIndex = actionOccurrences[action]! - 1;

        if (Array.isArray(assertion)) {
          assertion[occurrenceIndex]?.(event, occurrenceIndex);
        } else {
          assertion(event, occurrenceIndex);
        }
      }
    }
  }

  async assertLastEventDetails(expectedAction: string, expected: Partial<FunnelTestEvent>) {
    const lastEvent = await this.getLastFunnelEvent();
    expect(lastEvent?.action).toEqual(expectedAction);
    expect(lastEvent?.details?.metadata).toMatchObject(expected);
  }
}

class CreateFormPage extends FunnelTestingPage {
  async clickSubmitButton() {
    await this.click(wrapper.findButton('[data-testid=submit-button]').toSelector());
  }

  async clickCancelButton() {
    await this.click(wrapper.findButton('[data-testid=cancel-button]').toSelector());
  }

  async enterFieldValue(testId: string, value: string) {
    await this.click(wrapper.find(`[data-testid=${testId}] input`).toSelector());
    await this.keys(value);
  }

  async openFeedbackModal() {
    await this.click(wrapper.findButton('[data-testid=open-modal-button]').toSelector());
  }

  async submitFeedbackModal() {
    await this.click(wrapper.findButton('[data-testid=feedback-submit-button]').toSelector());
  }

  async cancelFeedbackModal() {
    await this.click(wrapper.findButton('[data-testid=feedback-cancel-button]').toSelector());
  }

  async addDynamicContainer() {
    await this.click(wrapper.findButton('[data-testid=add-dynamic-container]').toSelector());
  }

  async hideSection(sectionId: string) {
    await this.click(wrapper.findButton(`[data-testid=hide-${sectionId}]`).toSelector());
  }
}

describe('Form Page Tests', () => {
  function setupTest(testFn: (page: CreateFormPage) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new CreateFormPage(browser);
      await page.visit(`#/light/analytics/create-form`);
      await testFn(page);
    });
  }

  test(
    'tracks form submission success path',
    setupTest(async page => {
      await page.clickSubmitButton();

      await page.assertFunnelSequence(
        [
          'funnel-started',
          'funnel-step-started',
          'funnel-step-completed',
          'funnel-submitted',
          'funnel-validating',
          'funnel-validated',
          'funnel-completed',
        ],
        {
          'funnel-started': event => {
            expect(event.details?.metadata).toEqual(
              expect.objectContaining({
                funnelInteractionId: expect.any(String),
                flowType: 'create',
                funnelType: 'single-page',
                funnelName: 'Create component',
                totalFunnelSteps: 1,
                resourceType: '', // FIXME: This should come from the breadcrumb
              })
            );
          },
          'funnel-submitted': event => {
            expect(event.details?.metadata).toEqual(
              expect.objectContaining({
                funnelInteractionId: expect.any(String),
              })
            );
          },
          'funnel-completed': event => {
            expect(event.details?.metadata).toEqual(
              expect.objectContaining({
                funnelInteractionId: expect.any(String),
                funnelResult: 'submitted',
              })
            );
          },
        }
      );
    })
  );

  test(
    'tracks form cancellation by clicking cancel button',
    setupTest(async page => {
      await page.clickCancelButton();

      await page.assertFunnelSequence(
        ['funnel-started', 'funnel-step-started', 'funnel-step-completed', 'funnel-completed'],
        {
          'funnel-completed': event => {
            expect(event.details?.metadata).toEqual(
              expect.objectContaining({
                funnelInteractionId: expect.any(String),
                funnelResult: 'cancelled',
              })
            );
          },
        }
      );
    })
  );

  test(
    'tracks form abandoned by navigation',
    setupTest(async page => {
      await page.navigate(`#/light`);
      await page.assertFunnelSequence(
        ['funnel-started', 'funnel-step-started', 'funnel-step-completed', 'funnel-completed'],
        {
          'funnel-completed': event => {
            expect(event.details?.metadata).toEqual(
              expect.objectContaining({
                funnelInteractionId: expect.any(String),
                funnelResult: 'cancelled',
              })
            );
          },
        }
      );
    })
  );

  test(
    'tracks navigation between form sections',
    setupTest(async page => {
      await page.click(wrapper.find('[data-testid=section-1-field-1] input').toSelector());
      await page.click(wrapper.find('[data-testid=section-2-field-1] input').toSelector());

      await page.assertFunnelSequence([
        'funnel-started',
        'funnel-step-started',
        'funnel-substep-started',
        'funnel-substep-completed',
        'funnel-substep-started',
      ]);
    })
  );

  test(
    'maintains active substep when interacting with a modal from a substep',
    setupTest(async page => {
      const s3ResourceSelectorWrapper = wrapper.findS3ResourceSelector();
      await page.click(s3ResourceSelectorWrapper.findInContext().findUriInput().toSelector());
      await page.click(s3ResourceSelectorWrapper.findInContext().findBrowseButton().toSelector());
      await page.click(s3ResourceSelectorWrapper.findTable().findTextFilter().toSelector());
      await page.click(s3ResourceSelectorWrapper.findModal().findDismissButton().toSelector());

      // await page.assertFunnelSequence(['funnel-started', 'funnel-step-started', 'funnel-substep-started']);
    })
  );

  test(
    'tracks form field validation',
    setupTest(async page => {
      await page.enterFieldValue('section-1-field-1', 'error');
      await page.assertLastEventDetails(
        'funnel-substep-error',
        expect.objectContaining({
          fieldError: 'This is an error message',
          fieldLabel: 'Field 1',
          subStepName: 'Section 1',
          subStepIndex: 0,
        })
      );

      await page.enterFieldValue('section-1-field-1', '-cleared');
      await page.assertLastEventDetails(
        'funnel-substep-error-cleared',
        expect.objectContaining({
          fieldLabel: 'Field 1',
          subStepName: 'Section 1',
          subStepIndex: 0,
        })
      );
    })
  );

  test(
    'tracks form errors',
    setupTest(async page => {
      await page.click(wrapper.findButton('[data-testid=submit-with-error-button]').toSelector());
      await page.assertLastEventDetails(
        'funnel-error',
        expect.objectContaining({
          funnelInteractionId: expect.any(String),
          funnelError: 'There was an error with your submission',
        })
      );
    })
  );

  test(
    'tracks nested modal funnels separately',
    setupTest(async page => {
      await page.assertFunnelSequence(['funnel-started', 'funnel-step-started']);
      await page.openFeedbackModal();

      await page.assertFunnelSequence(
        [
          'funnel-started', // Form funnel started
          'funnel-step-started', // Form funnel step started
          'funnel-started', // Modal funnel started
          'funnel-step-started', // Modal funnel step started
        ],
        {
          'funnel-started': [
            event => {
              expect(event.details?.metadata).toEqual(
                expect.objectContaining({
                  funnelType: 'single-page',
                  funnelName: 'Create component',
                })
              );
            },
            event => {
              expect(event.details?.metadata).toEqual(
                expect.objectContaining({
                  funnelInteractionId: expect.any(String),
                  funnelType: 'modal',
                  funnelName: 'Feedback for Console Home',
                  totalFunnelSteps: 1,
                })
              );
            },
          ],
        }
      );
    })
  );
});
