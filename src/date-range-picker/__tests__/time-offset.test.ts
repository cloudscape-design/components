// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { setTimeOffset, shiftTimeOffset } from '../time-offset';

describe('Date range picker', () => {
  describe('time offset handling', () => {
    test('setTimeOffset', () => {
      expect(
        setTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: 120, endDate: 120 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T01:23:45+02:00',
        endDate: '2020-10-12T01:23:45+02:00',
      });

      expect(
        setTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: -240, endDate: -240 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T01:23:45-04:00',
        endDate: '2020-10-12T01:23:45-04:00',
      });

      expect(
        setTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45', endDate: '2020-10-12T01:23:45' },
          { startDate: 120, endDate: -240 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T01:23:45+02:00',
        endDate: '2020-10-12T01:23:45-04:00',
      });

      expect(
        setTimeOffset({ type: 'relative', unit: 'second', amount: 5 }, { startDate: -240, endDate: -240 })
      ).toEqual({
        type: 'relative',
        unit: 'second',
        amount: 5,
      });

      expect(setTimeOffset(null, { startDate: 300, endDate: 300 })).toBe(null);
    });

    test('shiftTimeOffset', () => {
      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45+04:00', endDate: '2020-10-12T01:23:45-05:00' },
          { startDate: 120, endDate: 120 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-11T23:23:45',
        endDate: '2020-10-12T08:23:45',
      });

      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45Z', endDate: '2020-10-12T01:23:45+00:00' },
          { startDate: -240, endDate: -240 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-11T21:23:45',
        endDate: '2020-10-11T21:23:45',
      });

      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T01:23:45Z', endDate: '2020-10-12T01:23:45+00:00' },
          { startDate: 120, endDate: -240 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T03:23:45',
        endDate: '2020-10-11T21:23:45',
      });

      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T00:00:00+10:00', endDate: '2020-10-12T10:00:00+10:00' },
          { startDate: 10 * 60, endDate: 10 * 60 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T00:00:00',
        endDate: '2020-10-12T10:00:00',
      });

      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T00:00:00-10:00', endDate: '2020-10-12T10:00:00-10:00' },
          { startDate: -10 * 60, endDate: -10 * 60 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-12T00:00:00',
        endDate: '2020-10-12T10:00:00',
      });

      expect(
        shiftTimeOffset(
          { type: 'absolute', startDate: '2020-10-12T00:00:00+10:00', endDate: '2020-10-12T10:00:00+10:00' },
          { startDate: 0, endDate: 0 }
        )
      ).toEqual({
        type: 'absolute',
        startDate: '2020-10-11T14:00:00',
        endDate: '2020-10-12T00:00:00',
      });
    });
  });
});
