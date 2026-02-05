// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import { BaseInputProps, InputAutoCorrect, InputClearLabel, InputKeyEvents, InputProps } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import {
  BaseDropdownHostProps,
  OptionsFilteringType,
  OptionsLoadItemsDetail,
} from '../internal/components/dropdown/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { OptionDefinition, OptionGroup } from '../internal/components/option/interfaces';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface AutosuggestProps
  extends BaseComponentProps,
    BaseInputProps,
    InputAutoCorrect,
    BaseDropdownHostProps,
    InputKeyEvents,
    InputClearLabel,
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
   * - `iconAriaLabel` (string) - (Optional) Specifies alternate text for the icon. We recommend that you provide this for accessibility.
   * - `iconAlt` (string) - (Optional) **Deprecated**, replaced by \`iconAriaLabel\`. Specifies alternate text for a custom icon, for use with `iconUrl`.
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
  options?: AutosuggestProps.Options;

  /**
   * Specifies a render function to render custom options in the dropdown menu.
   *
   * The item inside the props has a different shape depending on its type:
   *
   *
   * ### item
   *
   * - `type` ('item') - The item type.
   * - `index` (number) - The item's absolute position in the dropdown.
   * - `option` (Option) - The original option configuration.
   * - `disabled` (boolean) - Whether the item is disabled.
   * - `highlighted` (boolean) - Whether the item is currently highlighted.
   * - `selected` (boolean) - Whether the item is selected.
   * - `parent` (OptionGroupRenderItem | null) - The parent group item, if any.
   *
   * ### group
   *
   * - `type` ('group') - The item type.
   * - `index` (number) - The item's absolute position in the dropdown.
   * - `option` (OptionGroup) - The original option configuration.
   * - `disabled` (boolean) - Whether the item is disabled.
   *
   * ### entered-text
   *
   * - `type` ('entered-text') - The item type.
   * - `option` (Option) - The entered-text option configuration.
   *
   * When providing a custom `renderOption` implementation, it fully replaces the default visual rendering and content for that item.
   * The component still manages focus, keyboard interactions, and selection state, but it no longer applies its default item layout or typography.
   *
   * When returning `null`, the default rendering will be applied for that item.
   *
   * @awsuiSystem core
   */
  renderOption?: AutosuggestProps.ItemRenderer;

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
   * Specifies a function that generates the custom value indicator (for example, `Use "${value}"`).
   * @i18n
   */
  enteredTextLabel?: AutosuggestProps.EnteredTextLabel;

  /**
   * Defines whether entered text option is shown as the first option in the dropdown when value is non-empty.
   */
  hideEnteredTextOption?: boolean;

  /**
   * Specifies the text to display with the number of matches at the bottom of the dropdown menu while filtering.
   *
   * Note that the `matchesCount` includes the `enteredTextLabel` ("Use ${value}") item, so in most cases you
   * should subtract 1 from `matchesCount`. If using manual filtering, you should provide your own value for `totalCount`.
   */
  filteringResultsText?: (matchesCount: number, totalCount: number) => string;

  /**
   * Specifies the text that's displayed when there aren't any suggestions to display.
   * This is displayed when `statusType` is set to `finished` or it's not set at all.
   */
  empty?: React.ReactNode;

  /**
   * Called whenever a user selects an option in the dropdown. Don't use this event as the only way to handle user input.
   * Instead, use `onSelect` in combination with the `onChange` handler only as an optional convenience for the user.
   */
  onSelect?: NonCancelableEventHandler<AutosuggestProps.SelectDetail>;

  /**
   * Specifies the localized string that describes an option as being selected.
   * This is required to provide a good screen reader experience. For more information, see the
   * [accessibility guidelines](/components/autosuggest/?tabId=usage#accessibility-guidelines).
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
   * [accessibility guidelines](/components/autosuggest/?tabId=usage#accessibility-guidelines).
   */
  renderHighlightedAriaLive?: AutosuggestProps.ContainingOptionAndGroupString;

  /**
   * @awsuiSystem core
   */
  style?: AutosuggestProps.Style;
}

export namespace AutosuggestProps {
  export type ChangeDetail = InputProps.ChangeDetail;
  export type KeyDetail = InputProps.KeyDetail;
  export type FilteringType = OptionsFilteringType;
  export type Option = OptionDefinition;
  export type Options = ReadonlyArray<Option | OptionGroup>;
  export type EnteredTextLabel = (value: string) => string;
  export interface OptionGroup extends Option {
    label?: string;
    options: ReadonlyArray<Option>;
  }
  export type LoadItemsDetail = OptionsLoadItemsDetail;
  export type StatusType = DropdownStatusProps.StatusType;
  export interface SelectDetail {
    value: string;
    selectedOption?: Option;
  }

  export interface ContainingOptionAndGroupString {
    (option: Option, group?: OptionGroup): string;
  }

  export interface OptionRenderItem {
    type: 'item';
    index: number;
    option: Option;
    disabled: boolean;
    highlighted: boolean;
    selected: boolean;
    parent: OptionGroupRenderItem | null;
  }
  export interface OptionGroupRenderItem {
    type: 'group';
    index: number;
    option: OptionGroup;
    disabled: boolean;
  }
  export interface EnteredTextRenderItem {
    type: 'entered-text';
    option: Option;
    highlighted: boolean;
  }
  export type RenderItem = OptionRenderItem | OptionGroupRenderItem | EnteredTextRenderItem;
  export type ItemRenderer = (props: { item: RenderItem; filterText?: string }) => ReactNode | null;

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;

    /**
     * Selects all text in the input control.
     */
    select(): void;
  }

  export interface Style {
    root?: {
      backgroundColor?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      borderColor?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      borderRadius?: string;
      borderWidth?: string;
      boxShadow?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      color?: {
        default?: string;
        disabled?: string;
        focus?: string;
        hover?: string;
        readonly?: string;
      };
      fontSize?: string;
      fontWeight?: string;
      paddingBlock?: string;
      paddingInline?: string;
    };
    placeholder?: {
      color?: string;
      fontSize?: string;
      fontStyle?: string;
      fontWeight?: string;
    };
  }
}

// TODO: use DropdownOption type same as in select and multiselect
export type AutosuggestItem = (AutosuggestProps.Option | AutosuggestProps.OptionGroup) & {
  type?: 'parent' | 'child' | 'use-entered';
  option: OptionDefinition | OptionGroup;
  parent?: OptionGroup;
};
