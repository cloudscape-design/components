// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ScreenshotPageObject } from '@cloudscape-design/browser-test-tools/page-objects';

export interface ScreenshotTestConfiguration {
  width?: number;
  height?: number;
}

export type TestCallback = (page: ScreenshotPageObject) => Promise<void>;

export interface TestDefinition {
  description: string;
  path: string;
  queryParams?: Record<string, string>;
  configuration?: ScreenshotTestConfiguration;
  setup?: TestCallback;
}

export interface TestSuite {
  description: string;
  tests: Array<TestDefinition | TestSuite>;
}
