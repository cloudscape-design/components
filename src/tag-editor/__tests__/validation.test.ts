// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  awsPrefixCheck,
  emptyKeyCheck,
  maxKeyLengthCheck,
  duplicateKeyCheck,
  maxValueLengthCheck,
  invalidCharCheck,
  validate,
} from '../../../lib/components/tag-editor/validation';

import { i18nStrings, MAX_KEY_LENGTH, MAX_VALUE_LENGTH } from './common';

let mockFormatFn = jest.fn();

describe('validation', () => {
  beforeEach(() => {
    mockFormatFn = jest.fn((_key, fallback) => fallback);
  });

  afterEach(() => {
    mockFormatFn.mockReset();
  });

  test('should return undefined if no errors for a tag', () => {
    expect(validate([{ key: 'key-1', value: 'value-1', existing: false }], [true], mockFormatFn, i18nStrings)).toEqual([
      undefined,
    ]);
  });

  test('should return an empty key error', () => {
    mockFormatFn.mockImplementationOnce(() => i18nStrings.emptyKeyError);
    expect(validate([{ key: '', value: '', existing: false }], [true], mockFormatFn, undefined)).toEqual([
      {
        key: i18nStrings.emptyKeyError,
        value: undefined,
      },
    ]);
    expect(mockFormatFn).toHaveBeenCalledWith('i18nStrings.emptyKeyError', undefined);
  });

  test('should return an aws prefix error', () => {
    mockFormatFn.mockImplementationOnce(() => i18nStrings.awsPrefixError);
    expect(validate([{ key: 'aws:', value: '', existing: false }], [true], mockFormatFn, undefined)).toEqual([
      {
        key: i18nStrings.awsPrefixError,
        value: undefined,
      },
    ]);
    expect(mockFormatFn).toHaveBeenCalledWith('i18nStrings.awsPrefixError', undefined);
  });

  test('should return an invalid key error', () => {
    mockFormatFn.mockImplementationOnce(() => i18nStrings.invalidKeyError);
    expect(validate([{ key: '!', value: '', existing: false }], [true], mockFormatFn, undefined)).toEqual([
      {
        key: i18nStrings.invalidKeyError,
        value: undefined,
      },
    ]);
    expect(mockFormatFn).toHaveBeenCalledWith('i18nStrings.invalidKeyError', undefined);
  });

  test('should return a max key length error', () => {
    mockFormatFn.mockImplementationOnce(() => i18nStrings.maxKeyCharLengthError);
    expect(
      validate(
        [{ key: generateString(MAX_KEY_LENGTH + 1), value: '', existing: false }],
        [true],
        mockFormatFn,
        undefined
      )
    ).toEqual([
      {
        key: i18nStrings.maxKeyCharLengthError,
        value: undefined,
      },
    ]);
    expect(mockFormatFn).toHaveBeenCalledWith('i18nStrings.maxKeyCharLengthError', undefined);
  });

  test('should return a duplicate key error', () => {
    mockFormatFn.mockImplementation(() => i18nStrings.duplicateKeyError);
    expect(
      validate(
        [
          { key: 'key-1', value: '', existing: false },
          { key: 'key-1', value: '', existing: false },
        ],
        [true, true],
        mockFormatFn,
        undefined
      )
    ).toEqual([
      {
        key: i18nStrings.duplicateKeyError,
        value: undefined,
      },
      {
        key: i18nStrings.duplicateKeyError,
        value: undefined,
      },
    ]);
    expect(mockFormatFn).toHaveBeenCalledWith('i18nStrings.duplicateKeyError', undefined);
  });

  test('should return an invalid value error when not marked for removal', () => {
    expect(validate([{ key: 'key-1', value: '!', existing: false }], [true], mockFormatFn, i18nStrings)).toEqual([
      {
        key: undefined,
        value: i18nStrings.invalidValueError,
      },
    ]);
  });

  test('should return an a max value length error when not marked for removal', () => {
    expect(
      validate(
        [{ key: 'key-1', value: generateString(MAX_VALUE_LENGTH + 1), existing: false }],
        [true],
        mockFormatFn,
        i18nStrings
      )
    ).toEqual([
      {
        key: undefined,
        value: i18nStrings.maxValueCharLengthError,
      },
    ]);
  });

  test('should not return any value errors if tag is marked for removal', () => {
    expect(
      validate(
        [{ key: 'key-1', value: '!', existing: true, markedForRemoval: true }],
        [true],
        mockFormatFn,
        i18nStrings
      )
    ).toEqual([undefined]);
    expect(
      validate(
        [{ key: 'key-1', value: generateString(MAX_VALUE_LENGTH + 1), existing: true, markedForRemoval: true }],
        [true],
        mockFormatFn,
        i18nStrings
      )
    ).toEqual([undefined]);
  });

  test('should return errors for both keys and values', () => {
    expect(validate([{ key: '', value: '!', existing: false }], [true], mockFormatFn, i18nStrings)).toEqual([
      {
        key: i18nStrings.emptyKeyError,
        value: i18nStrings.invalidValueError,
      },
    ]);
  });
});

describe('awsPrefixCheck', () => {
  test('returns false when a given string does not begin with aws:', () => {
    expect(awsPrefixCheck('test')).toBe(false);
  });

  test('returns true when a given string that begins with aws:', () => {
    expect(awsPrefixCheck('aws:test')).toBe(true);
  });

  test('returns false when a given string that contains aws:', () => {
    expect(awsPrefixCheck('taws:t')).toBe(false);
  });

  test('should be case insensitive', () => {
    expect(awsPrefixCheck('AwS:test')).toBe(true);
  });
});

describe('emptyKeyCheck', () => {
  test('returns true when given an empty value', () => {
    expect(emptyKeyCheck('')).toBe(true);
  });

  test('returns true when given only whitespaces', () => {
    expect(emptyKeyCheck('    ')).toBe(true);
  });

  test('returns false when given a non-empty string', () => {
    expect(emptyKeyCheck('test')).toBe(false);
  });
});

describe('maxKeyLengthCheck', () => {
  test('returns false when key length is under the max length', () => {
    // Max key length is 128
    expect(maxKeyLengthCheck('key')).toBe(false);
  });

  test('returns false when key length is exactly the same as the max length', () => {
    // Max key length is 128. Given string below is 128 char length long
    expect(maxKeyLengthCheck(generateString(MAX_KEY_LENGTH))).toBe(false);
  });

  test('returns true when the key is longer than the max length', () => {
    // Max key length is 128. Given string below is 134 char length long
    expect(maxKeyLengthCheck(generateString(MAX_KEY_LENGTH + 1))).toBe(true);
  });
});

describe('duplicateKeyCheck', () => {
  test('returns false if there are no duplicate keys', () => {
    const keyCache: Record<string, number | undefined> = { tag2: 1 };
    expect(duplicateKeyCheck('tag1', keyCache)).toBe(false);
  });

  test('returns true if there is a duplicate key', () => {
    const keyCache: Record<string, number | undefined> = { tag1: 2 };
    expect(duplicateKeyCheck('tag1', keyCache)).toBe(true);
  });

  // We do not expect the presence of 2 other duplicate keys to fail empty keys to show as duplicate
  test('should only check against given key', () => {
    const keyCache: Record<string, number | undefined> = { tag2: 2, tag1: 1 };
    expect(duplicateKeyCheck('tag1', keyCache)).toBe(false);
  });
});

describe('maxValueLengthCheck', () => {
  test('returns false when value length is under the max length', () => {
    // Max value length is 256
    expect(maxValueLengthCheck('value')).toBe(false);
  });

  test('returns false when value length is exactly the same as the max length', () => {
    // Max value length is 256. Given string below is 128 char length long
    expect(maxValueLengthCheck(generateString(MAX_VALUE_LENGTH))).toBe(false);
  });

  test('returns true when the value is longer than the max length', () => {
    // Max value length is 256. Given string below is 134 char length long
    expect(maxValueLengthCheck(generateString(MAX_VALUE_LENGTH + 1))).toBe(true);
  });
});

describe('invalidCharCheck', () => {
  // Expected: The allowed characters for tags are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
  test('returns false when a string contains only valid characters', () => {
    expect(invalidCharCheck(generateStringOfValidCharacters())).toBe(false);
  });

  test('returns false when given an empty string', () => {
    expect(invalidCharCheck('')).toBe(false);
  });

  test('returns true when given an invalid character', () => {
    const stringContainingOnlyInvalidChars = generateStringOfInvalidCharacters();
    expect(invalidCharCheck(stringContainingOnlyInvalidChars)).toBe(true);

    const stringContainingValidAndInvalidChars = generateStringOfValidCharacters() + stringContainingOnlyInvalidChars;
    expect(invalidCharCheck(stringContainingValidAndInvalidChars)).toBe(true);

    const stringContainingEmojis = '💩';
    expect(invalidCharCheck(stringContainingEmojis)).toBe(true);

    // generateStringOfInvalidCharacters method generates invalid characters as a negation of valid ones.
    // That implies that we have a correct regex in the first place.
    // However, it's easy to miss backslash, so we test it explicitly
    const backslash = '\\';
    expect(invalidCharCheck(backslash)).toBe(true);
  });
});

// Character validation is based on the current requirements in AWS.
// Current restrictions are documented here: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html#tag-restrictions
function generateStringOfValidCharacters() {
  const numbers = '0123456789';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = lowerCaseLetters.toUpperCase();
  const specialCharacters = ' +-=._:/@';
  const unicodeCharacters = 'Бöрис';

  return [numbers, lowerCaseLetters, upperCaseLetters, specialCharacters, unicodeCharacters].join('');
}

// currently generates string with following characters: !"#$%&'()*,;<>?[\]^`{|}~
function generateStringOfInvalidCharacters() {
  const validCharacterSet = new Set(generateStringOfValidCharacters().split(''));
  return Array(128)
    .fill(0)
    .map((i, index) => String.fromCharCode(index))
    .filter(c => !validCharacterSet.has(c))
    .join('');
}

function generateString(length: number): string {
  return Array(length).fill('a').join('');
}
