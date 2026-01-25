// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../dropdown/styles.selectors.js';

export default class DropdownWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findOpenDropdown(): ElementWrapper | null {
    return this.find(`.${styles.dropdown}[data-open=true]`);
  }
}
