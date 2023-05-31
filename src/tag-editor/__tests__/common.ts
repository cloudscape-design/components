// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TagEditorProps } from '../../../lib/components/tag-editor';

export const MAX_KEY_LENGTH = 128;
export const MAX_VALUE_LENGTH = 256;

export const i18nStrings: Required<TagEditorProps.I18nStrings> = {
  keyPlaceholder: 'Enter key',
  valuePlaceholder: 'Enter value',
  addButton: 'Add new tag',
  removeButton: 'Remove',
  undoButton: 'Undo',
  undoPrompt: 'This tag will be removed upon saving changes',
  loading: 'Loading tags that are associated with this resource',
  keyHeader: 'Key',
  valueHeader: 'Value',
  optional: 'optional',
  keySuggestion: 'Custom tag key',
  valueSuggestion: 'Custom tag value',
  emptyTags: 'No tags associated with the resource.',
  errorIconAriaLabel: 'Error',
  tooManyKeysSuggestion: 'Unable to display the long list of keys available for this account',
  tooManyValuesSuggestion: 'This tag has too many values to display',
  keysSuggestionLoading: 'Loading key values',
  keysSuggestionError: 'Error loading items',
  valuesSuggestionLoading: 'Loading tag values',
  valuesSuggestionError: 'Error loading items',
  emptyKeyError: 'You must specify a tag key',
  maxKeyCharLengthError: 'The maximum number of characters you can use in a tag key is 128.',
  maxValueCharLengthError: 'The maximum number of characters you can use in a tag value is 256.',
  duplicateKeyError: 'You must specify a unique tag key.',
  invalidKeyError:
    'Invalid key. Keys can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-',
  invalidValueError:
    'Invalid value. Values can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-',
  awsPrefixError: 'Cannot start with aws:',
  clearAriaLabel: 'Clear',
  tagLimit: availableTags => `You can add ${availableTags} more tag(s).`,
  tagLimitReached: tagLimit => `You have reached the limit of ${tagLimit} tag(s).`,
  tagLimitExceeded: tagLimit => `You have exceeded the limit of ${tagLimit} tag(s).`,
  enteredKeyLabel: (text: string) => `Use ${text}`,
  enteredValueLabel: (text: string) => `Use ${text}`,
  itemRemovedAriaLive: 'An item was removed.',
  removeButtonAriaLabel: tag => `Remove ${tag.key}`,
};
