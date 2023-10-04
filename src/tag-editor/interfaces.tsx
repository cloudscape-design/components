// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { AutosuggestProps } from '../autosuggest/interfaces';
import { NonCancelableEventHandler } from '../internal/events';

export interface TagEditorProps extends BaseComponentProps {
  /**
   * Specifies an array of tags that are displayed to the user. Each tag item has the following properties:
   * - `key` (string) - The key of the tag that's displayed in the corresponding key field.
   * - `value` (string) - The value of the tag that's displayed in the corresponding value field.
   * - `existing` (boolean) - Specifies if this is an existing tag for the resource.
   *      When set to `true`, if the tag is deleted its `markedForRemoval` property is to `true`.
   *      When set to `false`, deletion of the tag removes the tag from the `tags` list.
   * - `markedForRemoval` (boolean) - Specifies if this tag has been marked for removal.
   *      This property is set to `true` by the component when a user removes an existing tag.
   *      The item will remain in the `tags` list. When set to `true`, the user is presented with the option to undo the removal operation.
   * - `valueSuggestionOptions` (Array<AutosuggestProps.Option>) - An array of autosuggest suggestion options associated with the specified tag key.
   */
  tags?: ReadonlyArray<TagEditorProps.Tag>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TagEditorProps.I18nStrings;

  /**
   * Renders the component in a loading state.
   */
  loading?: boolean;

  /**
   * Specifies the maximum number of tags that a customer can add.
   */
  tagLimit?: number;

  /**
   * Specifies a regular expression string that overrides the default acceptable
   * character validation. You should use this property only when absolutely necessary.
   */
  allowedCharacterPattern?: string;

  /**
   * Specifies a function that returns all the keys for a resource.
   * The expected return type of the function should be a promise that
   * resolves to a list of strings of all the keys (for example, `['key1', 'key2']`).
   */
  keysRequest?: (key: string) => Promise<ReadonlyArray<string>>;

  /**
   * Specifies a function that returns all the values for a specified key
   * of a resource. The expected return type of the function should be a promise
   * that resolves to a list of strings of all the values (for example, `['value1', 'value2']`).
   *
   * You should return a rejected promise when the `key` parameter is an empty string.
   */
  valuesRequest?: (key: string, value: string) => Promise<ReadonlyArray<string>>;

  /**
   * Called when any tag operation occurs.
   * The event `detail` object contains the full updated state of `tags`,
   * and whether the component is in a `valid` state.
   */
  onChange?: NonCancelableEventHandler<TagEditorProps.ChangeDetail>;
}

export namespace TagEditorProps {
  export interface Tag {
    /**
     * The key of the tag that will be displayed in the corresponding key field.
     */
    key: string;

    /**
     * The value of the tag that will be displayed in the corresponding value field.
     */
    value: string;

    /**
     * Whether this is an existing tag for the resource. If set to `true`, deletion of the tag will set the `markedForRemoval` property to `true`. If set to `false`, deletion of the tag will remove the tag from the `tags` list.
     */
    existing: boolean;

    /**
     * Whether this tag has been marked for removal. This property will be set to `true` by the component when a user tries to remove an existing tag. The item will remain in the `tags` list. When set to `true`, the user will be presented with the option to undo the removal operation.
     */
    markedForRemoval?: boolean;

    /**
     * An array of suggested values for the specified tag key.
     */
    valueSuggestionOptions?: ReadonlyArray<AutosuggestProps.Option>;
  }

  export interface I18nStrings {
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addButton?: string;
    removeButton?: string;
    undoButton?: string;
    undoPrompt?: string;
    loading?: string;
    keyHeader?: string;
    valueHeader?: string;
    optional?: string;
    keySuggestion?: string;
    valueSuggestion?: string;
    tooManyKeysSuggestion?: string;
    tooManyValuesSuggestion?: string;
    emptyTags?: string;
    errorIconAriaLabel?: string;
    keysSuggestionLoading?: string;
    keysSuggestionError?: string;
    valuesSuggestionError?: string;
    valuesSuggestionLoading?: string;
    emptyKeyError?: string;
    maxKeyCharLengthError?: string;
    maxValueCharLengthError?: string;
    duplicateKeyError?: string;
    invalidKeyError?: string;
    invalidValueError?: string;
    awsPrefixError?: string;
    clearAriaLabel?: string;
    itemRemovedAriaLive?: string;
    tagLimit?: (availableTags: number, tagLimit: number) => string;
    tagLimitReached?: (tagLimit: number) => string;
    tagLimitExceeded?: (tagLimit: number) => string;
    enteredKeyLabel?: (enteredText: string) => string;
    enteredValueLabel?: (enteredText: string) => string;
    removeButtonAriaLabel?: (item: TagEditorProps.Tag) => string;
  }

  export interface ChangeDetail {
    tags: ReadonlyArray<TagEditorProps.Tag>;
    valid: boolean;
  }

  export interface Ref {
    /**
     * Focuses the first error within the component.
     * If no error is present, no element is focused.
     */
    focus(): void;
  }
}
