// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ElementWrapper } from '@cloudscape-design/test-utils-core/selectors';

import VisualTestPageObject from '../page-object';
import { TestSuite } from '../types';

async function focusFirstMonth(page: VisualTestPageObject, wrapper: ElementWrapper) {
  await page.click(wrapper.findDatePicker().findOpenCalendarButton().toSelector());
  await page.keys(['Tab', 'Tab', 'Tab']);
}

const suite: TestSuite = {
  description: 'Date picker',
  componentName: 'date-picker',
  tests: [
    {
      description: 'Permutations: states',
      path: 'date-picker/permutations',
      screenshotType: 'permutations',
      setup: async ({ page }) => {
        await page.click('[data-testid="date-picker-expanded-example"] button');
      },
    },
    {
      description: 'Permutations: formats',
      path: 'date-picker/permutations-formats',
      screenshotType: 'permutations',
    },
    {
      description: 'Month picker',
      tests: [
        {
          description: 'focus ring on selected month',
          path: 'date-picker/month-picker',
          screenshotType: 'screenshotArea',
          setup: async ({ page, wrapper }) => {
            await focusFirstMonth(page, wrapper);
          },
        },
        {
          description: 'focus ring on current month',
          path: 'date-picker/month-picker',
          screenshotType: 'screenshotArea',
          setup: async ({ page, wrapper }) => {
            await focusFirstMonth(page, wrapper);
            await page.keys(['ArrowRight']);
          },
        },
        {
          description: 'focus ring on non selected, non current month',
          path: 'date-picker/month-picker',
          screenshotType: 'screenshotArea',
          setup: async ({ page, wrapper }) => {
            await focusFirstMonth(page, wrapper);
            await page.keys(['ArrowRight', 'ArrowRight']);
          },
        },
      ],
    },
  ],
};

export default suite;
