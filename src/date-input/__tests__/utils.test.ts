// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { generateMaskArgs, GenerateMaskArgsProps, normalizeIsoDateString } from '../utils';

describe('generateMaskArgs', () => {
  test.each([
    {
      name: 'default configuration (day granularity and slashed format)',
      props: {} as GenerateMaskArgsProps,
      expectedSeparator: '/',
      expectedInputSeparators: ['-', '.', ' '],
      expectedSegmentsLength: 3,
    },
    {
      name: 'month granularity and slashed format',
      props: { granularity: 'month' } as GenerateMaskArgsProps,
      expectedSeparator: '/',
      expectedInputSeparators: ['-', '.', ' '],
      expectedSegmentsLength: 2,
    },
    {
      name: 'day granularity and ISO format',
      props: { isIso: true } as GenerateMaskArgsProps,
      expectedSeparator: '-',
      expectedInputSeparators: ['/', '.', ' '],
      expectedSegmentsLength: 3,
    },
    {
      name: 'month granularity and ISO format',
      props: { granularity: 'month', isIso: true } as GenerateMaskArgsProps,
      expectedSeparator: '-',
      expectedInputSeparators: ['/', '.', ' '],
      expectedSegmentsLength: 2,
    },
  ])(
    'returns correct configuration for $name',
    ({ props, expectedSeparator, expectedInputSeparators, expectedSegmentsLength }) => {
      const result = generateMaskArgs(props);

      expect(result.separator).toBe(expectedSeparator);
      expect(result.inputSeparators).toEqual(expectedInputSeparators);
      expect(result.segments.length).toBe(expectedSegmentsLength);

      // Verify year segment is always present as first segment
      expect(result.segments[0]).toEqual({ min: 0, max: 9999, default: 2000, length: 4 });

      // Verify month segment is always present as second segment
      expect(result.segments[1]).toEqual({ min: 1, max: 12, length: 2 });

      // Verify day segment is present only when granularity is day
      if (expectedSegmentsLength === 3) {
        expect(result.segments[2]).toEqual({ min: 1, max: expect.any(Function), length: 2 });
      }
    }
  );
});

describe('normalizeIsoDateString', () => {
  test('normalizes date with day granularity', () => {
    expect(normalizeIsoDateString('', 'day')).toBe('');
    expect(normalizeIsoDateString('invalid', 'day')).toBe('');
    expect(normalizeIsoDateString('201', 'day')).toBe('');
    expect(normalizeIsoDateString('2012', 'day')).toBe('2012');
    expect(normalizeIsoDateString('2012-', 'day')).toBe('2012');
    expect(normalizeIsoDateString('2012-0', 'day')).toBe('2012');
    expect(normalizeIsoDateString('2012-01', 'day')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-', 'day')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-0', 'day')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-01', 'day')).toBe('2012-01-01');
    expect(normalizeIsoDateString('2012-1', 'day')).toBe('2012');
    expect(normalizeIsoDateString('2012-12', 'day')).toBe('2012-12');
    expect(normalizeIsoDateString('2012-12-1', 'day')).toBe('2012-12');
  });

  test('normalizes date with month granularity', () => {
    expect(normalizeIsoDateString('', 'month')).toBe('');
    expect(normalizeIsoDateString('invalid', 'month')).toBe('');
    expect(normalizeIsoDateString('201', 'month')).toBe('');
    expect(normalizeIsoDateString('2012', 'month')).toBe('2012');
    expect(normalizeIsoDateString('2012-', 'month')).toBe('2012');
    expect(normalizeIsoDateString('2012-0', 'month')).toBe('2012');
    expect(normalizeIsoDateString('2012-01', 'month')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-', 'month')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-0', 'month')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-01-01', 'month')).toBe('2012-01');
    expect(normalizeIsoDateString('2012-1', 'month')).toBe('2012');
    expect(normalizeIsoDateString('2012-1-1', 'month')).toBe('2012');
    expect(normalizeIsoDateString('2012-12', 'month')).toBe('2012-12');
    expect(normalizeIsoDateString('2012-12-1', 'month')).toBe('2012-12');
  });
});
