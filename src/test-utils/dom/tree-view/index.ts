// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import expandToggleStyles from '../../../internal/components/expand-toggle-button/styles.selectors.js';
import structuredItemTestUtilStyles from '../../../internal/components/structured-item/test-classes/styles.selectors.js';
import testUtilStyles from '../../../tree-view/test-classes/styles.selectors.js';

class TreeViewItemWrapper extends ComponentWrapper {
  /**
   * Finds the content slot of the tree view item.
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.content);
  }

  /**
   * Finds the icon slot of the tree view item.
   */
  findIcon(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.icon);
  }

  /**
   * Finds the secondary content slot of the tree view item.
   */
  findSecondaryContent(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.secondary);
  }

  /**
   * Finds the actions slot of the tree view item.
   */
  findActions(): ElementWrapper | null {
    return this.findByClassName(structuredItemTestUtilStyles.actions);
  }

  /**
   * Finds the expand toggle of the tree view item.
   */
  findItemToggle(): ElementWrapper | null {
    return this.findByClassName(expandToggleStyles['expand-toggle']);
  }

  /**
   * Finds all visible child items of the tree view item.
   * @param options
   * * expanded (optional, boolean) - Use it to find all visible expanded or collapsed child items.
   */
  findChildItems(options: { expanded?: boolean } = {}): Array<TreeViewItemWrapper> {
    const selector = getTreeItemSelector(options);

    return this.findAll(selector).map(item => new TreeViewItemWrapper(item.getElement()));
  }

  /**
   * Finds a visible child item by its ID.
   * @param id of the item to find
   * @param options
   * * expanded (optional, boolean) - Use it to find the visible expanded or collapsed child item.
   */
  findChildItemById(id: string, options: { expanded?: boolean } = {}): TreeViewItemWrapper | null {
    const selector = `${getTreeItemSelector(options)}[data-testid="awsui-treeitem-${id}"]`;
    const item = this.find(selector);
    return item ? new TreeViewItemWrapper(item.getElement()) : null;
  }
}

export default class TreeViewWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  /**
   * Finds all visible tree view items.
   * @param options
   * * expanded (optional, boolean) - Use it to find all visible expanded or collapsed items.
   */
  findItems(options: { expanded?: boolean } = {}): Array<TreeViewItemWrapper> {
    const selector = getTreeItemSelector(options);

    return this.findAll(selector).map(item => new TreeViewItemWrapper(item.getElement()));
  }

  /**
   * Finds a visible tree view item by its ID.
   * @param id of the item to find
   * @param options
   * * expanded (optiona, boolean) - Use it to find the visible expanded or collapsed item.
   */
  findItemById(id: string, options: { expanded?: boolean } = {}): TreeViewItemWrapper | null {
    const selector = `${getTreeItemSelector(options)}[data-testid="awsui-treeitem-${id}"]`;
    const item = this.find(selector);
    return item ? new TreeViewItemWrapper(item.getElement()) : null;
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
