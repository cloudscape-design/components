// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import StructuredItemWrapper from '../internal/structured-item.js';

import dragHandleStyles from '../../../internal/components/drag-handle/test-classes/styles.selectors.js';
import styles from '../../../list/test-classes/styles.selectors.js';

export class ListItemWrapper extends StructuredItemWrapper {
  findDragHandle(): ElementWrapper | null {
    return this.findByClassName(dragHandleStyles.root);
  }
}

export default class ListWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;
  /**
   * Returns all list items.
   */
  findItems(): Array<ListItemWrapper> {
    return this.findAllByClassName(styles.item).map(wrapper => new ListItemWrapper(wrapper.getElement()));
  }
  /**
   * Returns an item for a given index.
   *
   * @param index 1-based index of the item to return.
   */
  findItemByIndex(index: number): ListItemWrapper | null {
    return this.findComponent(`.${styles.item}:nth-child(${index})`, ListItemWrapper);
  }
  /**
   * Returns an item for a given id.
   *
   */
  findItemById(id: string): ListItemWrapper | null {
    return this.findComponent(`.${styles.item}[data-testid="${id}"]`, ListItemWrapper);
  }
}
