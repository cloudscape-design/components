// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TreeviewProps<T = any> extends BaseComponentProps {
  /**
   * An array of treeview items.
   */
  items: ReadonlyArray<T>;

  /**
   * Use it to map your data to render the item.
   * For each item the below properties must be returned:
   * * `content` (React.ReactNode) - The content of the item.
   * * `icon` (optional, React.ReactNode) - The leading icon of the item.
   * * `description` (optional, React.ReactNode) - The details of the item, displayed below the content.
   * * `secondaryContent` (optional, React.ReactNode) - Actions related to item. We recommend using a button group.
   */
  renderItem: (item: T, index: number) => TreeviewProps.TreeItem;

  /**
   * Provides a unique identifier of each item.
   */
  getItemId: (item: T, index: number) => string;

  /**
   * The nested items of the item.
   */
  getItemChildren: (item: T, index: number) => ReadonlyArray<T>;

  /**
   * An array of expanded item IDs. Use it to control expand state of tree items.
   */
  expandedItems?: ReadonlyArray<string>;

  /**
   * Provides an `aria-label` to the treeview that screen readers can read (for accessibility).
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the treeview.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  /**
   * Sets the `aria-description` property on the treeview.
   */
  ariaDescription?: string;

  /**
   * Sets the `aria-describedby` property on the treeview.
   */
  ariaDescribedby?: string;

  /**
   * Called when an item's expand toggle is clicked.
   */
  onItemToggle: NonCancelableEventHandler<TreeviewProps.ItemToggleDetail<T>>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TreeviewProps.I18nStrings<T>;

  /**
   * If `true`, adds connecting lines between child items and their expanded parent items.
   */
  showConnectorLine?: boolean;

  /**
   * @awsuiSystem core
   * Overrides the default expand toggle.
   * Use it to have different icons/animations for toggle.
   */
  renderItemToggleIcon?: (isExpanded: boolean) => React.ReactNode;
}

export namespace TreeviewProps {
  export interface TreeItem {
    content: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    secondaryContent?: React.ReactNode;
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
