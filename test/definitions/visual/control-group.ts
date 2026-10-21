// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Control group',
  componentName: 'control-group',
  tests: [
    {
      description: 'Permutations',
      path: 'control-group/permutations',
      screenshotType: 'permutations',
    },
    {
      description: 'Permutations (direction: vertical)',
      path: 'control-group/permutations',
      screenshotType: 'permutations',
      queryParams: { controlGroupDirection: 'vertical' },
    },
    {
      description: 'Action button',
      path: 'control-group/action-button',
      screenshotType: 'permutations',
    },
    {
      description: 'Action button (direction: vertical)',
      path: 'control-group/action-button',
      screenshotType: 'permutations',
      queryParams: { controlGroupDirection: 'vertical' },
    },
  ],
};

export default suite;
