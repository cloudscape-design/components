// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import expandToggleStyles from '../../../internal/components/expand-toggle-button/styles.selectors.js';
import styles from '../../../treeview/styles.selectors.js';

class TreeItemWrapper extends ComponentWrapper {
  /**
   * Finds the content slot of the tree item
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['treeitem-content']);
  }

  /**
   * Finds the content slot of the tree item
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(styles['treeitem-icon']);
  }

  /**
   * Finds the details slot of the tree item
   */
  findDetails(): ElementWrapper | null {
    return this.findByClassName(styles['treeitem-description']);
  }

  /**
   * Finds the actions slot of the tree item
   */
  findActions(): ElementWrapper | null {
    return this.findByClassName(styles['treeitem-secondary-content']);
  }

  /**
   * Finds the child items of the tree item
   */
  findItems(): Array<TreeItemWrapper> {
    return this.findAllByClassName(styles['child-treeitem']).map(item => new TreeItemWrapper(item.getElement()));
  }

  /**
   * Finds the expand toggle of the tree item
   */
  findItemToggle(): ElementWrapper | null {
    return this.findByClassName(expandToggleStyles['expand-toggle']);
  }

  /**
   * Finds the children tree items of the tree item
   */
  findChildren(): Array<TreeItemWrapper> {
    return this.findAllByClassName(styles['child-treeitem']).map(item => new TreeItemWrapper(item.getElement()));
  }

  /**
   * Finds a children tree item by its ID
   */
  findChildById(id: string): TreeItemWrapper | null {
    const itemSelector = `.${styles['child-treeitem']}[data-testid="${id}"]`;
    const item = this.find(itemSelector);
    return item ? new TreeItemWrapper(item.getElement()) : null;
  }

  /**
   * Returns `true` if the item expand toggle is present and expanded. Returns `false` otherwise.
   */
  @usesDom
  isExpanded(): boolean {
    return this.getElement().getAttribute('aria-expanded') === 'true';
  }
}

export default class TreeviewWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Finds the root level tree items
   */
  findItems(): Array<TreeItemWrapper> {
    return this.findAllByClassName(styles['child-treeitem']).map(item => new TreeItemWrapper(item.getElement()));
  }

  findItemById(id: string): TreeItemWrapper | null {
    // const itemSelector = `[role="treeitem"][data-testid="${id}"]`;
    const itemSelector = `.${styles['child-treeitem']}[data-testid="${id}"]`;
    const item = this.find(itemSelector);
    return item ? new TreeItemWrapper(item.getElement()) : null;
  }
}
