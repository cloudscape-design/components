// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup as OptionGroupDefinition } from '../internal/components/option/interfaces';
import { NonCancelableEventHandler } from '../internal/events';
import { BaseSelectProps } from '../select/interfaces';

export interface MultiselectProps extends BaseSelectProps {
  /**
   * Specifies the currently selected options.
   * Provide an empty array to clear the selection.
   */
  selectedOptions: ReadonlyArray<MultiselectProps.Option>;
  /**
   * Determines whether the dropdown list stays open after the user selects an item.
   */
  keepOpen?: boolean;
  /**
   * Specifies the maximum number of displayed tokens. If the property isn't set, all of the tokens are displayed.
   */
  tokenLimit?: number;
  /**
   * Hides the tokens displayed underneath the component.
   * Only use this if the selected options are displayed elsewhere on the page.
   */
  hideTokens?: boolean;
  /**
   * Shows tokens inside the trigger instead of below it.
   */
  inlineTokens?: boolean;
  /**
   * Specifies an `aria-label` for the token deselection button.
   * @i18n
   */
  deselectAriaLabel?: MultiselectProps.DeselectAriaLabelFunction;
  /**
   * An object containing all the localized strings required by the component.
   *
   * * `selectAllText` (string) - Specifies the text to be displayed next to the checkbox that selects or deselects all options.
   * * `tokenLimitShowFewer` (string) - Specifies the text to be displayed in the "Show fewer" button for the token group control.
   * * `tokenLimitShowMore` (string) - Specifies the text to be displayed in the "Show more" button for the token group control. This string should not contain the number of hidden tokens
   * because this will be added by the component automatically.
   * @i18n
   */
  i18nStrings?: MultiselectProps.I18nStrings;
  /**
   * Called when the user selects or deselects an option.
   * The event `detail` contains the current `selectedOptions`.
   */
  onChange?: NonCancelableEventHandler<MultiselectProps.MultiselectChangeDetail>;

  /**
   * Automatically focuses the trigger when component is mounted.
   */
  autoFocus?: boolean;

  /**
   * Adds an aria-label to the "Show fewer" button for the token group control.
   * Use to assign unique labels when there are multiple token groups with the same `tokenLimitShowFewer` label on one page.
   */
  tokenLimitShowFewerAriaLabel?: string;
  /**
   * Adds an aria-label to the "Show more" button for the token group control.
   * Use to assign unique labels when there are multiple token groups with the same `tokenLimitShowMore` label on one page.
   */
  tokenLimitShowMoreAriaLabel?: string;
  /**
   * Enables users to select and deselect all options with a special extra checkbox which is displayed at the start of the dropdown.
   */
  enableSelectAll?: boolean;
}

export namespace MultiselectProps {
  export type Option = OptionDefinition;
  export type OptionGroup = OptionGroupDefinition;
  export type Options = ReadonlyArray<Option | OptionGroup>;
  export type DeselectAriaLabelFunction = (option: Option) => string;
  export type TriggerVariant = 'placeholder' | 'tokens';

  export interface I18nStrings {
    selectAllText?: string;
    tokenLimitShowFewer?: string;
    tokenLimitShowMore?: string;
  }

  export interface MultiselectChangeDetail {
    selectedOptions: ReadonlyArray<Option>;
  }

  export interface Ref {
    /**
     * Sets focus on the element without opening the dropdown or showing a visual focus indicator.
     */
    focus(): void;
  }
}
