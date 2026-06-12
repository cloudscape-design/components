// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Wizard',
  componentName: 'wizard',
  tests: [
    {
      description: 'first step',
      path: 'wizard/wizard-screenshot',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'second step',
      path: 'wizard/wizard-screenshot',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('#next');
      },
    },
    {
      description: 'steps menu expanded in mobile view',
      path: 'wizard/wizard-screenshot',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[role="button"][aria-expanded]');
      },
    },
  ],
};

export default suite;
