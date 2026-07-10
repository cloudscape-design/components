// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Browser } from 'webdriverio';

import type { ScreenshotBasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import type createWrapper from '../../lib/components/test-utils/selectors';

export type Wrapper = ReturnType<typeof createWrapper>;

export interface ScreenshotTestConfiguration {
  width?: number;
  height?: number;
}

// 'screenshotArea' — captures the .screenshot-area element on the page.
// 'permutations'  — captures the entire page and crops permutations out of it.
export type ScreenshotType = 'screenshotArea' | 'permutations' | 'viewport';

export interface TestDefinition {
  description: string;
  path: string;
  screenshotType: ScreenshotType;
  queryParams?: Record<string, string>;
  configuration?: ScreenshotTestConfiguration;
  setup?: ({ page, wrapper, browser }: { page: ScreenshotBasePageObject; wrapper: Wrapper; browser?: Browser }) => void;
}

export interface TestSuite {
  componentName?: string;
  description: string;
  tests: Array<TestDefinition | TestSuite>;
}
