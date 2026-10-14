// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'OptionList',
  componentName: 'option-list',
  tests: [
    {
      description: 'permutations',
      path: 'option-list/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
