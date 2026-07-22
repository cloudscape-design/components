// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Toolbar',
  componentName: 'app-layout',
  tests: [
    {
      description: 'multiple nested instances (no breadcrumbs dedup)',
      path: 'app-layout-toolbar/multi-layout-with-hidden-instances',
      screenshotType: 'viewport',
    },
    {
      description: 'no toolbar',
      path: 'app-layout-toolbar/without-toolbar',
      screenshotType: 'viewport',
    },
  ],
};

export default suite;
