// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { treatAsNumber } from '../column-widths-utils';

describe('treatAsNumber', () => {
  test('plain number', () => {
    expect(treatAsNumber(10)).toBe(true);
    expect(treatAsNumber(-1)).toBe(true);
    expect(treatAsNumber(23.123987)).toBe(true);
  });
  test('string number', () => {
    expect(treatAsNumber('10')).toBe(true);
    expect(treatAsNumber('-1')).toBe(true);
    expect(treatAsNumber('23.129847')).toBe(true);
  });
  test('percentages and other number-like strings', () => {
    expect(treatAsNumber('10%')).toBe(false);
    expect(treatAsNumber('23rem')).toBe(false);
  });
  test('plain strings', () => {
    expect(treatAsNumber('nothing')).toBe(false);
    expect(treatAsNumber('')).toBe(false);
  });
});
