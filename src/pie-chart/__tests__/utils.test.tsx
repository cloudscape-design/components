// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  balanceLabelNodes,
  getDimensionsBySize,
  dimensionsBySize,
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
        <g data-x="-125" data-y="120">
          <text x="-125" y="120">
            Test
          </text>
        </g>
      </>
    ),
    markers: [{ endY: 120 }],
  },
  {
    title: 'two equal segments',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g data-x="125" data-y="0">
          <text x="125" y="0">
            Test
          </text>
        </g>
        <g data-x="-125" data-y="0">
          <text x="-125" y="0">
            Test
          </text>
        </g>
      </>
    ),
    markers: [{ endY: 0 }, { endY: 0 }],
  },
  {
    title: 'heavy overlap on the right side',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g data-x="125" data-y="-119">
          <text x="125" y="-119">
            Segment 1
          </text>
        </g>
        <g data-x="125" data-y="-117">
          <text x="125" y="-117">
            Segment 2
          </text>
        </g>
        <g data-x="125" data-y="-113">
          <text x="125" y="-113">
            Segment 3
          </text>
        </g>
        <g data-x="125" data-y="-108">
          <text x="125" y="-108">
            Segment 4
          </text>
        </g>
        <g data-x="125" data-y="-100">
          <rect x="125" y="-100">
            Segment 5
          </rect>
        </g>
        <g data-x="125" data-y="-92">
          <text x="125" y="-92">
            Segment 6
          </text>
        </g>
        <g data-x="-125" data-y="111">
          <text x="-125" y="111">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -119 },
      { endY: -117 },
      { endY: -113 },
      { endY: -108 },
      { endY: -100 },
      { endY: -92 },
      { endY: 111 },
    ],
  },
  {
    title: 'heavy overlap on the left side',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g data-x="125" data-y="111">
          <text x="125" y="111">
            Segment 1
          </text>
        </g>
        <g data-x="-125" data-y="-92">
          <text x="-125" y="-92">
            Segment 2
          </text>
        </g>
        <g data-x="-125" data-y="-100">
          <text x="-125" y="-100">
            Segment 3
          </text>
        </g>
        <g data-x="-125" data-y="-108">
          <text x="-125" y="-108">
            Segment 4
          </text>
        </g>
        <g data-x="-125" data-y="-114">
          <rect x="-125" y="-114">
            Segment 5
          </rect>
        </g>
        <g data-x="-125" data-y="-118">
          <text x="-125" y="-118">
            Segment 6
          </text>
        </g>
        <g data-x="-125" data-y="-120">
          <text x="-125" y="-120">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: 111 },
      { endY: -92 },
      { endY: -100 },
      { endY: -108 },
      { endY: -114 },
      { endY: -118 },
      { endY: -120 },
    ],
  },
  {
    title: 'heavy overlap on both sides',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g data-x="125" data-y="-120">
          <text x="125" y="-120">
            Segment 1
          </text>
        </g>
        <g data-x="125" data-y="-116">
          <text x="125" y="-116">
            Segment 2
          </text>
        </g>
        <g data-x="125" data-y="-109">
          <text x="125" y="-109">
            Segment 3
          </text>
        </g>
        <g data-x="125" data-y="120">
          <text x="125" y="120">
            Segment 4
          </text>
        </g>
        <g data-x="-125" data-y="-109">
          <rect x="-125" y="-109">
            Segment 5
          </rect>
        </g>
        <g data-x="-125" data-y="-118">
          <text x="-125" y="-118">
            Segment 6
          </text>
        </g>
        <g data-x="-125" data-y="-120">
          <text x="-125" y="-120">
            Segment 7
          </text>
        </g>
      </>
    ),
    markers: [
      { endY: -120 },
      { endY: -118 },
      { endY: -109 },
      { endY: 120 },
      { endY: -109 },
      { endY: -118 },
      { endY: -120 },
    ],
  },
  {
    title: 'overlap on the left, but not all labels need to be moved',
    width: 600,
    height: 300,
    nodes: (
      <>
        <g data-x="125" data-y="45">
          <text x="125" y="45">
            Segment 1
          </text>
        </g>
        <g data-x="-125" data-y="45">
          <text x="-125" y="45">
            Segment 2
          </text>
        </g>
        <g data-x="-125" data-y="-45">
          <text x="-125" y="-45">
            Segment 3
          </text>
        </g>
        <g data-x="-125" data-y="-113">
          <text x="-125" y="-113">
            Segment 4
          </text>
        </g>
        <g data-x="-125" data-y="-119">
          <rect x="-125" y="-119">
            Segment 5
          </rect>
        </g>
      </>
    ),
    markers: [{ endY: 45 }, { endY: 45 }, { endY: -45 }, { endY: -113 }, { endY: -119 }],
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
      balanceLabelNodes(labels, markers, false);
      balanceLabelNodes(labels, markers, true);

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
