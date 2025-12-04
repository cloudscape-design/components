// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import {
  BaseInputProps,
  InputAutoComplete,
  InputAutoCorrect,
  InputKeyEvents,
  InputSpellcheck,
} from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { OptionsFilteringType, OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { OptionDefinition } from '../internal/components/option/interfaces';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface PromptInputProps
  extends Omit<BaseInputProps, 'nativeInputAttributes' | 'value' | 'onChange'>,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Specifies the content of the prompt input, not in use if `tokens` is defined.
   */
  value?: string;

  /**
   * Specifies the content of the prompt input when modes/references are in use.
   * Represented as an array of TextToken or ReferenceToken.
   * When defined, `autocomplete` will no longer function.
   */
  tokens?: readonly PromptInputProps.InputToken[];

  /**
   * Called whenever a user changes the input value (by typing or pasting).
   * The event `detail` contains the current value as a React.ReactNode.
   */
  onChange?: NonCancelableEventHandler<PromptInputProps.ChangeDetail>;

  /**
   * Called whenever a user clicks the action button or presses the "Enter" key.
   * The event `detail` contains the current value of the field.
   */
  onAction?: NonCancelableEventHandler<PromptInputProps.ActionDetail>;
  /**
   * Determines what icon to display in the action button.
   */
  actionButtonIconName?: IconProps.Name;
  /**
   * Specifies the URL of a custom icon. Use this property if the icon you want isn't available.
   *
   * If you set both `actionButtonIconUrl` and `actionButtonIconSvg`, `actionButtonIconSvg` will take precedence.
   */
  actionButtonIconUrl?: string;
  /**
   * Specifies the SVG of a custom icon.
   *
   * Use this property if you want your custom icon to inherit colors dictated by variant or hover states.
   * When this property is set, the component will be decorated with `aria-hidden="true"`. Ensure that the `svg` element:
   * - has attribute `focusable="false"`.
   * - has `viewBox="0 0 16 16"`.
   *
   * If you set the `svg` element as the root node of the slot, the component will automatically
   * - set `stroke="currentColor"`, `fill="none"`, and `vertical-align="top"`.
   * - set the stroke width based on the size of the icon.
   * - set the width and height of the SVG element based on the size of the icon.
   *
   * If you don't want these styles to be automatically set, wrap the `svg` element into a `span`.
   * You can still set the stroke to `currentColor` to inherit the color of the surrounding elements.
   *
   * If you set both `actionButtonIconUrl` and `actionButtonIconSvg`, `iconSvg` will take precedence.
   *
   * *Note:* Remember to remove any additional elements (for example: `defs`) and related CSS classes from SVG files exported from design software.
   * In most cases, they aren't needed, as the `svg` element inherits styles from the icon component.
   */
  actionButtonIconSvg?: React.ReactNode;
  /**
   * Specifies alternate text for a custom icon. We recommend that you provide this for accessibility.
   * This property is ignored if you use a predefined icon or if you set your custom icon using the `iconSvg` slot.
   */
  actionButtonIconAlt?: string;
  /**
   * Adds an aria-label to the action button.
   * @i18n
   */
  actionButtonAriaLabel?: string;

  /**
   * Specifies whether to disable the action button.
   */
  disableActionButton?: boolean;

  /**
   * Specifies the minimum number of lines of text to set the height to.
   */
  minRows?: number;

  /**
   * Specifies the maximum number of lines of text the textarea will expand to.
   * Defaults to 3. Use -1 for infinite rows.
   */
  maxRows?: number;

  /**
   * Use this to replace the primary action.
   * If this is provided then any other `actionButton*` properties will be ignored.
   * Note that you should still provide an `onAction` function in order to handle keyboard submission.
   *
   * @awsuiSystem core
   */
  customPrimaryAction?: React.ReactNode;

  /**
   * Use this slot to add secondary actions to the prompt input.
   */
  secondaryActions?: React.ReactNode;

  /**
   * Use this slot to add secondary content, such as file attachments, to the prompt input.
   */
  secondaryContent?: React.ReactNode;

  /**
   * Determines whether the secondary actions area of the input has padding. If true, removes the default padding from the secondary actions area.
   */
  disableSecondaryActionsPaddings?: boolean;

  /**
   * Determines whether the secondary content area of the input has padding. If true, removes the default padding from the secondary content area.
   */
  disableSecondaryContentPaddings?: boolean;

  /**
   * Menus that can be triggered via shortcuts (e.g., "/" or "@").
   * For menus only relevant to triggers at the start of the input, set `useAtStart: true`, defaults to `false`.
   */
  menus?: PromptInputProps.MenuDefinition[];

  /**
   * The ID of the menu to show. When undefined, no menu is shown.
   * If undefined then the input can show a menu based depending on the shortcut trigger.
   */
  activeMenuId?: string;

  /**
   * Attributes to add to the native `textarea` element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   * If `tokens` is defined, nativeTextareaAttributes will be ignored.
   *
   * @awsuiSystem core
   */
  nativeTextareaAttributes?: NativeAttributes<React.TextareaHTMLAttributes<HTMLTextAreaElement>>;

  /**
   * @awsuiSystem core
   */
  style?: PromptInputProps.Style;
}

export namespace PromptInputProps {
  export type KeyDetail = BaseKeyDetail;

  export interface TextInputToken {
    type: 'text';
    text: string;
  }

  export interface ReferenceInputToken {
    type: 'reference';
    id: string;
    label: string;
    value: string;
  }

  export type InputToken = TextInputToken | ReferenceInputToken;

  export interface ChangeDetail {
    value?: string;
    tokens?: InputToken[];
  }

  export interface ActionDetail {
    value?: string;
    tokens?: InputToken[];
  }

  export interface MenuDefinition {
    id: string;
    trigger: string;
    onSelect: (option: OptionDefinition) => void;
    options: OptionDefinition[];
    useAtStart?: boolean;
    /**
     * Determines how filtering is applied to the list of `options`:
     *
     * * `auto` - The component will automatically filter options based on user input.
     * * `manual` - You will set up `onLoadItems` event listener and filter options on your side or request
     * them from server.
     *
     * By default the component will filter the provided `options` based on the value of the filtering input.
     * Only options that have a `value`, `label`, `description` or `labelTag` that contains the input value as a substring
     * are displayed in the list of options.
     *
     * If you set this property to `manual`, this default filtering mechanism is disabled and all provided `options` are
     * displayed in the dropdown menu. In that case make sure that you use the `onLoadItems` event in order
     * to set the `options` property to the options that are relevant for the user, given the filtering input value.
     *
     * Note: Manual filtering doesn't disable match highlighting.
     **/
    filteringType?: OptionsFilteringType;
    /**
     * Use this event to implement the asynchronous behavior for the menu.
     *
     * The event is called in the following situations:
     * * The user scrolls to the end of the list of options, if `statusType` is set to `pending`.
     * * The user clicks on the recovery button in the error state.
     * * The user types after the trigger character.
     * * The menu is opened.
     *
     * The detail object contains the following properties:
     * * `filteringText` - The value that you need to use to fetch options.
     * * `firstPage` - Indicates that you should fetch the first page of options that match the `filteringText`.
     * * `samePage` - Indicates that you should fetch the same page that you have previously fetched (for example, when the user clicks on the recovery button).
     **/
    onLoadItems?: NonCancelableEventHandler<OptionsLoadItemsDetail>;
    /**
     * Displayed when there are no options to display.
     * This is only shown when `statusType` is set to `finished` or not set at all.
     */
    empty?: React.ReactNode;
    /**
     * Specifies the text to display when in the loading state.
     **/
    loadingText?: string;
    /**
     * Specifies the text to display at the bottom of the dropdown menu after pagination has reached the end.
     **/
    finishedText?: string;
    /**
     * Specifies the text to display when a data fetching error occurs. Make sure that you provide `recoveryText`.
     **/
    errorText?: string;
    /**
     * Specifies the text for the recovery button. The text is displayed next to the error text.
     * Use the `onLoadItems` event to perform a recovery action (for example, retrying the request).
     * @i18n
     **/
    recoveryText?: string;
    /**
     * Provides a text alternative for the error icon in the error message.
     * @i18n
     */
    errorIconAriaLabel?: string;
    /**
     * Specifies the current status of loading more options.
     * * `pending` - Indicates that no request in progress, but more options may be loaded.
     * * `loading` - Indicates that data fetching is in progress.
     * * `finished` - Indicates that pagination has finished and no more requests are expected.
     * * `error` - Indicates that an error occurred during fetch. You should use `recoveryText` to enable the user to recover.
     **/
    statusType?: DropdownStatusProps.StatusType;
  }

  export interface Ref {
    /**
     * Sets input focus on the textarea control.
     */
    focus(): void;

    /**
     * Selects all text in the textarea control.
     */
    select(): void;

    /**
     * Selects a range of text in the textarea control.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/setSelectionRange
     * for more details on this method. Be aware that using this method in React has some
     * common pitfalls: https://stackoverflow.com/questions/60129605/is-javascripts-setselectionrange-incompatible-with-react-hooks
     */
    setSelectionRange(start: number | null, end: number | null, direction?: 'forward' | 'backward' | 'none'): void;
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
