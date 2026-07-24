// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const allVariants = ['container', 'default', 'footer', 'navigation'];
const variantsWithDescription = ['container', 'default', 'footer'];
const variantsWithInteractiveElements = ['container'];

const headerText = 'Header text';
const headerDescription = 'Header description';

function focusTest(options: Record<string, string>): TestDefinition {
  return {
    description: `focus - ${JSON.stringify(options)}`,
    path: 'expandable-section/focus',
    screenshotType: 'screenshotArea' as const,
    queryParams: options,
    setup: async ({ page }) => {
      await page.click('#focus-target');
      await page.focusNextElement();
    },
  };
}

const suite: TestSuite = {
  description: 'Expandable section',
  componentName: 'expandable-section',
  tests: [
    {
      description: 'permutations',
      path: 'expandable-section/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'container variant',
      path: 'expandable-section/container-variant.permutations',
      screenshotType: 'permutations',
    },
    // Focus tests - with only heading
    ...allVariants.map(variant => focusTest({ headerText, variant })),
    // Focus tests - with heading and description
    ...variantsWithDescription.map(variant => focusTest({ headerText, headerDescription, variant })),
    // Focus tests - with interactive elements
    ...variantsWithInteractiveElements.map(variant =>
      focusTest({ headerText, hasHeaderInfo: 'true', hasHeaderActions: 'true', variant })
    ),
    // Focus tests - with interactive elements and description
    ...variantsWithInteractiveElements.map(variant =>
      focusTest({ headerText, headerDescription, hasHeaderInfo: 'true', hasHeaderActions: 'true', variant })
    ),
    {
      description: 'stacked variant',
      path: 'expandable-section/stacked-variant.permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
