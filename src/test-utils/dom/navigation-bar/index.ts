// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import testStyles from '../../../navigation-bar/test-classes/styles.selectors.js';

export default class NavigationBarWrapper extends ComponentWrapper {
  static rootSelector = testStyles.root;

  findContent(): ElementWrapper | null {
    return this.findByClassName(testStyles.content);
  }
}
