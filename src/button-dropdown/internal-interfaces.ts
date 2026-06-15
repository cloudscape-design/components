// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { GeneratedAnalyticsMetadataFragment } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import {
  ButtonDropdownProps,
  CustomTriggerProps,
  GroupToggle,
  HighlightProps,
  ItemActivate,
  LinkItem,
} from './interfaces';

export interface CategoryProps extends HighlightProps {
  index?: number;
  item: ButtonDropdownProps.ItemGroup;
  onGroupToggle: GroupToggle;
  onItemActivate: ItemActivate;
  disabled: boolean;
  lastInDropdown: boolean;
  expandToViewport?: boolean;
  variant?: ItemListProps['variant'];
  position?: string;
  renderItem?: ButtonDropdownProps.ItemRenderer;
}

export interface ItemListProps extends HighlightProps {
  items: ButtonDropdownProps.Items;
  onGroupToggle: GroupToggle;
  onItemActivate: ItemActivate;
  categoryDisabled?: boolean;
  hasExpandableGroups?: boolean;
  hasCategoryHeader?: boolean;
  lastInDropdown: boolean;
  expandToViewport?: boolean;
  variant?: InternalButtonDropdownProps['variant'];
  position?: string;
  analyticsMetadataTransformer?: InternalButtonDropdownProps['analyticsMetadataTransformer'];
  linkStyle?: boolean;
  renderItem?: ButtonDropdownProps.ItemRenderer;
  parentProps?: ButtonDropdownProps.GroupRenderItem;
}

export interface ItemProps {
  index?: number;
  item: ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem | LinkItem;
  disabled: boolean;
  highlighted: boolean;
  onItemActivate: ItemActivate;
  highlightItem: (item: ButtonDropdownProps.ItemOrGroup) => void;
  showDivider: boolean;
  hasCategoryHeader: boolean;
  isKeyboardHighlighted?: boolean;
  variant?: ItemListProps['variant'];
  position?: string;
  analyticsMetadataTransformer?: InternalButtonDropdownProps['analyticsMetadataTransformer'];
  linkStyle?: boolean;
  renderItem?: ButtonDropdownProps.ItemRenderer;
  parentProps?: ButtonDropdownProps.GroupRenderItem;
}

export interface InternalItem extends ButtonDropdownProps.Item {
  badge?: boolean;
  /**
   * Used in breadcrumb-group: indicates that this breadcrumb item is the current page
   */
  isCurrentBreadcrumb?: boolean;
}

export interface InternalCheckboxItem extends ButtonDropdownProps.CheckboxItem {
  badge?: boolean;
}

interface InternalItemGroup extends Omit<ButtonDropdownProps.ItemGroup, 'items'> {
  items: InternalItems;
}

type InternalItems = ReadonlyArray<InternalItemOrGroup>;

export type InternalItemOrGroup = InternalItem | InternalCheckboxItem | InternalItemGroup;

export interface InternalButtonDropdownProps
  extends Omit<ButtonDropdownProps, 'variant' | 'items'>,
    InternalBaseComponentProps {
  customTriggerBuilder?: (props: CustomTriggerProps) => React.ReactNode;
  variant?: ButtonDropdownProps['variant'] | 'navigation';
  items: ReadonlyArray<InternalItemOrGroup>;

  /**
   * Optional text that is displayed as the title at the top of the dropdown.
   */
  title?: string;

  /**
   * Optional text that is displayed underneath the title at the top of the dropdown.
   */
  description?: string;

  /**
   * Only show main action button as a regular, non-split button.
   * That is needed so that button dropdown test utils wrapper can still be used.
   */
  showMainActionOnly?: boolean;

  /**
   * Determines that the dropdown should preferably be aligned to the center of the trigger
   * instead of dropping left or right.
   */
  preferCenter?: boolean;

  /**
   * Determines whether simple items should be displayed with the link styles.
   * Used in Breadcrumb group component for collapsed breadcrumbs
   */
  linkStyle?: boolean;

  /**
   * Determines whether the dropdown should take up the full available width.
   * Used in Breadcrumb group component for collapsed breadcrumbs
   */
  fullWidth?: boolean;

  analyticsMetadataTransformer?: (input: GeneratedAnalyticsMetadataFragment) => GeneratedAnalyticsMetadataFragment;

  /**
   * Position of the button dropdown inside a list of elements, for example a button group
   */
  position?: string;

  /**
   * Renders the trigger button without vertical padding or borders, matching the compact
   * `inline-icon` footprint. Use with `variant="icon"` to get the icon variant's neutral colour
   * while keeping an inline footprint (used by the table multi-column sort menu).
   */
  compactTrigger?: boolean;
}
