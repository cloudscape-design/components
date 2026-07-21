// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Box',
  componentName: 'box',
  tests: [
    {
      description: 'variants permutations',
      path: 'box/variants',
      screenshotType: 'permutations',
    },
    {
      description: 'margins permutations',
      path: 'box/margins',
      screenshotType: 'permutations',
    },
    {
      description: 'paddings permutations',
      path: 'box/paddings',
      screenshotType: 'permutations',
    },
    {
      description: 'float and textAlign',
      path: 'box/float-align',
      screenshotType: 'permutations',
    },
    {
      description: 'with overrides to layout defaults',
      path: 'box/elements-with-extra-defaults',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'with icons in content',
      path: 'box/iconography',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
