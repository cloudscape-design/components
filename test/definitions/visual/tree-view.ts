// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Tree view',
  componentName: 'tree-view',
  tests: [
    ...[
      { expandAll: 'false', showConnectorLines: 'false' },
      { expandAll: 'false', showConnectorLines: 'true' },
      { expandAll: 'true', showConnectorLines: 'false' },
      { expandAll: 'true', showConnectorLines: 'true' },
    ].map<TestDefinition>(urlParams => ({
      description: `permutations - ${urlParams.expandAll === 'true' ? 'expanded' : 'collapsed'}${
        urlParams.showConnectorLines === 'true' ? ' with connector lines' : ''
      }`,
      path: 'tree-view/permutations',
      screenshotType: 'screenshotArea',
      configuration: { width: 700 },
      queryParams: urlParams,
    })),
    {
      description: 'basic',
      path: 'tree-view/basic',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with different toggle icon',
      path: 'tree-view/basic',
      screenshotType: 'screenshotArea',
      setup: async ({ page, wrapper }) => {
        const select = wrapper.findSelect();
        await page.click(select.findTrigger().toSelector());
        await page.click(select.findDropdown().findOptionByValue('custom').toSelector());
      },
    },
  ],
};

export default suite;
