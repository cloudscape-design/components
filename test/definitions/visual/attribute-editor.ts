// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Attribute Editor',
  componentName: 'attribute-editor',
  tests: [360, 768, 992].flatMap(width => [
    {
      description: `permutations at ${width}px`,
      path: 'attribute-editor/permutations',
      screenshotType: 'permutations' as const,
      configuration: { width },
    },
    {
      description: `customizable-footer at ${width}px`,
      path: 'attribute-editor/customizable-footer',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
    },
    {
      description: `with long select at ${width}px`,
      path: 'attribute-editor/select-with-long-value',
      screenshotType: 'screenshotArea' as const,
      configuration: { width },
    },
  ]),
};

export default suite;
