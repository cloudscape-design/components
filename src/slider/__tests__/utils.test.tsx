// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getPercent, getStepArray, findLowerAndHigherValues } from '../../../lib/components/slider/utils';

describe('getPercent', () => {
  test('works with different min value', () => {
    expect(getPercent(100, [50, 150])).toEqual(50);
  });

  test('works with negative values', () => {
    expect(getPercent(0, [-100, 100])).toEqual(50);
  });
});

describe('getStepArray', () => {
  test('works with indivisible step', () => {
    expect(getStepArray(6, [0, 20])).toEqual([0, 6, 12, 18]);
  });

  test('works with negative numbers', () => {
    expect(getStepArray(5, [-10, 10])).toEqual([-10, -5, 0, 5, 10]);
  });

  test('works with decimals', () => {
    expect(getStepArray(0.1, [0, 1])).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    expect(getStepArray(0.1, [-1, -0.5])).toEqual([-1, -0.9, -0.8, -0.7, -0.6, -0.5]);
    expect(getStepArray(0.000000001, [0, 5e-9])).toEqual([0, 1e-9, 2e-9, 3e-9, 4e-9, 5e-9]);
  });
});

describe('findLowerAndHigherValues', () => {
  test('works as expected', () => {
    expect(findLowerAndHigherValues([0, 2, 4, 6, 8, 10], 6)).toEqual({ lower: 4, higher: 8 });
  });

  test('works with unsorted array', () => {
    expect(findLowerAndHigherValues([8, 2, 4, 10, 0, 6], 6)).toEqual({ lower: 4, higher: 8 });
  });

  test('works with no higher value', () => {
    expect(findLowerAndHigherValues([8, 2, 4, 10, 0, 6], 10)).toEqual({ lower: 8, higher: undefined });
  });

  test('works with no lower value', () => {
    expect(findLowerAndHigherValues([8, 2, 4, 10, 0, 6], 0)).toEqual({ lower: undefined, higher: 2 });
  });
});
