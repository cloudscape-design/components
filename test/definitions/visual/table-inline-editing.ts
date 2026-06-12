// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table inline editing',
  componentName: 'table-inline-editing',
  tests: [
    {
      description: 'permutations',
      path: 'table/inline-editor.permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'active select editing',
      path: 'table/editable',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.click('[aria-label="Edit EKXAM4L45YPC8 TLS Version"]');
      },
    },
    {
      description: 'active select editing with open dropdown',
      path: 'table/editable',
      screenshotType: 'screenshotArea',
      setup: async (page, wrapper) => {
        await page.click('[aria-label="Edit EKXAM4L45YPC8 TLS Version"]');
        await page.click(wrapper.findSelect().findTrigger().toSelector());
      },
    },
    {
      description: 'hovering over cell, resizableColumns=${resizableColumns}',
      path: 'table/editable',
      screenshotType: 'screenshotArea',
      setup: async page => {
        await page.hoverElement('[aria-label="Edit EKXAM4L45YPC8 Domain name"]');
      },
    },
    {
      description: 'active select editing with keyboard navigation',
      path: 'table/editable',
      screenshotType: 'screenshotArea',
      configuration: { width: 1600 },
      queryParams: { enableKeyboardNavigation: 'true' },
      setup: async page => {
        await page.click('[data-testid="focus"]');
        await page.keys(['Tab', 'ArrowDown', 'ArrowRight', 'Enter']);
      },
    },
  ],
};

export default suite;
