// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { generateMaskArgs, GenerateMaskArgsProps } from '../utils';

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
