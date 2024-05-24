// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  balanceLabelNodes,
  computeSmartAngle,
  getDimensionsBySize,
  dimensionsBySize,
  minLabelLineAngularPadding,
  refreshDimensionsBySize,
} from '../../../lib/components/pie-chart/utils';

// Sample test cases gathered from charts with overlapping labels and other edge cases
const testCases = [
  {
    title: 'empty',
    width: 600,
    height: 300,
    nodes: <></>,
    markers: [],
  },
  {
    title: 'one segment',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="-125" y="120">
            Test
          </text>
        </g>
      </>
    ),
    markers: [{ endY: 120, endX: -125 }],
  },
  {
    title: 'two equal segments',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="125" y="0">
            Test
          </text>
        </g>
        <g>
          <text x="-125" y="0">
            Test
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: 0, endX: 125 },
      { endY: 0, endX: -125 },
    ],
  },
  {
    title: 'heavy overlap on the right side',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="125" y="-119">
            Segment 1
          </text>
        </g>
        <g>
          <text x="125" y="-117">
            Segment 2
          </text>
        </g>
        <g>
          <text x="125" y="-113">
            Segment 3
          </text>
        </g>
        <g>
          <text x="125" y="-108">
            Segment 4
          </text>
        </g>
        <g>
          <rect x="125" y="-100">
            Segment 5
          </rect>
        </g>
        <g>
          <text x="125" y="-92">
            Segment 6
          </text>
        </g>
        <g>
          <text x="-125" y="111">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -119, endX: 125 },
      { endY: -117, endX: 125 },
      { endY: -113, endX: 125 },
      { endY: -108, endX: 125 },
      { endY: -100, endX: 125 },
      { endY: -92, endX: 125 },
      { endY: 111, endX: -125 },
    ],
  },
  {
    title: 'heavy overlap on the left side',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="125" y="111">
            Segment 1
          </text>
        </g>
        <g>
          <text x="-125" y="-92">
            Segment 2
          </text>
        </g>
        <g>
          <text x="-125" y="-100">
            Segment 3
          </text>
        </g>
        <g>
          <text x="-125" y="-108">
            Segment 4
          </text>
        </g>
        <g>
          <rect x="-125" y="-114">
            Segment 5
          </rect>
        </g>
        <g>
          <text x="-125" y="-118">
            Segment 6
          </text>
        </g>
        <g>
          <text x="-125" y="-120">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: 111, endX: 125 },
      { endY: -92, endX: -125 },
      { endY: -100, endX: -125 },
      { endY: -108, endX: -125 },
      { endY: -114, endX: -125 },
      { endY: -118, endX: -125 },
      { endY: -120, endX: -125 },
    ],
  },
  {
    title: 'heavy overlap on both sides',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="125" y="-120">
            Segment 1
          </text>
        </g>
        <g>
          <text x="125" y="-116">
            Segment 2
          </text>
        </g>
        <g>
          <text x="125" y="-109">
            Segment 3
          </text>
        </g>
        <g>
          <text x="125" y="120">
            Segment 4
          </text>
        </g>
        <g>
          <rect x="-125" y="-109">
            Segment 5
          </rect>
        </g>
        <g>
          <text x="-125" y="-118">
            Segment 6
          </text>
        </g>
        <g>
          <text x="-125" y="-120">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -120, endX: 125 },
      { endY: -118, endX: 125 },
      { endY: -109, endX: 125 },
      { endY: 120, endX: 125 },
      { endY: -109, endX: -125 },
      { endY: -118, endX: -125 },
      { endY: -120, endX: -125 },
    ],
  },
  {
    title: 'overlap on the left, but not all labels need to be moved',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="125" y="45">
            Segment 1
          </text>
        </g>
        <g>
          <text x="-125" y="45">
            Segment 2
          </text>
        </g>
        <g>
          <text x="-125" y="-45">
            Segment 3
          </text>
        </g>
        <g>
          <text x="-125" y="-113">
            Segment 4
          </text>
        </g>
        <g>
          <rect x="-125" y="-119">
            Segment 5
          </rect>
        </g>
      </>
    ),
    markers: [
      { endY: 45, endX: 125 },
      { endY: 45, endX: -125 },
      { endY: -45, endX: -125 },
      { endY: -113, endX: -125 },
      { endY: -119, endX: -125 },
    ],
  },
  {
    title: 'does not change xOffset if no vertical overlap',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="20" y="-50">
            Segment 1
          </text>
        </g>
        <g>
          <text x="20" y="-20">
            Segment 2
          </text>
        </g>
        <g>
          <text x="-20" y="50">
            Segment 3
          </text>
        </g>
        <g>
          <text x="-20" y="20">
            Segment 4
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -50, endX: 20 },
      { endY: -20, endX: 20 },
      { endY: 50, endX: -20 },
      { endY: 20, endX: -20 },
    ],
  },
  {
    title: 'changes xOffset if vertical overlap',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g>
          <text x="20" y="-50">
            Segment 1
          </text>
        </g>
        <g>
          <text x="20" y="-49">
            Segment 2
          </text>
        </g>
        <g>
          <text x="-20" y="21">
            Segment 3
          </text>
        </g>
        <g>
          <text x="-20" y="20">
            Segment 4
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -50, endX: 20 },
      { endY: -49, endX: 20 },
      { endY: 21, endX: -20 },
      { endY: 20, endX: -20 },
    ],
  },
];

describe('balanceLabelNodes', () => {
  let oldBoundingClientRect: () => DOMRect;

  beforeAll(() => {
    oldBoundingClientRect = window.SVGElement.prototype.getBoundingClientRect;
    // jsdom does not really implement SVG elements.
    // To test balanceLabelNodes we just need to return a sensible height, i.e. 16px.
    window.SVGElement.prototype.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 16,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      toJSON: () => {},
    });
    // getBBox does not work by default in jest env
    // introduced the hacky way to make it work and return proper coordinates
    // otherwise, it won't be possible to test this behaviour
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      writable: true,
      value: function () {
        const childProps = this[Object.keys(this)[0]].child.pendingProps;

        return {
          x: parseFloat(childProps?.x || '0') || 0,
          y: parseFloat(childProps?.y || '0') || 0,
        };
      },
    });
  });
  afterAll(() => {
    window.SVGElement.prototype.getBoundingClientRect = oldBoundingClientRect;
  });

  testCases.forEach(({ title, width, height, nodes, markers }) => {
    test(title, () => {
      const { container } = render(
        <svg width={width} height={height} style={{ fontSize: '14px' }}>
          <g className="labels" transform={`translate(${width / 2} ${height / 2})`}>
            {nodes}
          </g>
        </svg>
      );

      const labels = container.querySelectorAll<SVGGElement>('.labels g');
      balanceLabelNodes(labels, markers, false, 100);
      balanceLabelNodes(labels, markers, true, 100);

      expect(labels).toMatchSnapshot();
    });
  });
});

describe.each([false, true])('getDimensionsBySize visualRefresh=%s', visualRefresh => {
  const d = visualRefresh ? refreshDimensionsBySize : dimensionsBySize;

  test.each(['small', 'medium', 'large'] as const)('get correct dimensions for size="%s"', size => {
    const dimensions = getDimensionsBySize({ size, hasLabels: true, visualRefresh });
    expect(dimensions).toEqual({ ...d[size], size });
  });

  test.each([
    [d.medium.outerRadius * 2 + d.medium.padding * 2 - 1, 'small'],
    [d.large.outerRadius * 2 + d.large.padding * 2 - 1, 'medium'],
    [d.large.outerRadius * 2 + d.large.padding * 2 + 1, 'large'],
  ])('matches size correctly for height=$0 and hasLabels=false', (height, matchedSize) => {
    const dimensions = getDimensionsBySize({ size: height, hasLabels: false, visualRefresh });
    expect(dimensions.size).toBe(matchedSize);
  });

  test.each([
    [d.medium.outerRadius * 2 + d.medium.padding * 2 + d.medium.paddingLabels * 2 - 1, 'small'],
    [d.large.outerRadius * 2 + d.large.padding * 2 + d.large.paddingLabels * 2 - 1, 'medium'],
    [d.large.outerRadius * 2 + d.large.padding * 2 + d.large.paddingLabels * 2 + 1, 'large'],
  ])('matches size correctly for height=$0 and hasLabels=true', (height, matchedSize) => {
    const dimensions = getDimensionsBySize({ size: height, hasLabels: true, visualRefresh });
    expect(dimensions.size).toBe(matchedSize);
  });
});

describe('computeSmartAngle', () => {
  const pi = Math.PI;
  test('returns mid angle if optimization is disabled', () => {
    expect(computeSmartAngle(0, pi / 100)).toEqual(pi / 200);
    expect(computeSmartAngle(-1.5, 1)).toEqual(-0.25);
    expect(computeSmartAngle(2, 4)).toEqual(3);
    expect(computeSmartAngle(0, pi / 2)).toEqual(pi / 4);
  });
  test('returns mid angle if segment is too small', () => {
    expect(computeSmartAngle(0, pi / 100, true)).toEqual(pi / 200);
    expect(computeSmartAngle(0, 2 * minLabelLineAngularPadding, true)).toEqual(minLabelLineAngularPadding);
    expect(computeSmartAngle(1, 1, true)).toEqual(1);
  });
  test('returns 0 if segment contains 0 angle', () => {
    const startAngle = -1.5;
    const endAngle = 1;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(0);
  });
  test('returns PI if segment contains PI angle', () => {
    const startAngle = 2;
    const endAngle = 4;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(pi);
  });
  test('returns padded start angle if closest to 0', () => {
    const startAngle = 0;
    const endAngle = pi / 2;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(minLabelLineAngularPadding);
  });
  test('returns padded start angle if closest to PI', () => {
    const startAngle = pi;
    const endAngle = (3 * pi) / 2;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(pi + minLabelLineAngularPadding);
  });
  test('returns padded end angle if closest to 2*PI', () => {
    const startAngle = (3 * pi) / 2;
    const endAngle = 2 * pi;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(2 * pi - minLabelLineAngularPadding);
  });
  test('returns padded end angle if closest to PI', () => {
    const startAngle = pi / 2;
    const endAngle = pi;
    expect(computeSmartAngle(startAngle, endAngle, true)).toEqual(pi - minLabelLineAngularPadding);
  });
});
