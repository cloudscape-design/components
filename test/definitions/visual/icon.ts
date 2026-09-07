// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestDefinition, TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Icon',
  componentName: 'icon',
  tests: [
    {
      description: 'Alignment with text',
      path: 'icon/text-align',
      screenshotType: 'screenshotArea',
      configuration: { width: 300 },
    },
    ...['normal', 'disabled', 'error', 'inverted', 'subtle', 'success', 'warning'].map<TestDefinition>(variant => ({
      description: `Icons in ${variant} variant`,
      path: `icon/variant-${variant}`,
      screenshotType: 'screenshotArea',
    })),
    {
      description: 'Custom icon',
      path: 'icon/custom-icon',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Custom svg icon',
      path: 'icon/custom-svg',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Inherit size property',
      path: 'icon/size-inherit',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
