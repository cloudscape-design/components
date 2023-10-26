// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ChartDataTypes } from './interfaces';
import { ChartScale, NumericChartScale } from './scales';

const SPACE_BETWEEN = 4;

export interface FormattedTick {
  position: number;
  space: number;
  lines: string[];
}

export function formatTicks({
  ticks,
  scale,
  getLabelSpace,
  tickFormatter,
}: {
  ticks: readonly ChartDataTypes[];
  scale: ChartScale | NumericChartScale;
  getLabelSpace: (label: string) => number;
  tickFormatter?: (value: any) => string;
}): FormattedTick[] {
  return ticks.map(tick => {
    const position = scale.d3Scale(tick as any) ?? NaN;
    const label = tickFormatter ? tickFormatter(tick as any) : tick.toString();
    const lines = (label + '').split('\n');
    return { position, lines, space: Math.max(...lines.map(getLabelSpace)) };
  });
}

export function getVisibleTicks(ticks: readonly FormattedTick[], from: number, until: number, balanceTicks = false) {
  ticks = getTicksInRange(ticks, from, until);
  return balanceTicks ? getReducedTicks(ticks) : removeIntersections(ticks);
}

function getTicksInRange(ticks: readonly FormattedTick[], from: number, until: number) {
  return ticks.filter(tick => from <= tick.position - tick.space / 2 && tick.position + tick.space / 2 <= until);
}

function getReducedTicks(ticks: readonly FormattedTick[]): readonly FormattedTick[] {
  const reduceLabelRatio = findReduceLabelRatio(ticks);

  const reducedTicks = [];
  for (let index = 0; index < ticks.length; index += reduceLabelRatio) {
    reducedTicks.push(ticks[index]);
  }
  return reducedTicks;
}

// Returns a ratio such that all elements can be displayed with no intersections.
function findReduceLabelRatio(ticks: readonly FormattedTick[], ratio = 1): number {
  if (ratio >= ticks.length) {
    return ratio;
  }
  for (let i = ratio; i < ticks.length; i += ratio) {
    if (hasIntersection(ticks[i - ratio], ticks[i])) {
      return findReduceLabelRatio(ticks, ratio + 1);
    }
  }
  return ratio;
}

function removeIntersections(ticks: readonly FormattedTick[]) {
  const visibleTicks = [];
  let prevTick = null;
  for (const tick of ticks) {
    if (!prevTick || !hasIntersection(prevTick, tick)) {
      visibleTicks.push(tick);
      prevTick = tick;
    }
  }
  return visibleTicks;
}

function hasIntersection(a: FormattedTick, b: FormattedTick) {
  const [left, right] = a.position < b.position ? [a, b] : [b, a];
  const leftEdge = left.position + left.space / 2 + SPACE_BETWEEN;
  const rightEdge = right.position - right.space / 2;
  return leftEdge > rightEdge;
}

/* istanbul ignore next */
export function getLabelBBox(element: null | SVGTextElement, label: string) {
  if (element && element.getBBox) {
    element.textContent = label;
    return element.getBBox();
  }
  return null;
}
