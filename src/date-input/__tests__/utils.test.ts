// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { generateMaskArgs, GenerateMaskArgsProps, normalizeIsoDateString } from '../utils';

describe('generateMaskArgs', () => {
  test.each([
    {
      name: 'default configuration (day granularity and slashed format)',
      props: {} as GenerateMaskArgsProps,
      expectedSeparator: '/',
      expectedInputSeparators: ['.', ' ', '-'],
      expectedSegmentsLength: 3,
    },
    {
      name: 'month granularity and slashed format',
      props: { granularity: 'month' } as GenerateMaskArgsProps,
      expectedSeparator: '/',
      expectedInputSeparators: ['.', ' ', '-'],
      expectedSegmentsLength: 2,
    },
    {
      name: 'day granularity and ISO format',
      props: { isIso: true } as GenerateMaskArgsProps,
      expectedSeparator: '-',
      expectedInputSeparators: ['.', ' ', '/'],
      expectedSegmentsLength: 3,
    },
    {
      name: 'month granularity and ISO format',
      props: { granularity: 'month', isIso: true } as GenerateMaskArgsProps,
      expectedSeparator: '-',
      expectedInputSeparators: ['.', ' ', '/'],
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
  describe('with day granularity', () => {
    test.each([
      { input: '', expected: '' },
      { input: 'invalid', expected: '' },
      { input: '2012', expected: '2012' },
      { input: '2012-', expected: '2012' },
      { input: '2012-0', expected: '2012' },
      { input: '2012-01', expected: '2012-01' },
      { input: '2012-01-', expected: '2012-01' },
      { input: '2012-01-0', expected: '2012-01' },
      { input: '2012-01-01', expected: '2012-01-01' },
      { input: '2012-1', expected: '2012' },
      { input: '2012-12-1', expected: '2012-12' },
    ])('normalizes "$input" to "$expected"', ({ input, expected }) => {
      expect(normalizeIsoDateString(input, 'day')).toBe(expected);
    });
  });

  describe('with month granularity', () => {
    test.each([
      { input: '', expected: '' },
      { input: 'invalid', expected: '' },
      { input: '2012', expected: '2012' },
      { input: '2012-', expected: '2012' },
      { input: '2012-0', expected: '2012' },
      { input: '2012-01', expected: '2012-01' },
      { input: '2012-01-01', expected: '2012-01' }, // Day part should be ignored
      { input: '2012-1', expected: '2012' },
      { input: '2012-12', expected: '2012-12' },
    ])('normalizes "$input" to "$expected"', ({ input, expected }) => {
      expect(normalizeIsoDateString(input, 'month')).toBe(expected);
    });
  });

  test('defaults to day granularity when not specified', () => {
    expect(normalizeIsoDateString('2012-01-01')).toBe('2012-01-01');
  });
});
