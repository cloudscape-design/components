// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../navigable-group/test-classes/styles.selectors.js';

export default class NavigableGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  findContent() {
    return new ElementWrapper(this.getElement());
  }
}
