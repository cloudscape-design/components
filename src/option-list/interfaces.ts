// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';

/*
 * HACK: Cast the component to a named parametrized interface.
 * This lets us use React.forwardRef and still let the component have type
 * parameters, and the naming convention lets the documenter know that this is
 * a forwardRef-wrapped component.
 */
export interface OptionListForwardRefType {
  <T>(props: OptionListProps<T> & { ref?: React.Ref<OptionListProps.Ref> }): JSX.Element;
}

export interface OptionListProps<T = any> extends BaseComponentProps {
  /**
   * The items to display. Each item is converted into an option with `renderItem`.
   */
  items: ReadonlyArray<T>;

  /**
   * Converts an item into an option. Return an object with the following properties:
   * * `id` (string) - A unique identifier for the item. It is used for `selectedIds`.
   * * `content` (string | React.ReactNode) - The main content of the option. Use a string when possible:
   *    it is also used for the option tooltip and for type-ahead search.
   * * `secondaryContent` (string) - (Optional) Secondary text, for example a description.
   * * `icon` (React.ReactNode) - (Optional) An icon, displayed at the start of the option.
   * * `labelTag` (string) - (Optional) A short text displayed at the end of the first line, same as `labelTag` in Select options.
   * * `tags` (ReadonlyArray<string>) - (Optional) Tags displayed under the content, same as `tags` in Select options.
   * * `disabled` (boolean) - (Optional) Determines whether the option is disabled. Users can't select or deselect a disabled option.
   * * `disabledReason` (string) - (Optional) Displays a tooltip next to the option when it is disabled and highlighted. Use it to explain why the option isn't available.
   *
   * Options are the selection target. Do not render interactive elements such as buttons or links inside them.
   */
  renderItem: (item: T) => OptionListProps.RenderItemResult;

  /**
   * Specifies whether the user can select one option (`single`) or several (`multi`).
   * Multi selection shows a checkbox next to each option.
   */
  selectionType: OptionListProps.SelectionType;

  /**
   * The ids of the selected items.
   *
   * If you provide this property, you must also provide an `onChange` handler that updates it.
   * If you don't, the component manages its selection internally.
   */
  selectedIds?: ReadonlyArray<string>;

  /**
   * Called when the user selects or deselects an option.
   * The event `detail` contains the new `selectedIds`.
   */
  onChange?: NonCancelableEventHandler<OptionListProps.ChangeDetail>;

  /**
   * Called when the list receives focus.
   */
  onFocus?: NonCancelableEventHandler;

  /**
   * Called when the list loses focus.
   */
  onBlur?: NonCancelableEventHandler;

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

  export interface RenderItemResult {
    id: string;
    content: React.ReactNode;
    secondaryContent?: string;
    icon?: React.ReactNode;
    labelTag?: string;
    tags?: ReadonlyArray<string>;
    disabled?: boolean;
    disabledReason?: string;
  }

  export interface ChangeDetail {
    selectedIds: ReadonlyArray<string>;
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
