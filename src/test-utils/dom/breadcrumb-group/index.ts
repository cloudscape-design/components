// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonDropdownWrapper from '../button-dropdown';

import itemStyles from '../../../breadcrumb-group/item/styles.selectors.js';
import styles from '../../../breadcrumb-group/styles.selectors.js';
import buttonDropdownStyles from '../../../button-dropdown/styles.selectors.js';

export default class BreadcrumbGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles['breadcrumb-group'];
  /**
   * Returns all breadcrumb items. Note that this includes the 'current' page item for backwards compatibility,
   * even though it is not technically a link.
   *
   * To find a specific item use the `findBreadcrumbLink(n)` function as chaining `findBreadcrumbLinks().get(n)` can return unexpected results.
   * @see findBreadcrumbLink
   */
  findBreadcrumbLinks(): Array<ElementWrapper> {
    return this.findAll(`.${itemStyles.breadcrumb} .${itemStyles.anchor}`);
  }
  /**
   * Returns an item for a given index. Note that this may return the 'current' page item for backwards compatibility,
   * even though it is not technically a link.
   *
   * @param index 1-based item index
   */
  findBreadcrumbLink(index: number): ElementWrapper | null {
    // We insert the breadcrumb-ellipsis as the second element so we have to filter it out.
    // Unfortunately, there is no efficient CSS selector for it in CSS Selectors-3 spec.
    // In the future we can use li:nth-child(n of .awsui-breadcrumb-item) when Selectors-4 spec is supported https://caniuse.com/#feat=css-nth-child-of
    if (index > 1) {
      index++;
    }
    return this.find(`.${styles.item}:nth-child(${index}) .${itemStyles.anchor}`);
  }

  findDropdown(): ButtonDropdownWrapper | null {
    const buttonDropdown = this.find(`.${buttonDropdownStyles['button-dropdown']}`);
    return buttonDropdown && new ButtonDropdownWrapper(buttonDropdown.getElement());
  }
}
