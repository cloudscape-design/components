// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'TextContainer',
  componentName: 'text-content',
  tests: [
    {
      description: 'color property',
      path: 'text-content/permutations',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with nested Link components',
      path: 'text-content/link-nesting',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with nested Box components',
      path: 'text-content/box-nesting',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with icons in content',
      path: 'text-content/iconography',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
