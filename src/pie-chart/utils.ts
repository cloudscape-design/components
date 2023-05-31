// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentFormatFunction } from '../internal/i18n/context';
import { PieChartProps } from './interfaces';
import styles from './styles.css.js';

interface Dimension {
  innerRadius: number;
  outerRadius: number;
  padding: number;
  paddingLabels: number;
  innerLabelPadding: number;
  cornerRadius?: number;
}

export const dimensionsBySize: Record<NonNullable<PieChartProps['size']>, Dimension> = {
  small: {
    innerRadius: 33,
    outerRadius: 50,
    innerLabelPadding: 8,
    padding: 8, // = space-xs
    paddingLabels: 44, // = 2 * (size-lineHeight-body-100)
  },
  medium: {
    innerRadius: 66,
    outerRadius: 100,
    innerLabelPadding: 12,
    padding: 12, // = space-s
    paddingLabels: 44, // = 2 * (size-lineHeight-body-100)
  },
  large: {
    innerRadius: 93,
    outerRadius: 140,
    innerLabelPadding: 12,
    padding: 12, // = space-s
    paddingLabels: 44, // = 2 * (size-lineHeight-body-100)
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

export const defaultDetails =
  (i18n: ComponentFormatFunction, i18nStrings: PieChartProps.I18nStrings) =>
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
  markers: Array<{ endY: number }>,
  leftSide: boolean
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
    const offset = previousBBox.y + previousBBox.height + MARGIN - box.y;

    if (offset > 0) {
      // Move the label down.
      node.setAttribute('transform', `translate(0 ${offset})`);

      // Adjust the attached line accordingly.
      const lineNode = node.parentNode?.querySelector(`.${styles['label-line']}`);
      if (lineNode) {
        const { endY } = marker;
        lineNode.setAttribute('y2', '' + (endY + offset));
      }

      // Update the position accordingly to inform the next label
      box.y += offset;
    }

    previousBBox = box;
  }
};
