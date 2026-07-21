// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';
import { responsiveTests } from './app-layout-responsive-tests';

const suite: TestSuite = {
  description: 'Responsive',
  componentName: 'app-layout',
  tests: [600, 1280, 1400, 1920, 2540].map(width => responsiveTests(width)),
};

export default suite;
