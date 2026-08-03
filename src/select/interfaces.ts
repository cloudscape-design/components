// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import { BaseDropdownHostProps, OptionsFilteringType, OptionsLoadItemsDetail } from '../dropdown/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { DropdownStatusProps } from '../types/dropdown-status';
import { NonCancelableEventHandler } from '../types/events';
import { FormFieldValidationControlProps } from '../types/form-field';
import { OptionDefinition, OptionGroup as OptionGroupDefinition } from '../types/option';

export interface BaseSelectProps
  extends BaseDropdownHostProps,
    BaseComponentProps,
    FormFieldValidationControlProps,
    DropdownStatusProps {
  /**
   * Specifies an array of options that are displayed to the user as a dropdown list.
   * The options can be grouped using `OptionGroup` objects.
   *
   * #### Option
   * - `value` (string) - The returned value of the option when selected.
   *
   * #### OptionGroup
   * - `value` (string) - Used to locate option group in test utils.
   * - `options` (Option[]) - (Optional) The options under this group.
   *
   * #### Shared Option and OptionGroup properties
   * - `label` (string) - (Optional) Option or group text displayed to the user.
   * - `lang` (string) - (Optional) The language of the option or group, provided as a BCP 47 language tag.
   * - `description` (string) - (Optional) Further information about the option or group that appears below the label.
   * - `disabled` (boolean) - (Optional) Determines whether the option or group is disabled.
   * - `disabledReason` (string) - (Optional) Displays tooltip near the item when disabled. Use to provide additional context.
   * - `labelTag` (string) - (Optional) A label tag that provides additional guidance, shown next to the label.
   * - `tags` [string[]] - (Optional) A list of tags giving further guidance about the option or group.
   * - `filteringTags` [string[]] - (Optional) A list of additional tags used for automatic filtering.
   * - `iconName` (string) - (Optional) Specifies the name of an [icon](/components/icon/) to display in the option or group.
   * - `iconAriaLabel` (string) - (Optional) Specifies alternate text for the icon. We recommend that you provide this for accessibility.
   * - `iconAlt` (string) - (Optional) **Deprecated**, replaced by \`iconAriaLabel\`. Specifies alternate text for a custom icon, for use with `iconUrl`.
   * - `iconUrl` (string) - (Optional) URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   *
   * Note: Only one level of option nesting is supported.
   *
   * If you want to use the built-in filtering capabilities of this component, provide
   * a list of all valid options here and they will be automatically filtered based on the user's filtering input.
   *
   * Alternatively, you can listen to the `onChange` or `onLoadItems` event and set new options
   * on your own.
   **/
  options?: SelectProps.Options;

  /**
   * Determines how filtering is applied to the list of `options`:
   *
   * * `auto` - The component will automatically filter options based on user input.
   * * `manual` - You will set up `onChange` or `onLoadItems` event listeners and filter options on your side or request
   * them from server.
   *
   * By default the component will filter the provided `options` based on the value of the filtering input field.
   * Only options that have a `value`, `label`, `description` or `labelTag` that contains the input value as a substring
   * are displayed in the list of options.
   *
   * If you set this property to `manual`, this default filtering mechanism is disabled and all provided `options` are
   * displayed in the dropdown list. In that case make sure that you use the `onChange` or `onLoadItems` events in order
   * to set the `options` property to the options that are relevant for the user, given the filtering input value.
   *
   * Note: Manual filtering doesn't disable match highlighting.
   **/
  filteringType?: OptionsFilteringType;

  /**
   * Determines whether the whole select component is disabled.
   */
  disabled?: boolean;
  /**
   * Specifies the placeholder to display in the filtering input if filtering is enabled.
   */
  filteringPlaceholder?: string;

  /**
   * Specifies the text to display with the number of matches at the bottom of the dropdown menu while filtering.
   */
  filteringResultsText?: (matchesCount: number, totalCount: number) => string;
  /**
   * Adds an `aria-label` on the built-in filtering input if filtering is enabled.
   */
  filteringAriaLabel?: string;
  /**
   * Adds an `aria-label` to the clear button inside the search input.
   * @i18n
   */
  filteringClearAriaLabel?: string;
  /**
   * @deprecated Has no effect.
   */
  name?: string;
  /**
   * Specifies the hint text that's displayed in the field when no option has been selected.
   */
  placeholder?: string;
  /**
   * Specifies the ID for the trigger component. It uses an automatically generated ID by default.
   */
  controlId?: string;
  /**
   * Adds `aria-required` to the native input element.
   */
  ariaRequired?: boolean;
  /**
   * Adds `aria-label` to the select element.
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;
  /**
   * Specifies the localized string that describes an option as being selected.
   * This is required to provide a good screen reader experience. For more information, see the
   * [accessibility guidelines](/components/select/?tabId=usage#accessibility-guidelines).
   * @i18n
   */
  selectedAriaLabel?: string;
  /**
   * Overrides the element that is announced to screen readers
   * when the highlighted option changes. By default, this announces
   * the option's name and properties, and its selected state if
   * the `selectedAriaLabel` property is defined.
   * The highlighted option is provided, and its group (if groups
   * are used and it differs from the group of the previously highlighted option).
   *
   * For more information, see the
   * [accessibility guidelines](/components/select/?tabId=usage#accessibility-guidelines).
   */
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
  /**
   * Displayed for `filteringType="auto"` when there are no matches for the filtering.
   */
  noMatch?: React.ReactNode;
  /**
   * Called when input focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler;
  /**
   * Called when input focus is set onto the UI control.
   */
  onFocus?: NonCancelableEventHandler;

  /**
   * Specifies if the control is read-only, which prevents the
   * user from both modifying the value and opening the dropdown. A read-only control is still focusable.
   */
  readOnly?: boolean;

  /**
   * Renders content at the top of the dropdown, above the filter input (when filtering is enabled) and the
   * options list. Pinned (sticky) to the top and rendered in every state (empty, no-match, loading, error,
   * finished).
   */
  renderDropdownHeader?: SelectProps.DropdownContentRenderer;

  /**
   * Renders content at the bottom of the dropdown. The content is always sticky and never scrolls with the
   * options list. It is added below the built-in status region. Receives the current filtering state and a
   * callback to close the dropdown.
   */
  renderDropdownFooter?: SelectProps.DropdownContentRenderer;

  /**
   * Renders custom controls next to the built-in filter input, on the same row (for example, a filter-type
   * segmented control). It does not replace the input and is only called when filtering is enabled. Receives the
   * current filtering state and a callback to close the dropdown.
   */
  renderFilteringActions?: SelectProps.DropdownContentRenderer;

  /**
   * Determines the ARIA role of the dropdown.
   *
   * - `auto` (default): the dropdown uses a listbox role, or a dialog role when built-in filtering is enabled.
   * - `dialog`: the dropdown always uses a dialog role, even without built-in filtering. Use this when you render
   * interactive custom content and want assistive technologies to treat the dropdown as a dialog.
   */
  dropdownRole?: SelectProps.DropdownRole;

  /**
   * Adds `aria-describedby` to the dropdown's listbox/dialog content.
   */
  dropdownAriaDescribedby?: string;
}

export interface SelectProps extends BaseSelectProps {
  /**
   * Adds a small label inline with the input for saving vertical space in the UI.
   * For use with collection select filters only.
   */
  inlineLabelText?: string;
  onLoadItems?: NonCancelableEventHandler<SelectProps.LoadItemsDetail>;
  /**
   * Adds `aria-labelledby` to the component. If you're using this component within a form field,
   * don't set this property because the form field component automatically sets it.
   *
   * Use this property if the component isn't using `inlineLabelText` and isn't surrounded by a form field, or you want to override the value
   * automatically set by the form field (for example, if you have two components within a single form field).
   *
   * To use it correctly, define an ID for the element you want to use as label and set the property to that ID.
   */
  ariaLabelledby?: string;
  /**
   * Defines the variant of the trigger. You can use a simple label or the entire option (`label | option`)
   */
  triggerVariant?: SelectProps.TriggerVariant;
  /**
   * Specifies the currently selected option.
   * If you want to clear the selection, use `null`.
   */
  selectedOption: SelectProps.Option | null;
  /**
   * Called when the user selects an option.
   * The event `detail` contains the current `selectedOption`.
   */
  onChange?: NonCancelableEventHandler<SelectProps.ChangeDetail>;

  /**
   * Automatically focuses the trigger when component is mounted.
   */
  autoFocus?: boolean;
  /**
   * Specifies a render function to render custom options in the dropdown menu or trigger.
   */
  renderOption?: SelectProps.SelectOptionItemRenderer;
}

export namespace SelectProps {
  export type FilteringType = OptionsFilteringType;
  export type TriggerVariant = 'label' | 'option';

  /**
   * The argument passed to the dropdown render functions (`renderDropdownHeader`,
   * `renderDropdownFooter`, and `renderFilteringActions`).
   */
  export interface DropdownContentProps {
    filterText: string;

    closeDropdown: () => void;
  }

  export type DropdownRole = 'auto' | 'dialog';

  /**
   * A render function for custom dropdown content, used by `renderDropdownHeader`, `renderDropdownFooter`, and
   * `renderFilteringActions`. Receives the current filtering state and a callback to close the dropdown.
   */
  export type DropdownContentRenderer = (props: DropdownContentProps) => ReactNode | null;

  export type Option = OptionDefinition;
  export type OptionGroup = OptionGroupDefinition;
  export type Options = ReadonlyArray<Option | OptionGroup>;

  export interface SelectOptionItem {
    type: 'item';
    index: number;
    option: Option;
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
    parent: SelectOptionGroupItem | null;
  }
  export interface SelectOptionGroupItem {
    type: 'group';
    index: number;
    option: OptionGroup;
    disabled: boolean;
  }
  export interface SelectTriggerOptionItem {
    type: 'trigger';
    option: Option;
  }
  export type SelectItem = SelectOptionItem | SelectOptionGroupItem | SelectTriggerOptionItem;
  export type SelectOptionItemRenderer = (props: { item: SelectItem; filterText?: string }) => ReactNode | null;

  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type --
   * Required to create a distinct named type for the documenter.
   **/
  export interface LoadItemsDetail extends OptionsLoadItemsDetail {}

  export interface ChangeDetail {
    selectedOption: Option;
  }

  export interface ContainingOptionAndGroupString {
    (option: Option, group?: OptionGroup): string;
  }

  export interface Ref {
    /**
     * Sets focus on the element without opening the dropdown or showing a visual focus indicator.
     */
    focus(): void;
  }
}
