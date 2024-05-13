// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentFormatFunction } from '../i18n/context';
import { TagEditorProps } from './interfaces';

const DEFAULT_CHAR_REGEX = /^([\p{L}\p{Z}\p{N}_.:/=+\-@]*)$/u;

const SYSTEM_TAG_PREFIX = 'aws:';
const MAX_KEY_LENGTH = 128;
const MAX_VALUE_LENGTH = 256;

export interface ValidationError {
  key?: string;
  value?: string;
}

export function validate(
  tags: ReadonlyArray<TagEditorProps.Tag>,
  keyDirtyState: ReadonlyArray<boolean>,
  i18n: ComponentFormatFunction<'tag-editor'>,
  i18nStrings: TagEditorProps.I18nStrings | undefined,
  charRegex: RegExp = DEFAULT_CHAR_REGEX
): ReadonlyArray<ValidationError | undefined> {
  // Create cache to use for duplicate key check
  const tagKeysCache: Record<string, number | undefined> = {};
  tags.forEach(tag => {
    if (tag.key && !tag.markedForRemoval) {
      tagKeysCache[tag.key] = (tagKeysCache[tag.key] ?? 0) + 1;
    }
  });

  return tags.map((tag, i) => {
    let keyError: string | undefined, valueError: string | undefined;

    if (keyDirtyState[i] && emptyKeyCheck(tag.key)) {
      keyError = i18n('i18nStrings.emptyKeyError', i18nStrings?.emptyKeyError);
    } else if (awsPrefixCheck(tag.key)) {
      keyError = i18n('i18nStrings.awsPrefixError', i18nStrings?.awsPrefixError);
    } else if (invalidCharCheck(tag.key, charRegex)) {
      keyError = i18n('i18nStrings.invalidKeyError', i18nStrings?.invalidKeyError);
    } else if (maxKeyLengthCheck(tag.key)) {
      keyError = i18n('i18nStrings.maxKeyCharLengthError', i18nStrings?.maxKeyCharLengthError);
    } else if (duplicateKeyCheck(tag.key, tagKeysCache)) {
      keyError = i18n('i18nStrings.duplicateKeyError', i18nStrings?.duplicateKeyError);
    }

    if (!tag.markedForRemoval) {
      if (invalidCharCheck(tag.value, charRegex)) {
        valueError = i18n('i18nStrings.invalidValueError', i18nStrings?.invalidValueError);
      } else if (maxValueLengthCheck(tag.value)) {
        valueError = i18n('i18nStrings.maxValueCharLengthError', i18nStrings?.maxValueCharLengthError);
      }
    }

    if (keyError || valueError) {
      return { key: keyError, value: valueError };
    }
  });
}

export const awsPrefixCheck = (value: string) => {
  return value.toLowerCase().indexOf(SYSTEM_TAG_PREFIX) === 0;
};

export const emptyKeyCheck = (value: string) => {
  return !value || value.trim().length === 0;
};

export const maxKeyLengthCheck = (value: string) => {
  return value && value.length > MAX_KEY_LENGTH;
};

export const duplicateKeyCheck = (value: string, keyCache?: Record<string, number | undefined>) => {
  return (keyCache?.[value] ?? 0) > 1;
};

export const maxValueLengthCheck = (value: string) => {
  return value && value.length > MAX_VALUE_LENGTH;
};

export const invalidCharCheck = (value: string, validCharRegex: RegExp = DEFAULT_CHAR_REGEX) => {
  // Empty values are valid
  if (!value || !validCharRegex) {
    return false;
  }
  return !validCharRegex.test(value);
};
