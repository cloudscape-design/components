// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentFormatFunction } from '../i18n/context';
import { PieChartProps } from './interfaces';
import styles from './styles.css.js';

export interface Dimension {
  innerRadius: number;
  outerRadius: number;
  padding: number;
  paddingLabels: number;
  innerLabelPadding: number;
  cornerRadius?: number;
}

const paddingLabels = 44; // = 2 * (size-lineHeight-body-100)
const defaultPadding = 12; // = space-s
const smallPadding = 8; // = space-xs

export const dimensionsBySize: Record<NonNullable<PieChartProps['size']>, Dimension> = {
  small: {
    innerRadius: 33,
    outerRadius: 50,
    innerLabelPadding: smallPadding,
    padding: smallPadding,
    paddingLabels,
  },
  medium: {
    innerRadius: 66,
    outerRadius: 100,
    innerLabelPadding: defaultPadding,
    padding: defaultPadding,
    paddingLabels,
  },
  large: {
    innerRadius: 93,
    outerRadius: 140,
    innerLabelPadding: defaultPadding,
    padding: defaultPadding,
    paddingLabels,
  },
};

export const refreshDimensionsBySize: Record<NonNullable<PieChartProps['size']>, Dimension> = {
  small: {
    ...dimensionsBySize.small,
    innerRadius: 38,
    cornerRadius: 3,
  },
  medium: {
    ...dimensionsBySize.medium,
    innerRadius: 75,
    cornerRadius: 4,
  },
  large: {
    ...dimensionsBySize.large,
    innerRadius: 105,
    cornerRadius: 5,
  },
};

/**
 * When `size` is a string ("small", "medium" or "large") the predefined pie chart element dimensions for classic and visual refresh are used.
 * When `size` is a number the outer and inner radii are computed and the rest of the dimensions are taken from the closest predefined size.
 */
export function getDimensionsBySize({
  size,
  hasLabels,
  visualRefresh,
}: {
  size: NonNullable<PieChartProps['size']> | number;
  hasLabels: boolean;
  visualRefresh?: boolean;
}): Dimension & { size: NonNullable<PieChartProps['size']> } {
  if (typeof size === 'string') {
    const dimensions = visualRefresh ? refreshDimensionsBySize[size] : dimensionsBySize[size];
    return { ...dimensions, size };
  }
  const sizeSpec = visualRefresh ? refreshDimensionsBySize : dimensionsBySize;
  const getPixelSize = (d: Dimension) => d.outerRadius * 2 + d.padding * 2 + (hasLabels ? d.paddingLabels : 0) * 2;

  let matchedSize: NonNullable<PieChartProps['size']> = 'small';
  if (size > getPixelSize(sizeSpec.medium)) {
    matchedSize = 'medium';
  }
  if (size > getPixelSize(sizeSpec.large)) {
    matchedSize = 'large';
  }

  const padding = sizeSpec[matchedSize].padding;
  const paddingLabels = hasLabels ? sizeSpec[matchedSize].paddingLabels : 0;
  const radiiRatio = sizeSpec[matchedSize].outerRadius / sizeSpec[matchedSize].innerRadius;
  const outerRadius = (size - 2 * paddingLabels - 2 * padding) / 2;
  const innerRadius = outerRadius / radiiRatio;

  return { ...sizeSpec[matchedSize], outerRadius, innerRadius, size: matchedSize };
}

export const defaultDetails =
  (i18n: ComponentFormatFunction<'pie-chart'>, i18nStrings: PieChartProps.I18nStrings) =>
  (datum: PieChartProps.Datum, dataSum: number) =>
    [
      { key: i18n('i18nStrings.detailsValue', i18nStrings.detailsValue) || '', value: datum.value },
      {
        key: i18n('i18nStrings.detailsPercentage', i18nStrings.detailsPercentage) || '',
        value: `${((datum.value * 100) / dataSum).toFixed(0)}%`,
      },
    ];

/**
 * Adjusts the position of the given label nodes to avoid visual overlapping.
 * @param nodes List of label nodes of the entire chart (both left and right side)
 * @param markers Markers array that was calculated in <Labels>, but we just need the `endY` values
 * @param leftSide Boolean flag whether we are processing the left or right side of the chart labels
 */
export const balanceLabelNodes = (
  nodes: NodeListOf<SVGGElement>,
  markers: Array<{ endY: number; endX: number }>,
  leftSide: boolean,
  radius: number
) => {
  const MARGIN = 10;

  let previousBBox: { x: number; y: number; height: number } | null = null;

  // When traversing the right side of labels, we start at the beginning of the array and go forwards.
  // For the left side, we need to traverse backwards from the end, so that overlapping nodes are pushed down in the right order.
  let i = leftSide ? nodes.length - 1 : 0;

  while ((leftSide && i >= 0) || (!leftSide && i < nodes.length)) {
    const node = nodes[i];

    // Currently using dataset attributes to determine the base position.
    // This implementation can be changed back to using `getBBox` when we drop IE11 support.
    // Unfortunately, there is no good alternative for `getBBox` that is supported by IE11.
    // `getBoundingClientRect` works for width and height calculations in SVG, but the x/y positions are inaccurate.
    const x = parseFloat(node.getAttribute('data-x') || '0');
    const y = parseFloat(node.getAttribute('data-y') || '0');
    const box = {
      x,
      y,
      height: node.getBoundingClientRect().height,
    };

    const marker = markers[i];

    if (leftSide) {
      i--;
    } else {
      i++;
    }

    if (!previousBBox) {
      previousBBox = box;
      node.setAttribute('transform', '');
      continue;
    }

    if ((!leftSide && box.x < 0) || (leftSide && box.x >= 0)) {
      // We have reached a label that is on the other side of the chart, so we're done.
      break;
    }

    node.setAttribute('transform', '');

    // Calculate how much the current node is overlapping with the previous one.
    const yOffset = previousBBox.y + previousBBox.height + MARGIN - box.y;

    if (yOffset > 0) {
      const xOffset = computeXOffset(box, yOffset, radius) * (leftSide ? -1 : 1);
      // Move the label down.
      node.setAttribute('transform', `translate(${xOffset} ${yOffset})`);

      // Adjust the attached line accordingly.
      const lineNode = node.parentNode?.querySelector(`.${styles['label-line']}`);
      if (lineNode) {
        const { endY, endX } = marker;
        lineNode.setAttribute('y2', '' + (endY + yOffset));
        lineNode.setAttribute('x2', '' + (endX + xOffset));
      }

      // Update the position accordingly to inform the next label
      box.y += yOffset;
      box.x += xOffset;
    }

    previousBBox = box;
  }
};

const squareDistance = (edge: Array<number>): number => Math.pow(edge[0], 2) + Math.pow(edge[1], 2);

const computeXOffset = (box: { x: number; y: number; height: number }, yOffset: number, radius: number): number => {
  const edges = [
    [box.x, box.y + yOffset],
    [box.x, box.y + box.height + yOffset],
  ];
  const closestEdge = squareDistance(edges[0]) < squareDistance(edges[1]) ? edges[0] : edges[1];

  if (squareDistance(closestEdge) < Math.pow(radius, 2)) {
    return Math.sqrt(Math.pow(radius, 2) - Math.pow(closestEdge[1], 2)) - Math.abs(closestEdge[0]);
  }
  return 0;
};

export const computeSmartAngle = (startAngle: number, endAngle: number, optimize = false): number => {
  if (!optimize || endAngle - startAngle < Math.PI / 20) {
    return startAngle + (endAngle - startAngle) / 2;
  }
  const paddedStartAngle = startAngle + Math.PI / 40;
  const paddedEndAngle = endAngle - Math.PI / 40;
  if (paddedStartAngle < 0 && paddedEndAngle > 0) {
    return 0;
  }
  if (paddedStartAngle < Math.PI && paddedEndAngle > Math.PI) {
    return Math.PI;
  }

  const endAngleMinDistance = Math.min(
    paddedEndAngle,
    Math.abs(Math.PI - paddedEndAngle),
    2 * Math.PI - paddedEndAngle
  );
  const startAngleMinDistance = Math.min(
    paddedStartAngle,
    Math.abs(Math.PI - paddedStartAngle),
    2 * Math.PI - paddedStartAngle
  );
  if (endAngleMinDistance < startAngleMinDistance) {
    return paddedEndAngle;
  }
  return paddedStartAngle;
};
