// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from './types';
export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';
import actionCard from './visual/action-card';
import alert from './visual/alert';

export const allSuites: TestSuite[] = [actionCard, alert];
