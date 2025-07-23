// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import MaskFormat from '../../../../../../lib/components/internal/components/masked-input/utils/mask-format';

const hourMask = { min: 0, max: 23, length: 2 };
const minuteMask = { min: 0, max: 59, length: 2 };
const secondMask = { min: 0, max: 59, length: 2 };
function createTimeMask(separator: ':' | '-', segmentsCount?: 2 | 3) {
  segmentsCount = segmentsCount ?? (Math.random() > 0.5 ? 2 : 3);
  const segments = segmentsCount === 2 ? [hourMask, minuteMask] : [hourMask, minuteMask, secondMask];
  return new MaskFormat(
    separator === ':'
      ? { separator: ':', inputSeparators: ['/', '-'], segments }
      : { separator: '-', inputSeparators: ['/', ':'], segments }
  );
}

const yearMask = { min: 0, max: 9999, default: 2000, length: 4 };
const monthMask = { min: 1, max: 12, length: 2 };
const dayMask = { min: 1, max: 31, length: 2 };
function createDateMask(separator: '/' | '-', segmentsCount?: 2 | 3) {
  segmentsCount = segmentsCount ?? (Math.random() > 0.5 ? 2 : 3);
  const segments = segmentsCount === 2 ? [yearMask, monthMask] : [yearMask, monthMask, dayMask];
  return new MaskFormat(
    separator === '/'
      ? { separator: '/', inputSeparators: ['.', '-', ' '], segments }
      : { separator: '-', inputSeparators: ['.', '/', ' '], segments }
  );
}

describe('MaskFormat', () => {
  test.each([':', '-'] as const)('tryAppendSeparator appends separator for 2-segment time mask, separator=%s', sep => {
    const maskFormat = createTimeMask(sep, 2);
    expect(maskFormat.tryAppendSeparator('1')).toBe('1');
    expect(maskFormat.tryAppendSeparator('12')).toBe(`12${sep}`);
    expect(maskFormat.tryAppendSeparator(`12${sep}12`)).toBe(`12${sep}12`);
  });

  test.each(['/', '-'] as const)('tryAppendSeparator appends separator for 3-segment date mask, separator=%s', sep => {
    const maskFormat = createDateMask(sep, 3);
    expect(maskFormat.tryAppendSeparator('1')).toBe('1');
    expect(maskFormat.tryAppendSeparator('2025')).toBe(`2025${sep}`);
    expect(maskFormat.tryAppendSeparator(`2025${sep}12`)).toBe(`2025${sep}12${sep}`);
    expect(maskFormat.tryAppendSeparator(`2025${sep}12${sep}31`)).toBe(`2025${sep}12${sep}31`);
  });

  test('isSeparator returns true when given a separator character and false otherwise', () => {
    expect(new MaskFormat({ separator: '?', inputSeparators: [], segments: [] }).isSeparator(':')).toBe(false);
    expect(new MaskFormat({ separator: ':', inputSeparators: [], segments: [] }).isSeparator(':')).toBe(true);
    expect(new MaskFormat({ separator: ':', inputSeparators: [], segments: [] }).isSeparator(' ')).toBe(false);
    expect(new MaskFormat({ separator: ' ', inputSeparators: [], segments: [] }).isSeparator(' ')).toBe(true);
    expect(new MaskFormat({ separator: '?', inputSeparators: [':'], segments: [] }).isSeparator(':')).toBe(true);
    expect(new MaskFormat({ separator: '?', inputSeparators: [':', ' '], segments: [] }).isSeparator(' ')).toBe(true);
  });

  test('isValid works correctly for 1st segment', () => {
    const maskFormat = createDateMask('/');
    expect(maskFormat.isValid('')).toBe(true);
    expect(maskFormat.isValid('2')).toBe(true);
    expect(maskFormat.isValid('20')).toBe(true);
    expect(maskFormat.isValid('202')).toBe(true);
    expect(maskFormat.isValid('2025')).toBe(true);
    expect(maskFormat.isValid('2025/')).toBe(true);
    expect(maskFormat.isValid('2025-')).toBe(false);
    expect(maskFormat.isValid(`2025//`)).toBe(false);
  });

  test('isValid works correctly for 2nd segment', () => {
    const maskFormat = createTimeMask(':', 2);
    expect(maskFormat.isValid('12:')).toBe(true);
    expect(maskFormat.isValid('12:0')).toBe(true);
    expect(maskFormat.isValid('12:00')).toBe(true);
    expect(maskFormat.isValid('12:59')).toBe(true);
    expect(maskFormat.isValid('12:60')).toBe(false);
    expect(maskFormat.isValid('12:59:')).toBe(false);
  });

  test('isValid works correctly for 3rd segment', () => {
    const maskFormat = createDateMask('-', 3);
    expect(maskFormat.isValid('2025-12')).toBe(true);
    expect(maskFormat.isValid('2025-12-')).toBe(true);
    expect(maskFormat.isValid('2025-12-0')).toBe(true);
    expect(maskFormat.isValid('2025-12-01')).toBe(true);
    expect(maskFormat.isValid('2025-12-31')).toBe(true);
    expect(maskFormat.isValid('2025-12-32')).toBe(false);
    expect(maskFormat.isValid('2025-12-01-')).toBe(false);
  });

  test('getValidValue disallows value that is greater than max', () => {
    expect(createTimeMask(':').getValidValue('24')).toBe('2');
    expect(createTimeMask('-').getValidValue('23-60')).toBe('23-6');
    expect(createTimeMask(':', 3).getValidValue('23:59:60')).toBe('23:59:6');
    expect(createDateMask('/').getValidValue('10000')).toBe('1000/');
    expect(createDateMask('/').getValidValue('9999/13')).toBe('9999/1');
    expect(createDateMask('-', 3).getValidValue('9999-12-32')).toBe('9999-12-3');
  });

  test('getValidValue disallows extra characters at the end', () => {
    expect(createTimeMask(':', 2).getValidValue('23:59:')).toBe('23:59');
    expect(createTimeMask(':', 2).getValidValue('23:590')).toBe('23:59');
    expect(createTimeMask('-', 3).getValidValue('23-59-00-')).toBe('23-59-00');
    expect(createTimeMask('-', 3).getValidValue('23-59-000')).toBe('23-59-00');
    expect(createDateMask('/', 2).getValidValue('2025/01/')).toBe('2025/01');
    expect(createDateMask('/', 2).getValidValue('2025/010')).toBe('2025/01');
    expect(createDateMask('/', 3).getValidValue('2025/01/01/')).toBe('2025/01/01');
    expect(createDateMask('/', 3).getValidValue('2025/01/010')).toBe('2025/01/01');
  });

  test('getValidValue an empty string if no valid value is possible', () => {
    expect(createTimeMask(':').getValidValue(':99')).toBe('');
    expect(createDateMask('/').getValidValue('/10000')).toBe('');
  });

  test('autoComplete completes "" value', () => {
    expect(createTimeMask(':', 2).autoComplete('')).toBe('00:00');
    expect(createTimeMask('-', 3).autoComplete('')).toBe('00-00-00');
    expect(createDateMask('/', 2).autoComplete('')).toBe('2000/01');
    expect(createDateMask('-', 3).autoComplete('')).toBe('2000-01-01');
  });

  test('autoComplete completes "0" value', () => {
    expect(createTimeMask(':', 2).autoComplete('0')).toBe('00:00');
    expect(createTimeMask('-', 3).autoComplete('0')).toBe('00-00-00');
    expect(createDateMask('/', 2).autoComplete('0')).toBe('2000/01');
    expect(createDateMask('-', 3).autoComplete('0')).toBe('2000-01-01');
  });

  test('autoComplete completes "1", "01", "001" values', () => {
    expect(createTimeMask(':', 2).autoComplete('1')).toBe('01:00');
    expect(createTimeMask(':', 2).autoComplete('01')).toBe('01:00');
    expect(createTimeMask(':', 3).autoComplete('01')).toBe('01:00:00');
    expect(createDateMask('/', 2).autoComplete('1')).toBe('2001/01');
    expect(createDateMask('/', 2).autoComplete('01')).toBe('2001/01');
    expect(createDateMask('/', 3).autoComplete('001')).toBe('2001/01/01');
  });

  test('autoComplete completes a partial values with separator', () => {
    expect(createTimeMask(':', 2).autoComplete('01:2')).toBe('01:02');
    expect(createTimeMask(':', 3).autoComplete('01:01:3')).toBe('01:01:03');
    expect(createDateMask('/', 2).autoComplete('2025/2')).toBe('2025/02');
    expect(createDateMask('/', 3).autoComplete('2025/02/3')).toBe('2025/02/03');
  });

  test('autoComplete does not change a complete value', () => {
    expect(createTimeMask(':', 2).autoComplete('01:02')).toBe('01:02');
    expect(createTimeMask(':', 3).autoComplete('01:01:03')).toBe('01:01:03');
    expect(createDateMask('/', 2).autoComplete('2025/02')).toBe('2025/02');
    expect(createDateMask('/', 3).autoComplete('2025/02/03')).toBe('2025/02/03');
  });

  test('getSegmentValueWithAddition overwrites the character at a given position in a segment', () => {
    expect(createTimeMask(':').getSegmentValueWithAddition(0, '20', '1')).toBe(10);
    expect(createTimeMask(':').getSegmentValueWithAddition(1, '20', '2')).toBe(22);
    expect(createTimeMask(':').getSegmentValueWithAddition(0, '03:15', '1')).toBe(13);
    expect(createTimeMask(':').getSegmentValueWithAddition(3, '03:15', '2')).toBe(25);
    expect(createTimeMask(':').getSegmentValueWithAddition(4, '03:15', '6')).toBe(16);
    expect(createTimeMask(':').getSegmentValueWithAddition(0, '09:50:40', '1')).toBe(19);
    expect(createTimeMask(':', 3).getSegmentValueWithAddition(7, '09:50:40', '1')).toBe(41);
    expect(createDateMask('/').getSegmentValueWithAddition(3, '1998', '9')).toBe(1999);
    expect(createDateMask('/').getSegmentValueWithAddition(5, '1998/11', '2')).toBe(21);
    expect(createDateMask('/', 3).getSegmentValueWithAddition(9, '1998/11/12', '5')).toBe(15);
  });

  test('replaceDigitsWithZeroes replaces selected digits with zeroes', () => {
    const res = (position: number, value: string) => ({ position, value });
    expect(createTimeMask(':').replaceDigitsWithZeroes('11', 0, 1)).toEqual(res(0, '01'));
    expect(createTimeMask(':').replaceDigitsWithZeroes('11', 1, 2)).toEqual(res(1, '10'));
    expect(createTimeMask(':').replaceDigitsWithZeroes('11:15', 0, 1)).toEqual(res(0, '01:15'));
    expect(createTimeMask(':').replaceDigitsWithZeroes('11:15', 3, 5)).toEqual(res(3, '11:00'));
    expect(createTimeMask(':', 3).replaceDigitsWithZeroes('09:50:40', 1, 0)).toEqual(res(1, '00:50:40'));
    expect(createTimeMask(':', 3).replaceDigitsWithZeroes('09:50:44', 7, 6)).toEqual(res(7, '09:50:40'));
    expect(createDateMask('/').replaceDigitsWithZeroes('2015', 2, 3)).toEqual(res(2, '2000'));
    expect(createDateMask('/').replaceDigitsWithZeroes('2015-12', 5, 6)).toEqual(res(5, '2015-02'));
    expect(createDateMask('/', 3).replaceDigitsWithZeroes('2015-12-02', 9, 10)).toEqual(res(9, '2015-12-01'));
  });
});
