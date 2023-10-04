// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from 'react-dom/test-utils';
import { ComponentWrapper, ElementWrapper, usesDom, createWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../button-dropdown/styles.selectors.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.selectors.js';
import itemStyles from '../../../button-dropdown/item-element/styles.selectors.js';
import categoryStyles from '../../../button-dropdown/category-elements/styles.selectors.js';
import buttonStyles from '../../../button/styles.selectors.js';
import ButtonWrapper from '../button/index.js';

export default class ButtonDropdownWrapper extends ComponentWrapper {
  static rootSelector: string = styles['button-dropdown'];

  findNativeButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName(styles['dropdown-trigger'])!.findByClassName<HTMLButtonElement>(
      styles['test-utils-button-trigger']
    )!;
  }

  findMainAction(): null | ButtonWrapper {
    return (
      this.findByClassName(styles['split-trigger'])?.findComponent(`.${buttonStyles.button}`, ButtonWrapper) ?? null
    );
  }

  findOpenDropdown(): ElementWrapper | null {
    return createWrapper().find(`.${dropdownStyles.dropdown}[data-open=true]`);
  }

  /**
   * Finds an item in the open dropdown by item id. Returns null if there is no open dropdown.
   *
   * This utility does not open the dropdown. To find dropdown items, call `openDropdown()` first.
   */
  findItemById(id: string): ElementWrapper | null {
    const itemSelector = `.${itemStyles['item-element']}[data-testid="${id}"]`;
    return this.findOpenDropdown()?.find(itemSelector) || this.find(itemSelector);
  }

  /**
   * Finds an expandable category in the open dropdown by category id. Returns null if there is no open dropdown.
   *
   * This utility does not open the dropdown. To find dropdown items, call `openDropdown()` first.
   */
  findExpandableCategoryById(id: string): ElementWrapper | null {
    const expandableCategorySelector = `.${categoryStyles.expandable}[data-testid="${id}"]`;
    return this.findOpenDropdown()?.find(expandableCategorySelector) || this.find(expandableCategorySelector);
  }

  /**
   * Finds the highlighted item in the open dropdown. Returns null if there is no open dropdown.
   *
   * This utility does not open the dropdown. To find dropdown items, call `openDropdown()` first.
   */
  findHighlightedItem(): ElementWrapper | null {
    const highlightedItemSelector = `.${itemStyles['item-element']}.${itemStyles.highlighted}`;
    return this.findOpenDropdown()?.find(highlightedItemSelector) || this.find(highlightedItemSelector);
  }

  /**
   * Finds all the items in the open dropdown. Returns empty array if there is no open dropdown.
   *
   * This utility does not open the dropdown. To find dropdown items, call `openDropdown()` first.
   */
  findItems(): Array<ElementWrapper> {
    return this.findOpenDropdown()?.findAll(`.${itemStyles['item-element']}`) || [];
  }

  /**
   * Finds the disabled reason tooltip. Returns null if no disabled item with `disabledReason` is highlighted.
   */
  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`[data-testid="button-dropdown-disabled-reason"]`);
  }

  @usesDom
  openDropdown(): void {
    act(() => {
      this.findNativeButton().click();
    });
  }
}
