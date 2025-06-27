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
   */
  findVisibilityToggle(): ToggleWrapper {
    return this.getListItem()
      .findContent()
      .findComponent(`.${styles['content-display-option-toggle']}`, ToggleWrapper)!;
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
   * Returns options that the user can reorder.
   */
  findOptions(): Array<ContentDisplayOptionWrapper> {
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
