// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getMatchingBreakpoint, matchBreakpointMapping, getBreakpointValue } from '../breakpoints';

describe('getMatchingBreakpoint', () => {
  it('returns the correct breakpoint value', () => {
    expect(getMatchingBreakpoint(1000)).toBe('s');
  });

  it('returns "xl" for breakpoint values above the range', () => {
    expect(getMatchingBreakpoint(10000)).toBe('xl');
  });

  it('returns "default" for breakpoint values below the range', () => {
    expect(getMatchingBreakpoint(-1)).toBe('default');
  });

  it('returns the correct breakpoint if a filter includes the matched one', () => {
    expect(getMatchingBreakpoint(1000, ['s'])).toBe('s');
  });

  it('returns the closest lower breakpoint if a filter excludes the matched one', () => {
    expect(getMatchingBreakpoint(1000, ['default', 'xxs', 'xs', 'm', 'l', 'xl'])).toBe('xs');
  });

  it('returns "default" if the filter is an empty array', () => {
    expect(getMatchingBreakpoint(1000, [])).toBe('default');
  });
});

describe('matchBreakpointMapping', () => {
  it('matches the exact breakpoint if a mapping was provided for it', () => {
    expect(matchBreakpointMapping({ s: 'no', m: 'yes', l: 'no' }, 'm')).toBe('yes');
  });

  it('returns the closest lower breakpoint value if a mapping was not provided', () => {
    expect(matchBreakpointMapping({ xxs: 'no', xs: 'yes', l: 'no' }, 'm')).toBe('yes');
  });

  it('returns null if a mapping only exists for breakpoints above the provided one', () => {
    expect(matchBreakpointMapping({ s: 'no', m: 'no', l: 'no' }, 'xs')).toBeNull();
  });

  it('returns null if the object is empty', () => {
    expect(matchBreakpointMapping({}, 'xl')).toBeNull();
  });
});

describe('getBreakpointValue', () => {
  it.each([
    ['xl', 1840],
    ['l', 1320],
    ['m', 1120],
    ['s', 912],
    ['xs', 688],
    ['xxs', 465],
  ] as const)('returns correct value for %s', (breakpoint, value) => {
    expect(getBreakpointValue(breakpoint)).toBe(value);
  });

  it('returns -1 for the default breakpoint', () => {
    expect(getBreakpointValue('default')).toBe(-1);
  });
});
