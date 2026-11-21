// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../table-sort-button/styles.selectors.js';

export default class TableSortButtonWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = styles.root;

  /**
   * Returns the column label.
   */
  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
  }

  /**
   * Returns the sort indicator icon, or `null` for a disabled column that isn't sorted.
   */
  findSortingIcon(): ElementWrapper | null {
    return this.findByClassName(styles['sorting-icon']);
  }

  /**
   * Returns the current sort state.
   */
  @usesDom
  getSortingState(): 'sortable' | 'ascending' | 'descending' {
    const classList = this.getElement().classList;
    if (classList.contains(styles['sorting-state-ascending'])) {
      return 'ascending';
    }
    if (classList.contains(styles['sorting-state-descending'])) {
      return 'descending';
    }
    return 'sortable';
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.disabled;
  }
}
