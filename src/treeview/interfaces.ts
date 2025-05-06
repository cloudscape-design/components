// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TreeviewProps extends BaseComponentProps {
  /**
   * An array of treeview items.
   * Each item has the following properties:
   * * `id` (string) - The unique identifier of the item.
   * * `content` (React.ReactNode) - The content of the item.
   * * `details` (optional, React.ReactNode) - The details of the item, displayed below the content.
   * * `actions` (optional, React.ReactNode) - Actions related to item. We recommend using button group.
   * * `items` (optional, TreeItem[]) - The nested items of the item.
   */
  items: ReadonlyArray<TreeviewProps.TreeItem>;

  /**
   * An array of expanded item IDs. Each item ID must match the `id` property of an item in the `items` array.
   */
  expandedItems?: ReadonlyArray<string>;

  /**
   * Provides an `aria-label` to the treeview that screen readers can read (for accessibility).
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the treeview.
   */
  ariaLabelledby?: string;

  /**
   * Called when an item's expand toggle is clicked.
   */
  onExpandableItemToggle: NonCancelableEventHandler<TreeviewProps.ExpandableItemToggleDetail>;

  /**
   * Renders the treeview in a loading state. We recommend that you also set a `loadingText`.
   * Do we need this? Customers could render a spinner or status indicator themselves, unlike table - there the columns should be there. We'd need to suggest them to have a text in the status indicator and wrap the status indicator with the live region component
   * I think the text similar to the table should be specified by the customer instead of depending on the i18n strings, specifically to the content that is being rendered (Loading clusters, etc)
   */
  // loading?: boolean;

  /**
   * Specifies the text that's displayed when the treeview is in a loading state.
   */
  // loadingText?: string;

  /**
   * Displayed when the `items` property is an empty array. Use it to render an empty state.
   */
  // empty?: React.ReactNode;

  /**
   * If `true`, adds guide lines connecting child items to the expanded parent item.
   */
  showGuideLines?: boolean;
}

export namespace TreeviewProps {
  export interface TreeItem {
    id: string;
    content: React.ReactNode;
    details?: React.ReactNode;
    actions?: React.ReactNode;
    items?: ReadonlyArray<TreeItem>;
  }

  export interface ExpandableItemToggleDetail {
    id: string;
    expanded: boolean;
  }
}
