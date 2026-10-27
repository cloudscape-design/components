// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

export interface OptionListProps extends BaseComponentProps {
  /**
   * Specifies an array of options that are displayed inline as a list.
   * You can group options into one level of option groups.
   *
   * #### Option
   * - `value` (string) - The returned value of the option when selected. Must be unique.
   * - `label` (string) - (Optional) Option text displayed to the user.
   * - `lang` (string) - (Optional) The language of the option, provided as a BCP 47 language tag.
   * - `description` (string) - (Optional) Further information about the option that appears below the label.
   * - `disabled` (boolean) - (Optional) Determines whether the option is disabled. Users can't select or deselect a disabled option.
   * - `disabledReason` (ReactNode) - (Optional) Displays a tooltip near the item when disabled. Use to provide additional context.
   * - `labelTag` (string) - (Optional) A label tag that provides additional guidance, shown next to the label.
   * - `tags` [string[]] - (Optional) A list of tags giving further guidance about the option.
   * - `icon` (ReactNode) - (Optional) An icon displayed in the option, such as an [icon component](/components/icon/).
   *
   * #### OptionGroup
   * - `value` (string) - Used to locate option group in test utils.
   * - `label` (string) - Option group text displayed to the user.
   * - `disabled` (boolean) - (Optional) Determines whether the option group is disabled. Disables every option in the group.
   * - `options` (Option[]) - The options in the group.
   *
   * In multi selection, choosing a group header selects or deselects all its enabled options.
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
   * The selected options. Options are matched by `value`. In single selection, only the first option of the array is used.
   * If you don't provide this property, the component manages its selection internally.
   */
  selectedOptions?: ReadonlyArray<OptionListProps.Option>;

  /**
   * Called when the user selects or deselects an option.
   * The event `detail` contains the new `selectedOptions`.
   */
  onChange?: NonCancelableEventHandler<OptionListProps.ChangeDetail>;

  /**
   * Adds `aria-label` to the list. Use this when there is no visible label.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the list. Use this to reference the visible label of the list.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the list.
   */
  ariaDescribedby?: string;

  /**
   * Specifies a render function to render custom options.
   */
  renderOption?: OptionListProps.OptionItemRenderer;

  /**
   * An object containing all the necessary localized strings required by the component.
   * * `selectedAriaLabel` - Announced with the highlighted option when it is selected.
   * @i18n
   */
  i18nStrings?: OptionListProps.I18nStrings;
}

export namespace OptionListProps {
  export type SelectionType = 'single' | 'multi';

  export interface Option {
    value?: string;
    label?: string;
    lang?: string;
    description?: string;
    disabled?: boolean;
    disabledReason?: React.ReactNode;
    labelTag?: string;
    tags?: ReadonlyArray<string>;
    icon?: React.ReactNode;
  }

  export interface OptionGroup extends Option {
    options: ReadonlyArray<Option>;
  }

  export type Options = ReadonlyArray<Option | OptionGroup>;

  export interface OptionItem {
    /** The item type. */
    type: 'item';
    /** The position of the item in the list, counting group headers. */
    index: number;
    /** The option, as provided in `options`. */
    option: Option;
    /** Whether the option is selected. */
    selected: boolean;
    /** Whether the option is highlighted. */
    highlighted: boolean;
    /** Whether the option is disabled. */
    disabled: boolean;
    /** The group header item of the group that contains the option, or `null` if the option isn't in a group. */
    parent: OptionGroupItem | null;
  }

  export interface OptionGroupItem {
    /** The item type. */
    type: 'group';
    /** The position of the item in the list, counting group headers. */
    index: number;
    /** The option group, as provided in `options`. */
    option: OptionGroup;
    /** Whether the group is disabled. In `OptionItem.parent`, whether the contained option is disabled. */
    disabled: boolean;
    /** Whether all options in the group are selected. Only provided in multi selection. */
    selected?: boolean;
    /** Whether some, but not all, options in the group are selected. Only provided in multi selection. */
    indeterminate?: boolean;
    /** Whether the group header is highlighted. Only provided in multi selection. */
    highlighted?: boolean;
  }

  export type Item = OptionItem | OptionGroupItem;

  export type OptionItemRenderer = (props: { item: Item }) => React.ReactNode | null;

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
