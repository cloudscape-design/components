// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Table root',
  componentName: 'table-root',
  tests: [
    {
      description: 'in app layout',
      path: 'table-root/in-app-layout',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
