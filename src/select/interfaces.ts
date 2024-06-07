// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';
import { OptionDefinition, OptionGroup as OptionGroupDefinition } from '../internal/components/option/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import {
  BaseDropdownHostProps,
  OptionsFilteringType,
  OptionsLoadItemsDetail,
} from '../internal/components/dropdown/interfaces';

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
   * - `label` (string) - (Optional) Option text displayed to the user.
   * - `lang` (string) - (Optional) The language of the option, provided as a BCP 47 language tag.
   * - `description` (string) - (Optional) Further information about the option that appears below the label.
   * - `disabled` (boolean) - (Optional) Determines whether the option is disabled.
   * - `labelTag` (string) - (Optional) A label tag that provides additional guidance, shown next to the label.
   * - `tags` [string[]] - (Optional) A list of tags giving further guidance about the option.
   * - `filteringTags` [string[]] - (Optional) A list of additional tags used for automatic filtering.
   * - `iconName` (string) - (Optional) Specifies the name of an [icon](/components/icon/) to display in the option.
   * - `iconAlt` (string) - (Optional) Specifies alternate text for a custom icon, for use with `iconUrl`.
   * - `iconUrl` (string) - (Optional) URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   *
   * #### OptionGroup
   * - `label` (string) - Option group text displayed to the user.
   * - `disabled` (boolean) - (Optional) Determines whether the option group is disabled.
   * - `options` (Option[]) - (Optional) The options under this group.
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
   * Adds an small label inline with the input for saving vertical space in a compact UI.
   */
  inlineLabel?: string;
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
   * the `selectedLabel` property is defined.
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
}

export interface SelectProps extends BaseSelectProps {
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
}

export namespace SelectProps {
  export type FilteringType = OptionsFilteringType;
  export type TriggerVariant = 'label' | 'option';

  export type Option = OptionDefinition;
  export type OptionGroup = OptionGroupDefinition;
  export type Options = ReadonlyArray<Option | OptionGroup>;

  export type LoadItemsDetail = OptionsLoadItemsDetail;

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
