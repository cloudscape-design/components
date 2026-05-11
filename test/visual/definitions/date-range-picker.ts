// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'date-range-picker',
  tests: [
    {
      description: 'with value',
      path: 'date-range-picker/with-value',
    },
    {
      description: 'range calendar',
      path: 'date-range-picker/range-calendar',
    },
    {
      description: 'month calendar permutations',
      path: 'date-range-picker/month-calendar-permutations',
    },
    {
      description: 'year calendar permutations',
      path: 'date-range-picker/year-calendar-permutations',
    },
    {
      description: 'in small viewport',
      path: 'date-range-picker/small-viewport',
      configuration: { width: 400 },
    },
    {
      description: 'with dropdown open',
      path: 'date-range-picker/with-value',
      setup: async page => {
        await page.click('[data-testid="date-range-picker-trigger"]');
        await page.waitForVisible('.awsui-context-content-header');
      },
    },
  ],
};

export default suite;
