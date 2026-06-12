// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

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
    {
      description: 'Icons in normal variant',
      path: 'icon/variant-normal',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in disabled variant',
      path: 'icon/variant-disabled',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in error variant',
      path: 'icon/variant-error',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in inverted variant',
      path: 'icon/variant-inverted',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in subtle variant',
      path: 'icon/variant-subtle',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in success variant',
      path: 'icon/variant-success',
      screenshotType: 'screenshotArea',
    },
    {
      description: 'Icons in warning variant',
      path: 'icon/variant-warning',
      screenshotType: 'screenshotArea',
    },
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
