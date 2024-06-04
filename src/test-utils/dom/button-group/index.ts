// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../button-group/styles.selectors.js';
import tooltipStyles from '../../../button-group/tooltip/styles.selectors.js';
import ButtonDropdownWrapper from '../button-dropdown/index.js';
import ButtonWrapper from '../button/index.js';
import createWrapper from '../index.js';

export default class ButtonGroupWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Finds an item button by its id. If an item is inside the show-more dropdown the
   * dropdown needs to be open first. Returns null if there is no matching item or the item
   * is inside a closed dropdown.
   *
   * This utility does not open the show-more dropdown. To find the dropdown items, call `openDropdown()` first.
   */
  findInlineItemById(id: string): null | ElementWrapper {
    const inlineItemSelector = `.${styles['inline-button']}[data-testid="${id}"]`;
    return this.find(inlineItemSelector);
  }

  /**
   * Finds all inline items. Returns empty array if no items are defined or all items are inside the show-more dropdown.
   */
  findInlineItems(): Array<ButtonWrapper> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.findAllByClassName(styles['inline-button']).map(item => new ButtonWrapper(item.getElement()));
  }

  findShowMoreButton(): null | ButtonDropdownWrapper {
    const menuWrapper = this.findByClassName(styles['more-button']);
    return menuWrapper && new ButtonDropdownWrapper(menuWrapper.getElement());
  }

  findTooltip(): null | ElementWrapper {
    return createWrapper().findByClassName(tooltipStyles.body);
  }

  findActionPopover(): null | ElementWrapper {
    return createWrapper().findByClassName(tooltipStyles.body);
  }
}
