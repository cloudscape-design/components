// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Visual contexts',
  componentName: 'visual-contexts',
  tests: [
    {
      description: 'content header',
      path: 'visual-contexts/content-header',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'flashbar',
      path: 'visual-contexts/flashbar',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'top navigation',
      path: 'visual-contexts/top-navigation',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
