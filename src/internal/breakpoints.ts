// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export type Breakpoint = 'default' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';

const BREAKPOINT_MAPPING: [Breakpoint, number][] = [
  ['xl', 1840],
  ['l', 1320],
  ['m', 1120],
  ['s', 912],
  ['xs', 688],
  ['xxs', 465],
  ['default', -1],
];

export const mobileBreakpoint = BREAKPOINT_MAPPING.filter(b => b[0] === 'xs')[0][1];

const BREAKPOINTS_DESCENDING = BREAKPOINT_MAPPING.map(([bp]) => bp);

/**
 * Take a breakpoint mapping and return the breakpoint value that most closely matches the actual breakpoint.
 */
export function matchBreakpointMapping<T>(subset: Partial<Record<Breakpoint, T>>, actual: Breakpoint): T | null {
  const qualifyingBreakpoints = BREAKPOINT_MAPPING.slice(BREAKPOINTS_DESCENDING.indexOf(actual));
  for (const [breakpoint] of qualifyingBreakpoints) {
    const breakpointValue = subset[breakpoint];
    if (breakpointValue !== undefined) {
      return breakpointValue;
    }
  }
  return null;
}

/**
 * Get the named breakpoint for a provided width, optionally filtering to a subset of breakpoints.
 */
export function getMatchingBreakpoint<T extends readonly Breakpoint[]>(
  width: number,
  breakpointFilter?: T
): T[number] | 'default' {
  for (const [breakpoint, breakpointWidth] of BREAKPOINT_MAPPING) {
    if (width > breakpointWidth && (!breakpointFilter || breakpointFilter.indexOf(breakpoint) !== -1)) {
      return breakpoint;
    }
  }
  return 'default';
}

export function getBreakpointValue(breakpoint: Breakpoint): number {
  return BREAKPOINT_MAPPING.find(bp => bp[0] === breakpoint)![1];
}
