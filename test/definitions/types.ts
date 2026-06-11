// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

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
  setup?: (page: ScreenshotPageObject) => Promise<void>;
}

export interface TestSuite {
  componentName?: string;
  description: string;
  tests: Array<TestDefinition | TestSuite>;
}
