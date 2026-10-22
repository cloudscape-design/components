// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';
import { OptionDefinition } from '../types/option';

export interface OptionListProps extends BaseComponentProps {
  /**
   * Specifies an array of options that are displayed inline as a list. Uses the same option objects as Select and Multiselect.
   * Option groups are not supported.
   *
   * #### Option
   * - `value` (string) - The returned value of the option when selected. Must be unique.
   * - `label` (string) - (Optional) Option text displayed to the user.
   * - `lang` (string) - (Optional) The language of the option, provided as a BCP 47 language tag.
   * - `description` (string) - (Optional) Further information about the option that appears below the label.
   * - `disabled` (boolean) - (Optional) Determines whether the option is disabled. Users can't select or deselect a disabled option.
   * - `disabledReason` (string) - (Optional) Displays a tooltip near the item when disabled. Use to provide additional context.
   * - `labelTag` (string) - (Optional) A label tag that provides additional guidance, shown next to the label.
   * - `tags` [string[]] - (Optional) A list of tags giving further guidance about the option.
   * - `iconName` (string) - (Optional) Specifies the name of an [icon](/components/icon/) to display in the option.
   * - `iconAriaLabel` (string) - (Optional) Specifies alternate text for the icon. We recommend that you provide this for accessibility.
   * - `iconUrl` (string) - (Optional) URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   *
   * Options are the selection target. Do not render interactive elements such as buttons or links inside them.
   */
  options: OptionListProps.Options;

  /**
   * Specifies whether the user can select one option (`single`) or several (`multi`).
   * Multi selection shows a checkbox next to each option.
   */
  selectionType: OptionListProps.SelectionType;

  /**
   * The selected options. Options are matched by `value`.
   * In single selection, only the first option of the array is used.
   *
   * If you provide this property, you must also provide an `onChange` handler that updates it.
   * If you don't, the component manages its selection internally.
   */
  selectedOptions?: ReadonlyArray<OptionListProps.Option>;

  /**
   * Called when the user selects or deselects an option.
   * The event `detail` contains the new `selectedOptions`.
   */
  onChange?: NonCancelableEventHandler<OptionListProps.ChangeDetail>;

  /**
   * Adds an `aria-label` to the list. Use this when there is no visible label.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the list. Use this to reference the visible question or heading.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the list.
   */
  ariaDescribedby?: string;

  /**
   * An object containing all the necessary localized strings required by the component.
   * * `selectedAriaLabel` - Announced with the highlighted option when it is selected.
   * @i18n
   */
  i18nStrings?: OptionListProps.I18nStrings;
}

export namespace OptionListProps {
  export type SelectionType = 'single' | 'multi';
  export type Option = OptionDefinition;
  export type Options = ReadonlyArray<Option>;

  export interface ChangeDetail {
    selectedOptions: ReadonlyArray<Option>;
  }

  export interface I18nStrings {
    selectedAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Sets focus on the list.
     */
    focus(): void;
  }
}
