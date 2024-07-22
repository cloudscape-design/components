// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { add, differenceInDays } from 'date-fns';

import { ChartScale, NumericChartScale } from '../../components/cartesian-chart/scales';
import { X_TICK_COUNT_RATIO, Y_TICK_COUNT_RATIO } from './constants';
import { ChartDataTypes } from './interfaces';

// The number of ticks is currently defined by the length of the scale.
// The x scale tends to have longer labels, so we're using less ticks for it.
// These numbers are currently based on first impressions and might change in the future.
// We might also open up an API in the future to control the amount of ticks displayed.
export function getXTickCount(width: number) {
  return Math.ceil(width / X_TICK_COUNT_RATIO);
}
export function getYTickCount(height: number) {
  return Math.ceil(height / Y_TICK_COUNT_RATIO);
}

export function createXTicks(scale: ChartScale, values: number): ChartDataTypes[] {
  if (scale.isNumeric()) {
    return scale.d3Scale.ticks(values);
  } else if (scale.isTime()) {
    const rawTicks = scale.d3Scale.ticks(values) as Date[];
    const domain = scale.d3Scale.domain() as Date[];
    return uniform(rawTicks, domain[domain.length - 1]);
  } else {
    return scale.d3Scale.domain();
  }
}

export function createYTicks(scale: NumericChartScale, values: number): number[] {
  const ticks = scale.d3Scale.ticks(values);

  // The logarithmic scale sometimes produces a very large amount of (major and minor) ticks,
  // at which point we need to reduce them significantly for space.
  if (scale.scaleType === 'log' && ticks.length > 10) {
    return scale.d3Scale.ticks(3);
  }

  return ticks;
}

/**
 * Ensure uniformly-spaced ticks for 2-day intervals. d3-scale generates
 * ticks for even or odd numbers, which causes varying interval lengths
 * between months.
 */
function uniform(ticks: Date[], max: Date): Date[] {
  if (ticks.length < 3 || !isMixedDayInterval(ticks)) {
    return ticks;
  }

  return createTwoDayInterval(ticks[0], max);
}

function isMixedDayInterval(ticks: Date[]) {
  let oneDayInterval = false;
  let twoDayInterval = false;

  for (let i = 1; i < ticks.length; i++) {
    oneDayInterval = oneDayInterval || isDayInterval(ticks[i - 1], ticks[i], 1);
    twoDayInterval = twoDayInterval || isDayInterval(ticks[i - 1], ticks[i], 2);
  }
  return oneDayInterval && twoDayInterval;
}

function isDayInterval(a: Date, b: Date, difference = 1) {
  return Math.abs(differenceInDays(a, b)) === difference;
}

function createTwoDayInterval(start: Date, max: Date) {
  const result: Date[] = [];
  let curr = start;
  while (curr < max) {
    result.push(curr);
    curr = add(curr, { days: 2 });
  }
  return result;
}
