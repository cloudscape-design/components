// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'File dropzone',
  componentName: 'file-dropzone',
  tests: [
    {
      description: 'In container',
      path: 'file-dropzone/container',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
