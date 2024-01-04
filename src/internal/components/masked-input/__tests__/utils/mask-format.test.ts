// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MaskFormat from '../../../../../../lib/components/internal/components/masked-input/utils/mask-format';

describe('MaskFormat', () => {
  const maskFormat = new MaskFormat({
    separator: ':',
    inputSeparators: ['/', '-'],
    segments: [
      { min: 1, max: 12, length: 2 },
      { min: 0, max: 59, length: 2 },
    ],
  });

  describe('tryAppendSeparator', () => {
    test('returns value with a separtor when valid', () => {
      expect(maskFormat.tryAppendSeparator('12')).toBe('12:');
    });

    test('returns value without separator when invalid', () => {
      expect(maskFormat.tryAppendSeparator('1')).toBe('1');
    });
  });

  describe('isSeparator', () => {
    test('returns true when given a separator character', () => {
      expect(maskFormat.isSeparator(':')).toBe(true);
      expect(maskFormat.isSeparator('/')).toBe(true);
      expect(maskFormat.isSeparator('-')).toBe(true);
    });

    test('returns false when given a non-separator character', () => {
      expect(maskFormat.isSeparator('a')).toBe(false);
      expect(maskFormat.isSeparator('0')).toBe(false);
      expect(maskFormat.isSeparator('!')).toBe(false);
    });
  });

  describe('isValid', () => {
    test('returns true when valid', () => {
      expect(maskFormat.isValid('')).toBe(true);
      expect(maskFormat.isValid('1')).toBe(true);
      expect(maskFormat.isValid('01')).toBe(true);
      expect(maskFormat.isValid('12')).toBe(true);
      expect(maskFormat.isValid('12:')).toBe(true);
      expect(maskFormat.isValid('12:0')).toBe(true);
      expect(maskFormat.isValid('12:00')).toBe(true);
      expect(maskFormat.isValid('12:59')).toBe(true);
    });

    test('returns false when invalid', () => {
      // Edge cases
      expect(maskFormat.isValid('abc')).toBe(false);
      expect(maskFormat.isValid(':')).toBe(false);
      expect(maskFormat.isValid(':0')).toBe(false);
      expect(maskFormat.isValid('00:00:')).toBe(false);
      expect(maskFormat.isValid('110')).toBe(false);
      expect(maskFormat.isValid('011')).toBe(false);

      // Min/max
      expect(maskFormat.isValid('00')).toBe(false);
      expect(maskFormat.isValid('13')).toBe(false);

      // Length
      expect(maskFormat.isValid('1:')).toBe(false);
    });
  });

  describe('getValidValue', () => {
    test('returns the closest valid value', () => {
      expect(maskFormat.getValidValue('99:99')).toBe('9');
      expect(maskFormat.getValidValue('99:99:99')).toBe('9');
      expect(maskFormat.getValidValue('111:99')).toBe('11:');
      expect(maskFormat.getValidValue('011')).toBe('01:');
    });

    test('returns an empty string if no valid value is possible', () => {
      expect(maskFormat.getValidValue(':99')).toBe('');
    });
  });

  describe('autoComplete', () => {
    test('should autocomplete an empty value', () => {
      expect(maskFormat.autoComplete('')).toBe('01:00');
    });

    test('should autocomplete a partial value', () => {
      expect(maskFormat.autoComplete('0')).toBe('01:00');
      expect(maskFormat.autoComplete('1')).toBe('01:00');
      expect(maskFormat.autoComplete('01')).toBe('01:00');
      expect(maskFormat.autoComplete('01:0')).toBe('01:00');
    });

    test('should not change a complete value', () => {
      expect(maskFormat.autoComplete('01:00')).toBe('01:00');
      expect(maskFormat.autoComplete('04:20')).toBe('04:20');
    });
  });

  describe('getSegmentValueWithAddition', () => {
    test('should overwrite the character at a given position in a segment', () => {
      expect(maskFormat.getSegmentValueWithAddition(0, '00:00', '1')).toBe(10);
      expect(maskFormat.getSegmentValueWithAddition(0, '11:00', '1')).toBe(11);
      expect(maskFormat.getSegmentValueWithAddition(0, '11:00', '2')).toBe(21);
      expect(maskFormat.getSegmentValueWithAddition(3, '00:00', '1')).toBe(10);
    });
  });

  describe('replaceDigitsWithZeroes', () => {
    test('replaces selected digits with zeroes', () => {
      expect(maskFormat.replaceDigitsWithZeroes('12:34', 0, 1)).toEqual({ position: 0, value: '02:34' });
      expect(maskFormat.replaceDigitsWithZeroes('12:34', 1, 2)).toEqual({ position: 1, value: '10:34' });
      expect(maskFormat.replaceDigitsWithZeroes('12:34', 1, 3)).toEqual({ position: 1, value: '10:34' });
      expect(maskFormat.replaceDigitsWithZeroes('12:34', 1, 4)).toEqual({ position: 1, value: '10:04' });
    });
  });
});
