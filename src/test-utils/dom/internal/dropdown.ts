// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../dropdown/styles.selectors.js';
import testUtilStyles from '../../../dropdown/test-classes/styles.selectors.js';

export default class DropdownWrapper extends ElementWrapper {
  static rootSelector: string = styles.root;

  findTrigger(): ElementWrapper {
    return this.findByClassName(testUtilStyles.trigger)!;
  }

  findOpenDropdown(): ElementWrapper | null {
    return this.find(`.${styles.dropdown}[data-open=true]`);
  }
}
