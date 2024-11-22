// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { NodeApi } from 'react-arborist';

import { ButtonDropdownProps } from '../button-dropdown';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface TreeProps extends BaseComponentProps {
  /**
   * An array of objects representing tree items. Each item has the following properties:
   *
   * - `value` (string | number) - Unique identifier for the item.
   * - `label` (React.ReactNode) - Visible content for the item.
   * - `items` (ReadonlyArray<TreeProps.TreeNode>) - An array of tree items (nested elements).
   *   TBD later
   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).
   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.
   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   */
  items: ReadonlyArray<TreeProps.TreeNode>;
  /**
   * Indicates the current value.
   */
  value?: TreeProps.Value;

  initialOpenIds?: string[];
  /**
   * Called when the user selects an item.
   * The event `detail` contains the current value.
   */
  onChange?: NonCancelableEventHandler<TreeProps.Value>;
  /**
   * Determines items in the expanded state via map with the following structure:
   *   * Record<(string | number), boolean>
   * Where the key is the value of the `value` property of the `TreeNode` object.
   * The value is `true` if the item is expanded, otherwise `false`.
   */
  expanded?: TreeProps.ExpandedItems;
  /**
   * Called when the state changes (when the user expands or collapses items).
   * The event `detail` contains the current value of the `expanded` property.
   */
  onExpand?: NonCancelableEventHandler<TreeProps.ExpandedItems>;
  /**
   * Provides an `aria-label` to the root element.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the root element.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  onSelect?: (node: TreeProps.ArboristNode) => void;
}

export namespace TreeProps {
  export type Value = string | number;
  export interface TreeNode {
    id: Value;
    name: React.ReactNode;
    children?: ReadonlyArray<TreeNode>;
    badges?: React.ReactNode;

    dropdownItems?: ButtonDropdownProps['items'];

    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
  }

  export type ArboristNode = NodeApi<TreeNode>;

  export type ExpandedItems = Record<Value, boolean>;
}
