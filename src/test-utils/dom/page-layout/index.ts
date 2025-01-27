// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AppLayoutWrapper from '../app-layout';

import testutilStyles from '../../../app-layout/test-classes/styles.selectors.js';

export default class PageLayoutWrapper extends AppLayoutWrapper {
  static rootSelector = testutilStyles.root;
}
