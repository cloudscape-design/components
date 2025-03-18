// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import {
  FunnelEvent,
  FunnelEventDetails,
  FunnelEventName,
  FunnelMetadata,
  StepMetadata,
  SubstepMetadata,
} from '../../../../../lib/components/internal/analytics/funnel/types';
import { FunnelTestAPI } from '../../../../../lib/components/internal/analytics/funnel/types/test-api';
import createWrapper from '../../../../../lib/components/test-utils/selectors';

type EventAssertion = (event: FunnelEvent, index: number) => void;
type EventAssertions = Partial<Record<FunnelEventName, EventAssertion | EventAssertion[]>>;
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

  async getEventsByName(name: string) {
    const funnelEventsByName = await this.browser.execute(
      nameArg => window.__funnelTestAPI?.getEventsByName(nameArg),
      name
    );
    return funnelEventsByName || [];
  }

  async waitForFunnelEvent(name: string, timeout = 5000) {
    await this.browser.waitUntil(
      async () => {
        const events = await this.getEventsByName(name);
        return events.length > 0;
      },
      {
        timeout,
        timeoutMsg: `Expected funnel event ${name} was not emitted within ${timeout}ms`,
      }
    );
  }

  // Helper methods for common test scenarios
  async getFunnelEventByAction(name: string) {
    const events = await this.getEventsByName(name);
    return events[events.length - 1];
  }

  async assertFunnelSequence(expectedEvents: FunnelEventName[], eventAssertions: EventAssertions = {}) {
    const events = await this.getFunnelEvents();
    const actualEvents = events.map(e => e.name);
    expect(actualEvents).toEqual(expectedEvents);

    const eventOccurances: Partial<Record<FunnelEventName, number>> = {};
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const assertion = eventAssertions[event.name];

      if (assertion) {
        eventOccurances[event.name] = (eventOccurances[event.name] || 0) + 1;
        const occurrenceIndex = eventOccurances[event.name]! - 1;

        if (Array.isArray(assertion)) {
          assertion[occurrenceIndex]?.(event, occurrenceIndex);
        } else {
          assertion(event, occurrenceIndex);
        }
      }
    }
  }

  async assertLastEvent(
    expectedName: FunnelEventName,
    expectedMetadata: Partial<FunnelEvent['metadata']>,
    expectedDetails?: Partial<FunnelEvent['details']>
  ) {
    const lastEvent = await this.getLastFunnelEvent();
    expect(lastEvent?.name).toEqual(expectedName);
    expect(lastEvent?.metadata).toMatchObject(expectedMetadata);
    if (expectedDetails) {
      expect(lastEvent?.details).toMatchObject(expectedDetails);
    }
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
          'funnel:start',
          'funnel:step:start',
          'funnel:step:complete',
          'funnel:submitted',
          'funnel:validating',
          'funnel:validated',
          'funnel:complete',
        ],
        {
          'funnel:start': event => {
            expect(event.metadata).toEqual(
              expect.objectContaining({
                funnelId: expect.any(String),
                funnelType: 'single-page',
                funnelName: 'Create component',
                totalSteps: 1,
                optionalStepNumbers: [],
                stepConfiguration: [{ isOptional: false, name: 'Create component', number: 1 }],
                // User provided metadata
                flowType: 'create',
                resourceType: '',
                instanceIdentifier: 'my-custom-creation',
              } satisfies FunnelMetadata)
            );
          },
          'funnel:submitted': event => {
            expect(event.metadata).toEqual(
              expect.objectContaining({
                funnelId: expect.any(String),
              } satisfies Partial<FunnelMetadata>)
            );
          },
          'funnel:complete': event => {
            expect(event.metadata).toEqual(
              expect.objectContaining({
                funnelId: expect.any(String),
                funnelResult: 'submitted',
              } satisfies FunnelMetadata)
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
        ['funnel:start', 'funnel:step:start', 'funnel:step:complete', 'funnel:complete'],
        {
          'funnel:complete': event => {
            expect(event.metadata).toEqual(
              expect.objectContaining({
                funnelId: expect.any(String),
                funnelResult: 'cancelled',
              } satisfies FunnelMetadata)
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
        ['funnel:start', 'funnel:step:start', 'funnel:step:complete', 'funnel:complete'],
        {
          'funnel:complete': event => {
            expect(event.metadata).toEqual(
              expect.objectContaining({
                funnelId: expect.any(String),
                funnelResult: 'cancelled',
              } satisfies FunnelMetadata)
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
        'funnel:start',
        'funnel:step:start',
        'funnel:substep:start',
        'funnel:substep:complete',
        'funnel:substep:start',
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

      await page.assertFunnelSequence(['funnel:start', 'funnel:step:start', 'funnel:substep:start']);
    })
  );

  test(
    'tracks form field validation',
    setupTest(async page => {
      await page.enterFieldValue('section-1-field-1', 'error');
      await page.assertLastEvent(
        'funnel:substep:error',
        expect.objectContaining({
          name: 'Section 1',
          index: 0,
        } satisfies SubstepMetadata),
        expect.objectContaining({
          error: {
            message: 'This is an error message',
            label: 'Field 1',
            source: 'form-field',
          },
        } satisfies FunnelEventDetails)
      );

      await page.enterFieldValue('section-1-field-1', '-cleared');
      await page.assertLastEvent(
        'funnel:substep:error-cleared',
        expect.objectContaining({
          name: 'Section 1',
          index: 0,
        })
      );
    })
  );

  test(
    'tracks form errors',
    setupTest(async page => {
      await page.click(wrapper.findButton('[data-testid=submit-with-error-button]').toSelector());
      await page.assertLastEvent(
        'funnel:error',
        expect.objectContaining({
          funnelId: expect.any(String),
        } satisfies FunnelMetadata),
        expect.objectContaining({
          error: {
            source: 'form',
            message: 'There was an error with your submission',
          },
        } satisfies FunnelEventDetails)
      );
    })
  );

  test(
    'tracks when contextual alert errors in steps',
    setupTest(async page => {
      await page.click(wrapper.findButton('[data-testid=toggle-step-error-button]').toSelector());
      await page.assertLastEvent(
        'funnel:step:error',
        expect.objectContaining({
          index: 0,
          name: 'Create component',
          isOptional: false,
          totalSubsteps: 5,
          // Custom analytics metadata
          instanceIdentifier: 'my-custom-creation',
        } satisfies StepMetadata),
        expect.objectContaining({
          error: {
            message: 'This is a step error',
            source: 'alert',
          },
        } satisfies FunnelEventDetails)
      );
    })
  );

  test(
    'tracks when contextual alert errors in substeps',
    setupTest(async page => {
      await page.click(wrapper.find('[data-testid=section-1-field-1] input').toSelector());
      await page.click(wrapper.findButton('[data-testid=toggle-substep-error-button]').toSelector());
      console.log(await page.getFunnelEvents());
      await page.assertLastEvent(
        'funnel:substep:error',
        expect.objectContaining({
          scope: 'funnel-substep',
          errorText: 'This is a substep error',
          subStepIndex: 0,
          subStepName: 'Section 1',
        })
      );
    })
  );

  test(
    'tracks when  an error is displayed via a flashbar',
    setupTest(async () => {})
  );

  test(
    'tracks nested modal funnels separately',
    setupTest(async page => {
      await page.assertFunnelSequence(['funnel:start', 'funnel:step:start']);
      await page.openFeedbackModal();

      await page.assertFunnelSequence(
        [
          'funnel:start', // Form funnel started
          'funnel:step:start', // Form funnel step started
          'funnel:start', // Modal funnel started
          'funnel:step:start', // Modal funnel step started
        ],
        {
          'funnel:start': [
            event => {
              expect(event.metadata).toEqual(
                expect.objectContaining({
                  funnelType: 'single-page',
                  funnelName: 'Create component',
                })
              );
            },
            event => {
              expect(event.metadata).toEqual(
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

  test(
    'tracks interactions with info links in headers',
    setupTest(async () => {})
  );

  test(
    'tracks interactions with info links in form fields',
    setupTest(async () => {})
  );

  test(
    'tracks interactions with external links',
    setupTest(async () => {})
  );

  test(
    'tracks funnel configuration changes when substeps are added and removed',
    setupTest(async () => {})
  );
});
