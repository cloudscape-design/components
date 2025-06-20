// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import expandToggleStyles from '../../../internal/components/expand-toggle-button/styles.selectors.js';
import structuredItemTestUtilStyles from '../../../internal/components/structured-item/test-classes/styles.selectors.js';
import testUtilStyles from '../../../tree-view/test-classes/styles.selectors.js';

class TreeItemWrapper extends ComponentWrapper {
  /**
   * Finds the content of the tree item.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.content);
  }

  /**
   * Finds the icon of the tree item.
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.icon);
  }

  /**
   * Finds the secondary content of the tree item.
   */
  findSecondaryContent(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.secondary);
  }

  /**
   * Finds the actions of the tree item.
   */
  findActions(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.actions);
  }

  /**
   * Finds the expand toggle of the tree item.
   */
  findItemToggle(): ElementWrapper | null {
    return this.findByClassName(expandToggleStyles['expand-toggle']);
  }

  /**
   * Finds all visible child items of the tree item.
   * @param options
   * * expanded (boolean) - Flag to find the expanded/collapsed items
   */
  findChildren(options: { expanded?: boolean } = {}): Array<TreeItemWrapper> {
    const selector = getTreeItemSelector(options);

    return this.findAll(selector).map(item => new TreeItemWrapper(item.getElement()));
  }

  /**
   * Finds a visible child item by its ID.
   * @param id of the item to find
   * @param options
   * * expanded (boolean) - Flag to find the expanded/collapsed item. Use it to test if item is expanded/collapsed.
   */
  findChildById(id: string, options: { expanded?: boolean } = {}): TreeItemWrapper | null {
    const selector = `${getTreeItemSelector(options)}[data-testid="treeitem-${id}"]`;
    const item = this.find(selector);
    return item ? new TreeItemWrapper(item.getElement()) : null;
  }
}

export default class TreeViewWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  /**
   * Finds all visible tree items.
   * @param options
   * * expanded (boolean) - Flag to find the expanded/collapsed items
   */
  findItems(options: { expanded?: boolean } = {}): Array<TreeItemWrapper> {
    const selector = getTreeItemSelector(options);

    return this.findAll(selector).map(item => new TreeItemWrapper(item.getElement()));
  }

  /**
   * Finds a visible item by its ID.
   * @param id of the item to find
   * @param options
   * * expanded (boolean) - Flag to find the expanded/collapsed item. Use it to test if item is expanded/collapsed.
   */
  findItemById(id: string, options: { expanded?: boolean } = {}): TreeItemWrapper | null {
    const selector = `${getTreeItemSelector(options)}[data-testid="treeitem-${id}"]`;
    const item = this.find(selector);
    return item ? new TreeItemWrapper(item.getElement()) : null;
  }
}

function getTreeItemSelector({ expanded }: { expanded?: boolean }): string {
  let selector = `.${testUtilStyles.treeitem}`;

  if (expanded === true) {
    selector += `.${testUtilStyles.expanded}`;
  } else if (expanded === false) {
    selector += `.${testUtilStyles.expandable}:not(.${testUtilStyles.expanded})`;
  }

  return selector;
}
