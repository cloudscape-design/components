// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { BaseInputProps, InputAutoCorrect, InputKeyEvents, InputSpellcheck } from '../input/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { BaseDropdownHostProps, OptionsFilteringType } from '../internal/components/dropdown/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { OptionDefinition, OptionGroup } from '../internal/components/option/interfaces';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { BaseKeyDetail, NonCancelableEventHandler } from '../internal/events';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface PromptInputProps
  extends Omit<BaseInputProps, 'nativeInputAttributes' | 'name' | 'value' | 'onChange'>,
    InputKeyEvents,
    InputAutoCorrect,
    InputSpellcheck,
    BaseComponentProps,
    FormFieldValidationControlProps {
  /**
   * Specifies the name of the prompt input for form submissions.
   */
  name?: string;

  /**
   * Specifies whether to enable a browser's autocomplete functionality for this input.
   * In some cases it might be appropriate to disable autocomplete (for example, for security-sensitive fields).
   * To use it correctly, set the `name` property.
   *
   * You can either provide a boolean value to set the property to "on" or "off", or specify a string value
   * for the [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute.
   *
   * Note: When `menus` is defined, autocomplete will not function.
   */
  autoComplete?: boolean | string;

  /**
   * Specifies the content of the prompt input.
   *
   * When `menus` is defined (token mode):
   * - This property is optional and defaults to empty string
   * - The actual content is managed via the `tokens` array
   * - `onChange` and `onAction` events will provide the serialized text value
   *
   * When `menus` is not defined (text mode):
   * - This property is required
   * - Represents the current text content of the textarea
   */
  value?: string;
  /**
   * Specifies the content of the prompt input when using token mode.
   *
   * All tokens use the same unified structure with a `value` property:
   * - Text tokens: `value` contains the text content
   * - Reference tokens: `value` contains the reference value, `label` for display (e.g., '@john')
   * - Trigger tokens: `value` contains the filter text, `triggerChar` for the trigger character
   *
   * When `menus` is defined, you should use `tokens` to control the content instead of `value`.
   */
  tokens?: readonly PromptInputProps.InputToken[];

  /**
   * Custom function to transform tokens into plain text for the `value` field in `onChange` and `onAction` events
   * and for the hidden input when `name` is specified.
   *
   * If not provided, the default implementation is:
   * ```
   * tokens.map(token => token.value).join('');
   * ```
   *
   * Use this to customize serialization, for example:
   * - Using `label` instead of `value` for reference tokens
   * - Adding custom formatting or separators between tokens
   */
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;

  /**
   * Called whenever a user changes the input value (by typing or pasting).
   * The event `detail` contains the current value as a string and an array of tokens.
   *
   * When `menus` is defined, the `value` is derived from `tokensToText(tokens)` if provided, otherwise from the default token-to-text conversion.
   */
  onChange?: NonCancelableEventHandler<PromptInputProps.ChangeDetail>;

  /**
   * Called whenever a user clicks the action button or presses the "Enter" key.
   * The event `detail` contains the current value as a string and an array of tokens.
   *
   * When `menus` is defined, the `value` is derived from `tokensToText(tokens)` if provided, otherwise from the default token-to-text conversion.
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
   * @deprecated Use `i18nStrings.actionButtonAriaLabel` instead.
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
   * Menus that can be triggered via specific symbols (e.g., "/" or "@").
   * For menus only relevant to triggers at the start of the input, set `useAtStart: true`, defaults to `false`.
   */
  menus?: PromptInputProps.MenuDefinition[];

  /**
   * Maximum height of the menu dropdown in pixels.
   * When not specified, the menu will grow to fit its content.
   */
  maxMenuHeight?: number;

  /**
   * Called whenever a user selects an option in a menu.
   */
  onMenuItemSelect?: NonCancelableEventHandler<PromptInputProps.MenuItemSelectDetail>;

  /**
   * Use this event to implement the asynchronous behavior for menus.
   *
   * The event is called in the following situations:
   * - The user scrolls to the end of the list of options, if `statusType` is set to `pending` (pagination).
   * - The user clicks on the recovery button in the error state.
   * - The user types after the trigger character.
   * - The menu is opened.
   *
   * The detail object contains the following properties:
   * - `menuId` - The ID of the menu that triggered the event.
   * - `filteringText` - The value to use to fetch options (undefined for pagination).
   * - `firstPage` - Indicates that you should fetch the first page of options.
   * - `samePage` - Indicates that you should fetch the same page (for example, when clicking recovery button).
   */
  onMenuLoadItems?: NonCancelableEventHandler<PromptInputProps.MenuLoadItemsDetail>;

  /**
   * Called when the user types to filter options in manual filtering mode for a menu.
   * Use this to filter the options based on the filtering text.
   *
   * The detail object contains:
   * - `menuId` - The ID of the menu that triggered the event.
   * - `filteringText` - The text to use for filtering options.
   */
  onMenuFilter?: NonCancelableEventHandler<PromptInputProps.MenuFilterDetail>;

  /**
   * An object containing all the localized strings required by the component.
   *
   * - `ariaLabel` (string) - Adds an aria-label to the input element.
   * - `actionButtonAriaLabel` (string) - Adds an aria-label to the action button.
   * - `menuErrorIconAriaLabel` (string) - Provides a text alternative for the error icon in the error message in menus.
   * - `menuRecoveryText` (string) - Specifies the text for the recovery button in menus. The text is displayed next to the error text.
   * - `menuLoadingText` (string) - Specifies the text to display when menus are in a loading state.
   * - `menuFinishedText` (string) - Specifies the text to display when menus have finished loading all items.
   * - `menuErrorText` (string) - Specifies the text to display when menus encounter an error while loading.
   * - `selectedMenuItemAriaLabel` (string) - Specifies the localized string that describes an option as being selected.
   * @i18n
   */
  i18nStrings?: PromptInputProps.I18nStrings;

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

  export interface I18nStrings {
    actionButtonAriaLabel?: string;
    menuErrorIconAriaLabel?: string;
    menuRecoveryText?: string;
    menuLoadingText?: string;
    menuFinishedText?: string;
    menuErrorText?: string;
    /**
     * Aria label announced when a reference token is inserted from a menu.
     * Receives the token object with label and value properties.
     * @param token The inserted token
     * @returns The announcement string
     * @default `${token.label || token.value} inserted`
     */
    tokenInsertedAriaLabel?: (token: { label?: string; value: string }) => string;
    /**
     * Aria label announced when a reference token is pinned (inserted at the start).
     * Receives the token object with label and value properties.
     * @param token The pinned token
     * @returns The announcement string
     * @default `${token.label || token.value} pinned`
     */
    tokenPinnedAriaLabel?: (token: { label?: string; value: string }) => string;
    /**
     * Aria label announced when a reference token is removed.
     * Receives the token object with label and value properties.
     * @param token The removed token
     * @returns The announcement string
     * @default `${token.label || token.value} removed`
     */
    tokenRemovedAriaLabel?: (token: { label?: string; value: string }) => string;
  }

  export interface TextToken {
    type: 'text' | 'break';
    value: string;
  }

  export interface ReferenceToken {
    type: 'reference';
    id: string;
    label: string;
    value: string;
    menuId: string;
    /**
     * When true, prevents user entered text from being placed before this token.
     * Typically set for reference tokens from useAtStart menus.
     */
    pinned?: boolean;
  }

  /**
   * Token type for active menu triggers with filter text.
   * Represents a trigger character (e.g., "@" or "/") followed by filtering text.
   * This token type is automatically managed by the component when menus are active.
   *
   * - `value`: The filtering text (without the trigger character)
   * - `triggerChar`: The trigger character that opened the menu
   */
  export interface TriggerToken {
    type: 'trigger';
    value: string;
    triggerChar: string;
    /**
     * Internal: Unique ID for this specific trigger token instance.
     * Used to anchor menus to the correct trigger when multiple triggers exist.
     */
    id?: string;
  }

  export type InputToken = TextToken | ReferenceToken | TriggerToken;

  export interface ChangeDetail {
    value: string;
    tokens: InputToken[];
  }

  export interface ActionDetail {
    value: string;
    tokens: InputToken[];
  }

  export interface MenuItemSelectDetail {
    menuId: string;
    option: OptionDefinition;
  }

  export interface MenuLoadItemsDetail {
    menuId: string;
    filteringText?: string; // Optional - undefined for pagination (load more)
    firstPage: boolean;
    samePage: boolean;
  }

  export interface MenuFilterDetail {
    menuId: string;
    filteringText: string;
  }

  export interface MenuDefinition
    extends Pick<DropdownStatusProps, 'empty' | 'statusType'>,
      Pick<BaseDropdownHostProps, 'virtualScroll'> {
    /**
     * The unique identifier for this menu.
     */
    id: string;

    /**
     * The unique trigger symbol for showing this menu.
     */
    trigger: string;

    /**
     * Set `useAtStart=true` for menus where a trigger should only be detected at the start of input.
     * Set this for menus designated to modes or actions.
     *
     * Menus with `useAtStart=true` create pinned reference tokens.
     */
    useAtStart?: boolean;

    /**
     * Specifies an array of options that are displayed to the user as a list.
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
     */
    options: (OptionDefinition | OptionGroup)[];

    /**
     * Determines how filtering is applied to the list of `options`:
     *
     * - `auto` - The component will automatically filter options based on user input.
     * - `manual` - You will set up `onMenuFilter` event listeners and filter options on your side or request
     * them from server.
     *
     * By default the component will filter the provided `options` based on the value of the filtering input field.
     * Only options that have a `value`, `label`, `description` or `labelTag` that contains the input value as a substring
     * are displayed in the list of options.
     *
     * If you set this property to `manual`, this default filtering mechanism is disabled and all provided `options` are
     * displayed in the menu. In that case make sure that you use the `onMenuFilter` event in order
     * to set the `options` property to the options that are relevant for the user, given the filtering input value.
     *
     * Note: Manual filtering doesn't disable match highlighting.
     **/
    filteringType?: Exclude<OptionsFilteringType, 'none'>;
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

    /**
     * Inserts text at a specified position. Triggers input events and menu detection when `menus` is defined.
     *
     * @param text The text to insert.
     * @param cursorStart Position to insert at. Defaults to end of content.
     * @param cursorEnd Cursor position after insertion. Defaults to end of inserted text.
     */
    insertText(text: string, cursorStart?: number, cursorEnd?: number): void;
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
