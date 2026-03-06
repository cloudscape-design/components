// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors';
import { getUrlParams } from './utils';

const wrapper = createWrapper().findAppLayout();

const ERROR_BOUNDARY_TEST_SELECTORS = {
  'left drawer trigger': '[data-testid="break-left-drawer-trigger"]',
  breadcrumbs: '[data-testid="break-breadcrumbs"]',
  'local drawer trigger': '[data-testid="break-local-drawer-trigger"]',
  'global drawer trigger': '[data-testid="break-global-drawer-trigger"]',
  'left drawer content': '[data-testid="break-left-drawer-content"]',
  'left drawer header': '[data-testid="break-left-drawer-header"]',
  'navigation panel': '[data-testid="break-nav-panel"]',
  'local drawer content': '[data-testid="break-local-drawer-content"]',
  'global drawer content': '[data-testid="break-global-drawer-content"]',
  'bottom drawer content': '[data-testid="break-bottom-drawer-content"]',
} as const;

describe('Visual refresh toolbar only', () => {
  class PageObject extends BasePageObject {
    async getConsoleErrorLogs() {
      const total = (await this.browser.getLogs('browser')) as Array<{
        level: string;
        message: string;
        source: string;
      }>;

      return total.filter(entry => entry.level === 'SEVERE' && entry.source !== 'network').map(entry => entry.message);
    }

    async expectConsoleErrors() {
      const consoleErrors = await this.getConsoleErrorLogs();
      const errorPattern = /The above error occurred in the .+ component:/;
      const matchingErrors = consoleErrors.filter(error => errorPattern.test(error));
      expect(matchingErrors.length).toBeGreaterThan(0);
    }

    async expectContentAreaStaysFunctional() {
      await expect(this.getText(wrapper.findContentRegion().toSelector())).resolves.toContain(
        'Error boundaries in app layout slots'
      );
    }
  }
  function setupTest({ hasParentErrorBoundary = 'true' }, testFn: (page: PageObject) => Promise<void>) {
    return useBrowser(async browser => {
      const page = new PageObject(browser);

      await browser.url(
        `#/light/app-layout/with-error-boundaries?${getUrlParams('refresh-toolbar', {
          appLayoutToolbar: 'true',
          hasParentErrorBoundary,
        })}`
      );
      await page.waitForVisible(wrapper.findContentRegion().toSelector(), true);
      await testFn(page);
    });
  }

  describe('with parent error boundary', () => {
    Object.entries(ERROR_BOUNDARY_TEST_SELECTORS).forEach(([areaName, selector]) => {
      test(
        `should handle error boundary in ${areaName}`,
        setupTest({ hasParentErrorBoundary: 'true' }, async page => {
          await page.click(selector);
          await page.expectConsoleErrors();
          await page.expectContentAreaStaysFunctional();
        })
      );
    });
  });

  describe('without parent error boundary', () => {
    Object.entries(ERROR_BOUNDARY_TEST_SELECTORS).forEach(([areaName, selector]) => {
      test(
        `should handle error boundary in ${areaName}`,
        setupTest({ hasParentErrorBoundary: 'false' }, async page => {
          await page.click(selector);
          await page.expectConsoleErrors();
          await page.expectContentAreaStaysFunctional();
        })
      );
    });
  });
});
