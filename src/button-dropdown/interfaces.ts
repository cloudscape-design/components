// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { GeneratedAnalyticsMetadataFragment } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ButtonProps } from '../button/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { BaseNavigationDetail, CancelableEventHandler } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

export interface ButtonDropdownProps extends BaseComponentProps, ExpandToViewport {
  /**
   * Array of objects with a number of supported types.
   *
   * The following properties are supported across all types:
   *
   * - `type` (string) - The type of the item. Can be `action`, `group`, `checkbox`. Defaults to `action` if `items` undefined and `group` otherwise.
   * - `id` (string) - allows to identify the item that the user clicked on. Mandatory for individual items, optional for categories.
   * - `text` (string) - description shown in the menu for this item. Mandatory for individual items, optional for categories.
   * - `lang` (string) - (Optional) The language of the item, provided as a BCP 47 language tag.
   * - `disabled` (boolean) - whether the item is disabled. Disabled items are not clickable, but they can be highlighted with the keyboard to make them accessible.
   * - `disabledReason` (string) - (Optional) Displays text near the `text` property when item is disabled. Use to provide additional context.
   * - `description` (string) - additional data that will be passed to a `data-description` attribute.
   * - `ariaLabel` (string) - (Optional) - ARIA label of the item element.
   *
   * ### action
   *
   * - `href` (string) - (Optional) Defines the target URL of the menu item, turning it into a link.
   * - `external` (boolean) - Marks a menu item as external by adding an icon after the menu item text. The link will open in a new tab when clicked. Note that this only works when `href` is also provided.
   * - `externalIconAriaLabel` (string) - Adds an `aria-label` to the external icon.
   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).
   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.
   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   *
   * ### checkbox
   *
   * When `type` is set to "checkbox", the values set to `href`, `external` and `externalIconAriaLabel` will be ignored.
   *
   * - `checked` (boolean) - Controls the state of the checkbox item.
   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).
   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.
   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   *
   * ### group
   *
   * - `items` (ReadonlyArray<Item>) - an array of item objects. Items will be rendered as nested menu items but only for the first nesting level, multi-nesting is not supported.
   * An item which belongs to nested group has the following properties: `id`, `text`, `disabled`, and `description`.
   *
   */
  items: ReadonlyArray<ButtonDropdownProps.ItemOrGroup>;
  /**
   * Determines whether the button dropdown is disabled. Users cannot interact with the control if it's disabled.
   */
  disabled?: boolean;
  /**
   * Provides a reason why the button dropdown is disabled (only when `disabled` is `true`).
   * If provided, the disabled button becomes focusable.
   */
  disabledReason?: string;
  /**
   * Renders the button as being in a loading state. It takes precedence over the `disabled` if both are set to `true`.
   * It prevents clicks.
   */
  loading?: boolean;
  /**
   * Specifies the text that screen reader announces when the button dropdown is in a loading state.
   */
  loadingText?: string;
  /** Determines the general styling of the button dropdown.
   * * `primary` for primary buttons
   * * `normal` for secondary buttons
   * * `icon` for icon buttons
   * * `inline-icon` for icon buttons with no outer padding
   */
  variant?: ButtonDropdownProps.Variant;
  /**
   * Controls expandability of the item groups.
   */
  expandableGroups?: boolean;
  /**
   * Adds `aria-label` to the button dropdown trigger.
   * Use this to provide an accessible name for buttons that don't have visible text.
   */
  ariaLabel?: string;
  /**
   * Text displayed in the button dropdown trigger.
   * @displayname text
   */
  children?: React.ReactNode;
  /**
   * Called when the user clicks on an item, and the item is not disabled.  The event detail object contains the id of the clicked item.
   */
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  /**
   * Called when the user clicks on an item with the left mouse button without pressing
   * modifier keys (that is, CTRL, ALT, SHIFT, META), and the item has an `href` set.
   */
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  /**
   * A standalone action that is shown prior to the dropdown trigger.
   * Use it with "primary" and "normal" variant only.
   *
   * Main action properties:
   * * `text` (string) - Specifies the text shown in the main action.
   * * `external` (boolean) - Marks the main action as external by adding an icon after the text. The link will open in a new tab when clicked. Note that this only works when `href` is also provided.
   * * `externalIconAriaLabel` (string) - Adds an ARIA label to the external icon.
   *
   * The main action also supports the following properties of the [button](/components/button/?tabId=api) component:
   * `ariaLabel`, `disabled`, `loading`, `loadingText`, `href`, `target`, `rel`, `download`, `iconAlt`, `iconName`, `iconUrl`, `iconSvg`, `onClick`, `onFollow`.
   */
  mainAction?: ButtonDropdownProps.MainAction;

  /**
   * Sets the button width to be 100% of the parent container width. Button content is centered.
   */
  fullWidth?: boolean;
}

export namespace ButtonDropdownProps {
  export type Variant = 'normal' | 'primary' | 'icon' | 'inline-icon';
  export type ItemType = 'action' | 'group';

  export interface MainAction {
    text?: string;
    ariaLabel?: string;
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
    onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;
    disabled?: boolean;
    disabledReason?: string;
    loading?: boolean;
    loadingText?: string;
    href?: string;
    target?: string;
    rel?: string;
    download?: boolean | string;
    external?: boolean;
    externalIconAriaLabel?: string;
    iconAlt?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
  }

  export interface Item {
    itemType?: ItemType;
    id: string;
    text: string;
    ariaLabel?: string;
    lang?: string;
    disabled?: boolean;
    disabledReason?: string;
    description?: string;
    href?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
    iconAlt?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
  }

  export interface CheckboxItem
    extends Omit<ButtonDropdownProps.Item, 'href' | 'external' | 'externalIconAriaLabel' | 'itemType'> {
    itemType: 'checkbox';
    checked: boolean;
  }

  export interface ItemGroup extends Omit<Item, 'id' | 'text' | 'itemType'> {
    itemType?: 'group';
    id?: string;
    text?: string;
    items: Items;
  }

  export type ItemOrGroup = Item | CheckboxItem | ItemGroup;

  export type Items = ReadonlyArray<ItemOrGroup>;

  export interface ItemClickDetails extends BaseNavigationDetail {
    id: string;
    checked?: boolean;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button. If a main action is defined this will focus that button.
     */
    focus(options?: FocusOptions): void;
    /**
     * Focuses the underlying native button for the dropdown.
     */
    focusDropdownTrigger(options?: FocusOptions): void;
  }
}

export interface ButtonDropdownSettings {
  // this means whether action is required to make group expand
  hasExpandableGroups: boolean;
  // on smaller screens expandable groups are integrated into parent dropdown
  // this changes keyboard navigation, highlight and activation behavior for parent dropdown
  isInRestrictedView?: boolean;
}

export interface HighlightProps {
  targetItem: ButtonDropdownProps.ItemOrGroup | null;
  isHighlighted: (item: ButtonDropdownProps.ItemOrGroup) => boolean;
  isKeyboardHighlight: (item: ButtonDropdownProps.ItemOrGroup) => boolean;
  isExpanded: (group: ButtonDropdownProps.ItemGroup) => boolean;
  highlightItem: (item: ButtonDropdownProps.ItemOrGroup) => void;
}

export type GroupToggle = (item: ButtonDropdownProps.ItemGroup, event: React.SyntheticEvent) => void;
export type ItemActivate = (
  item: ButtonDropdownProps.Item | ButtonDropdownProps.CheckboxItem,
  event: React.MouseEvent | React.KeyboardEvent
) => void;

export interface CategoryProps extends HighlightProps {
  item: ButtonDropdownProps.ItemGroup;
  onGroupToggle: GroupToggle;
  onItemActivate: ItemActivate;
  disabled: boolean;
  lastInDropdown: boolean;
  expandToViewport?: boolean;
  variant?: ItemListProps['variant'];
  position?: string;
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
}

export interface LinkItem extends ButtonDropdownProps.Item {
  href: string;
}

export interface ItemProps {
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
}

export interface CustomTriggerProps {
  triggerRef: React.Ref<HTMLElement>;
  testUtilsClass: string;
  ariaLabel: string | undefined;
  disabled: boolean;
  disabledReason?: string;
  isOpen: boolean;
  onClick: () => void;
  ariaExpanded: boolean;
}
