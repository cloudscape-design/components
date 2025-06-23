// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TreeViewProps<T = any> extends BaseComponentProps {
  /**
   * Specifies the items to display in the tree view.
   */
  items: ReadonlyArray<T>;

  /**
   * Use this property to map your data to tree view items. This property must return an object with the following properties:
   * * `content` (React.ReactNode) - The content of the item.
   * * `icon` (optional, React.ReactNode) - The leading icon of the item.
   * * `secondaryContent` (optional, React.ReactNode) - Secondary content of the item, displayed below `content`.
   * * `actions` (optional, React.ReactNode) - Actions related to the item. Use [button group](/components/button-group/).
   */
  renderItem: (item: T, index: number) => TreeViewProps.TreeItem;

  /**
   * Provides a unique identifier for each tree view item.
   */
  getItemId: (item: T, index: number) => string;

  /**
   * Specifies the nested items that are displayed when a tree view item gets expanded.
   */
  getItemChildren: (item: T, index: number) => ReadonlyArray<T> | undefined;

  /**
   * Provides the IDs of the expanded tree view items. It controls whether an item is expanded or collapsed.
   */
  expandedItems?: ReadonlyArray<string>;

  /**
   * Provides an `aria-label` to the tree view that screen readers can read (for accessibility).
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the tree view.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  /**
   * Sets the `aria-describedby` property on the tree view.
   */
  ariaDescribedby?: string;

  /**
   * Called when an item expands or collapses.
   */
  onItemToggle?: NonCancelableEventHandler<TreeViewProps.ItemToggleDetail<T>>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TreeViewProps.I18nStrings<T>;

  /**
   * @awsuiSystem core
   * Use this property to display a custom icon in the toggle button.
   */
  renderItemToggleIcon?: (isExpanded: boolean) => React.ReactNode;
}

export namespace TreeViewProps {
  export interface TreeItem {
    content: React.ReactNode;
    icon?: React.ReactNode;
    secondaryContent?: React.ReactNode;
    actions?: React.ReactNode;
  }

  export interface ItemToggleDetail<T> {
    id: string;
    item: T;
    expanded: boolean;
  }

  export interface I18nStrings<T> {
    collapseButtonLabel?: (item: T) => string;
    expandButtonLabel?: (item: T) => string;
  }
}
