// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

function stickyTest(
  width: number,
  description: string,
  params?: Record<string, string>,
  withScroll = true
): TestDefinition {
  return {
    description,
    path: 'container/sticky-permutations',
    screenshotType: 'viewport',
    configuration: { width },
    ...(params && { queryParams: params }),
    ...(withScroll && {
      setup: async ({ page }) => {
        await page.windowScrollTo({ top: 200 });
      },
    }),
  };
}

const suite: TestSuite = {
  description: 'Container sticky permutations',
  componentName: 'container',
  tests: [1400, 600].flatMap<TestDefinition>(width => [
    stickyTest(width, `simple - at ${width}px`),
    stickyTest(width, `with notifications - at ${width}px`, { hasNotifications: 'true' }),
    stickyTest(width, `with breadcrumbs - at ${width}px`, { hasBreadcrumbs: 'true' }),
    stickyTest(width, `with an alert - at ${width}px`, { hasNotifications: 'true', hasAlert: 'true' }),
    stickyTest(
      width,
      `with an alert - at ${width}px without scroll`,
      { hasNotifications: 'true', hasAlert: 'true' },
      false
    ),
    stickyTest(width, `with high-contrast header - at ${width}px`, { hasNotifications: 'true', highContrast: 'true' }),
  ]),
};

export default suite;
