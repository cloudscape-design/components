// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TagEditorI18n {
  i18nStrings: {
    keyPlaceholder: string;
    valuePlaceholder: string;
    addButton: string;
    removeButton: string;
    undoButton: string;
    undoPrompt: string;
    loading: string;
    keyHeader: string;
    valueHeader: string;
    optional: string;
    keySuggestion: string;
    valueSuggestion: string;
    emptyTags: string;
    tooManyKeysSuggestion: string;
    tooManyValuesSuggestion: string;
    keysSuggestionLoading: string;
    keysSuggestionError: string;
    valuesSuggestionLoading: string;
    valuesSuggestionError: string;
    emptyKeyError: string;
    maxKeyCharLengthError: string;
    maxValueCharLengthError: string;
    duplicateKeyError: string;
    invalidKeyError: string;
    invalidValueError: string;
    awsPrefixError: string;
    enteredKeyLabel: ({ key }: { key: string }) => string;
    enteredValueLabel: ({ value }: { value: string }) => string;
    errorIconAriaLabel: string;
    tagLimit: ({ availableTags }: { availableTags: string }) => string;
    tagLimitExceeded: ({ tagLimit }: { tagLimit: string }) => string;
    tagLimitReached: ({ tagLimit }: { tagLimit: string }) => string;
  };
}
