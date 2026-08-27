// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/selectors';
import { TestDefinition, TestSuite } from '../types';

const alignments = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const expandToViewportOptions = [true, false];
const pages = ['expandable', 'expandable-iframe'];

const suite: TestSuite = {
  // Registered under the `dropdown` component name so it only runs when testing
  // the latest components (matches the original `conditionalDescribe(isTestingOnlyLatestComponents)`).
  componentName: 'dropdown',
  description: 'Dropdown and trigger element alignment',
  tests: expandToViewportOptions.map<TestSuite>(expandToViewport => ({
    description: `expandToViewport=${expandToViewport}`,
    tests: pages.map<TestSuite>(pageName => ({
      description: pageName,
      tests: alignments.map<TestDefinition>(alignment => ({
        description: alignment,
        path: `dropdown/${pageName}`,
        screenshotType: 'screenshotArea',
        queryParams: { expandToViewport: `${expandToViewport}` },
        setup: async ({ page }) => {
          const autosuggest = createWrapper().findAutosuggest(`#${alignment}`);
          const inputSelector = autosuggest.findNativeInput().toSelector();
          const dropdownSelector = autosuggest.findDropdown().toSelector();
          await page.runInsideIframe('#expandable-dropdowns-iframe', pageName === 'expandable-iframe', async () => {
            await page.waitForVisible(inputSelector);
            await page.click(inputSelector);
            await page.waitForVisible(dropdownSelector);
          });
        },
      })),
    })),
  })),
};

export default suite;
