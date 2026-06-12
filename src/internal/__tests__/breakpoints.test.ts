// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getBreakpointValue, getMatchingBreakpoint, matchBreakpointMapping } from '../breakpoints';

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

  describe('previousBreakpoint', () => {
    // xs boundary is 688px. The dead-band is +/- 20px around it: [668, 708].
    it('does not switch down when the width shrinks slightly below the boundary', () => {
      // Width drops to 680 (e.g. a 17px scrollbar appeared) but we were already at "xs".
      expect(getMatchingBreakpoint(680, undefined, 'xs')).toBe('xs');
    });

    it('does not switch up when the width grows slightly above the boundary', () => {
      // Width rises to 695 but we were at "xxs"; still within the dead-band.
      expect(getMatchingBreakpoint(695, undefined, 'xxs')).toBe('xxs');
    });

    it('switches down once the width clears the boundary by more than the margin', () => {
      expect(getMatchingBreakpoint(665, undefined, 'xs')).toBe('xxs');
    });

    it('switches up once the width clears the boundary by more than the margin', () => {
      expect(getMatchingBreakpoint(710, undefined, 'xxs')).toBe('xs');
    });

    it('uses nominal thresholds when no previous breakpoint is provided', () => {
      expect(getMatchingBreakpoint(680)).toBe('xxs');
      expect(getMatchingBreakpoint(695)).toBe('xs');
      expect(getMatchingBreakpoint(680, undefined, null)).toBe('xxs');
    });

    it('prevents oscillation across a scrollbar-width toggle near a boundary', () => {
      const scrollbar = 17;
      // Start just above the xs boundary with no scrollbar.
      const wideWidth = 695;
      const narrowWidth = wideWidth - scrollbar; // 678, scrollbar present

      // First (initial) resolution uses nominal thresholds -> "xs".
      let breakpoint = getMatchingBreakpoint(wideWidth);
      expect(breakpoint).toBe('xs');

      // Scrollbar appears, width shrinks: stickiness keeps us at "xs".
      breakpoint = getMatchingBreakpoint(narrowWidth, undefined, breakpoint);
      expect(breakpoint).toBe('xs');

      // Scrollbar disappears, width grows back: still "xs". Stable, no flip-flop.
      breakpoint = getMatchingBreakpoint(wideWidth, undefined, breakpoint);
      expect(breakpoint).toBe('xs');
    });

    it('applies stickiness together with a breakpoint filter', () => {
      // "xs" filtered out -> nominal would fall back to "xxs"; with previous "xs" stays sticky is
      // not possible (filtered), so it resolves within the allowed set.
      expect(getMatchingBreakpoint(680, ['default', 'xxs', 's'], 'xxs')).toBe('xxs');
    });
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
