// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { BaseNavigationDetail, CancelableEventHandler } from '../internal/events';
import { IconProps } from '../icon/interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ExpandToViewport } from '../internal/components/dropdown/interfaces';
import { ButtonProps } from '../button/interfaces';

export interface ButtonDropdownProps extends BaseComponentProps, ExpandToViewport {
  /**
   * Array of objects with a number of suppoted types.
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
   * - `items` (ReadonlyArray<Item>): an array of item objects. Items will be rendered as nested menu items but only for the first nesting level, multi-nesting is not supported.
   * An item which belongs to nested group has the following properties: `id`, `text`, `disabled` and `description`.
   *
   */
  items: ReadonlyArray<ButtonDropdownProps.ItemOrGroup>;
  /**
   * Determines whether the button dropdown is disabled. Users cannot interact with the control if it's disabled.
   */
  disabled?: boolean;
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
}

export namespace ButtonDropdownProps {
  export type Variant = 'normal' | 'primary' | 'icon' | 'inline-icon';
  export type ItemType = 'action' | 'group' | 'checkbox';

  export interface MainAction {
    text: string;
    ariaLabel?: string;
    onClick?: CancelableEventHandler<ButtonProps.ClickDetail>;
    onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;
    disabled?: boolean;
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
     * Focuses the underlying native button.
     */
    focus(): void;
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
export type ItemActivate = (item: ButtonDropdownProps.Item, event: React.MouseEvent | React.KeyboardEvent) => void;

export interface CategoryProps extends HighlightProps {
  item: ButtonDropdownProps.ItemGroup;
  onGroupToggle: GroupToggle;
  onItemActivate: ItemActivate;
  disabled: boolean;
  lastInDropdown: boolean;
  expandToViewport?: boolean;
  variant?: ItemListProps['variant'];
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
}

export interface InternalItem extends ButtonDropdownProps.Item {
  badge?: boolean;
}

export interface InternalItemGroup extends Omit<ButtonDropdownProps.ItemGroup, 'items'> {
  items: InternalItems;
}

export type InternalItems = ReadonlyArray<InternalItemOrGroup>;

export type InternalItemOrGroup = InternalItem | ButtonDropdownProps.CheckboxItem | InternalItemGroup;

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
   * Determines that the dropdown should preferably be aligned to the center of the trigger
   * instead of dropping left or right.
   */
  preferCenter?: boolean;
}

export interface CustomTriggerProps {
  triggerRef: React.Ref<HTMLElement>;
  testUtilsClass: string;
  ariaLabel: string | undefined;
  disabled: boolean;
  isOpen: boolean;
  onClick: () => void;
  ariaExpanded: boolean;
}
