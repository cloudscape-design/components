// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ListWrapper, { ListItemWrapper } from '../list';
import TextFilterWrapper from '../text-filter';
import ToggleWrapper from '../toggle';

import styles from '../../../collection-preferences/styles.selectors.js';

const getClassName = (suffix: string): string => styles[`content-display-${suffix}`];

export class ContentDisplayOptionWrapper extends ComponentWrapper {
  private getListItem(): ListItemWrapper {
    return new ListItemWrapper(this.getElement());
  }

  /**
   * Returns the drag handle for the option item.
   */
  findDragHandle(): ElementWrapper {
    return this.getListItem().findDragHandle()!;
  }

  /**
   * Returns the text label displayed in the option item.
   */
  findLabel(): ElementWrapper {
    return this.getListItem().findContent().findByClassName(styles['content-display-option-label'])!;
  }

  /**
   * Returns the visibility toggle for the option item.
   * Note that, despite its typings, this may return null for group items since groups do not have a visibility toggle.
   */
  findVisibilityToggle(): ToggleWrapper {
    return this.getListItem()
      .findContent()
      .findComponent(`.${styles['content-display-option-toggle']}`, ToggleWrapper)!;
  }

  /**
   * Returns all child option items nested under this item when it is a group.
   * Returns `null` when this item is a leaf column (has no nested children).
   *
   * The children are the leaf-level `ContentDisplayOptionWrapper`s inside the group's
   * nested `InternalList` — i.e. they already carry a drag handle and visibility toggle.
   *
   * @param option.group When `true`, returns only group items. When `false`, returns only leaf column items.
   *   When omitted, returns all child items regardless of type.
   */
  findChildrenOptions(
    option: {
      group?: boolean;
    } = {}
  ): Array<ContentDisplayOptionWrapper> | null {
    // Group items wrap their content in <div data-item-type="group">.
    // If that wrapper is absent this is a leaf column.
    const groupWrapper = this.getListItem().findContent().find('[data-item-type="group"]');
    if (!groupWrapper) {
      return null;
    }
    // The nested list is scoped inside the group wrapper.
    const nestedList = groupWrapper.find(`.${ListWrapper.rootSelector}`);
    if (!nestedList) {
      return null;
    }
    const list = new ListWrapper(nestedList.getElement());

    if (option.group === true) {
      return list
        .findAll(`li:has([data-item-type="group"])`)
        .map(item => new ContentDisplayOptionWrapper(item.getElement()));
    }
    if (option.group === false) {
      return list
        .findAll(`li:has([data-item-type="column"])`)
        .map(item => new ContentDisplayOptionWrapper(item.getElement()));
    }

    return list.findItems().map(item => new ContentDisplayOptionWrapper(item.getElement()));
  }
}

export default class ContentDisplayPreferenceWrapper extends ComponentWrapper {
  static rootSelector = styles['content-display'];

  /**
   * Returns the title.
   */
  findTitle(): ElementWrapper {
    return this.findByClassName(getClassName('title'))!;
  }

  /**
   * Returns the preference description displayed below the title.
   */
  findDescription(): ElementWrapper {
    return this.findByClassName(getClassName('description'))!;
  }

  private getList(): ListWrapper {
    return new ListWrapper(this.getElement());
  }

  /**
   * Returns an option for a given index.
   *
   * @param index 1-based index of the option to return.
   */
  findOptionByIndex(index: number): ContentDisplayOptionWrapper | null {
    const item = this.getList().findItemByIndex(index);
    return item && new ContentDisplayOptionWrapper(item.getElement());
  }

  /**
   * Returns the top-level items in the preference list.
   *
   * For tables **without** column grouping this returns all column options.
   * For tables **with** column grouping this returns the top-level entries only
   * (which are group items). Use `.findChildrenOptions()` on a group item to
   * access the leaf columns nested within it.
   *
   * @param option.group When `true`, returns only group items. When `false`, returns only leaf column items.
   *   When omitted, returns all top-level items regardless of type.
   * @param option.visible When `true`, returns only visible items. When `false`, returns only hidden items.
   *   Note that group items have no visibility toggle and are excluded when this filter is active.
   */
  findOptions(
    option: {
      group?: boolean;
    } = {}
  ): Array<ContentDisplayOptionWrapper> {
    if (option.group === true) {
      // Only group items — identified by the data-item-type="group" wrapper inside the list item
      return this.getList()
        .findAll(`li:has([data-item-type="group"])`)
        .map(wrapper => new ContentDisplayOptionWrapper(wrapper.getElement()));
    }
    if (option.group === false) {
      // Only leaf column items — identified by the data-item-type="column" wrapper
      return this.getList()
        .findAll(`li:has([data-item-type="column"])`)
        .map(wrapper => new ContentDisplayOptionWrapper(wrapper.getElement()));
    }

    // No group filter — return all top-level items
    return this.getList()
      .findItems()
      .map(wrapper => new ContentDisplayOptionWrapper(wrapper.getElement()));
  }

  /**
   * Returns the text filter input.
   */
  findTextFilter(): TextFilterWrapper | null {
    return this.findComponent(`.${styles['content-display-text-filter']}`, TextFilterWrapper);
  }

  /**
   * Returns no match with the clear filter button.
   */
  findNoMatch(): ElementWrapper | null {
    return this.findByClassName(styles['content-display-no-match']);
  }
}
