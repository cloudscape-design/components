// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { Browser } from 'webdriverio';

import type createWrapper from '../../lib/components/test-utils/selectors';
import type VisualTestPageObject from './page-object';

export type Wrapper = ReturnType<typeof createWrapper>;

export interface ScreenshotTestConfiguration {
  width?: number;
  height?: number;
}

// 'screenshotArea' — captures the .screenshot-area element on the page.
// 'permutations'  — captures the entire page and crops permutations out of it.
export type ScreenshotType = 'screenshotArea' | 'permutations' | 'viewport';

export interface SetupConfiguration {
  direction?: 'ltr' | 'rtl';
}

export interface TestDefinition {
  description: string;
  path: string;
  screenshotType: ScreenshotType;
  queryParams?: Record<string, string>;
  configuration?: ScreenshotTestConfiguration;
  pixelDiffTolerance?: number;
  setup?: (context: {
    page: VisualTestPageObject;
    wrapper: Wrapper;
    browser?: Browser;
    configuration?: SetupConfiguration;
  }) => void;
}

export interface TestSuite {
  componentName?: string;
  description: string;
  tests: Array<TestDefinition | TestSuite>;
}
