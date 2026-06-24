// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'TagEditor',
  componentName: 'tag-editor',
  tests: [
    {
      description: 'Permutations',
      path: 'tag-editor/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
