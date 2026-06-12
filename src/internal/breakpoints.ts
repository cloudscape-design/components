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
 * The width (in px) by which a measured container can switch into a breakpoint boundary without
 * actually triggering that breakpoint switch. This makes each breakpoint edge "sticky", making
 * you have to travel a little further into the breakpoint to "lose" the previous one.
 *
 * When a JS-resolved breakpoint sits within a scrollbar-width of a boundary, switching the layout
 * can grow/shrink the page enough to toggle the viewport scrollbar, which in turn changes the
 * measured width and flips the breakpoint back — an infinite layout loop (see AWSUI-62065).
 */
const BREAKPOINT_SWITCH_OFFSET = 20;

/**
 * Get the named breakpoint for a provided width, optionally filtering to a subset of breakpoints.
 */
export function getMatchingBreakpoint<T extends readonly Breakpoint[]>(
  width: number,
  breakpointFilter?: T,
  previousBreakpoint?: Breakpoint | null
): T[number] | 'default' {
  const previousBreakpointIndex =
    previousBreakpoint === undefined || previousBreakpoint === null
      ? -1
      : BREAKPOINTS_DESCENDING.indexOf(previousBreakpoint);

  for (let i = 0; i < BREAKPOINT_MAPPING.length; i++) {
    const [breakpoint, breakpointWidth] = BREAKPOINT_MAPPING[i];
    if (breakpointFilter && breakpointFilter.indexOf(breakpoint) === -1) {
      continue;
    }
    // Based on BREAKPOINT_SWITCH_OFFSET, we either shrink or grow the breakpoint value we match against
    // depending on whether the previous breakpoint was above or below the matched one. This enables the
    // "sticky" behavior that makes the user have to resize the element further into a breakpoint boundary
    // to actually switch the breakpoint.
    let stickyBreakpointWidth = breakpointWidth;
    if (previousBreakpointIndex !== -1) {
      stickyBreakpointWidth += previousBreakpointIndex <= i ? -BREAKPOINT_SWITCH_OFFSET : BREAKPOINT_SWITCH_OFFSET;
    }
    if (width > stickyBreakpointWidth) {
      return breakpoint;
    }
  }
  return 'default';
}

export function getBreakpointValue(breakpoint: Breakpoint): number {
  return BREAKPOINT_MAPPING.find(bp => bp[0] === breakpoint)![1];
}
