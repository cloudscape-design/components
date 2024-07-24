// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { arc, PieArcDatum } from 'd3-shape';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { PieChartProps } from './interfaces';
import { InternalChartDatum } from './pie-chart';
import ResponsiveText from './responsive-text';
import { balanceLabelNodes, computeSmartAngle, Dimension } from './utils';

import styles from './styles.css.js';

export interface LabelsProps<T> {
  pieData: PieArcDatum<InternalChartDatum<T>>[];
  visibleDataSum: number;
  dimensions: Dimension;
  hideTitles: boolean;
  hideDescriptions: boolean;
  highlightedSegment: PieChartProps.Datum | null;
  segmentDescription?: PieChartProps.SegmentDescriptionFunction<T>;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface LabelElementProps {
  x: number;
  y: number;
  rightSide: boolean;
  hideTitles: boolean;
  hideDescriptions: boolean;
  title: PieChartProps.Datum['title'];
  description?: string;
  containerBoundaries: null | { left: number; right: number };
}

function LabelElement({
  x,
  y,
  hideTitles,
  hideDescriptions,
  rightSide,
  title,
  description,
  containerBoundaries,
}: LabelElementProps) {
  return (
    <g className={styles['label-text']} transform="" data-x={x} data-y={y}>
      {!hideTitles && (
        <ResponsiveText x={x} y={y} rightSide={rightSide} containerBoundaries={containerBoundaries}>
          {title}
        </ResponsiveText>
      )}
      {!hideDescriptions && description && (
        <ResponsiveText
          x={x}
          y={y + (hideTitles ? 0 : 18)}
          rightSide={rightSide}
          className={styles.label__description}
          containerBoundaries={containerBoundaries}
        >
          {description}
        </ResponsiveText>
      )}
    </g>
  );
}

export default <T extends PieChartProps.Datum>({
  pieData,
  dimensions,
  highlightedSegment,
  segmentDescription,
  visibleDataSum,
  hideTitles,
  hideDescriptions,
  containerRef,
}: LabelsProps<T>) => {
  const containerBoundaries = useElementBoundaries(containerRef);
  const shouldOptimizeLabels =
    containerBoundaries.right - containerBoundaries.left - (dimensions.outerRadius + dimensions.innerLabelPadding) * 2 <
    300;
  const markers = useMemo(() => {
    const { outerRadius: radius, innerLabelPadding } = dimensions;

    // More arc factories for the label positioning
    const arcMarkerStart = arc<PieArcDatum<any>>()
      .innerRadius(radius - 1)
      .outerRadius(radius - 1);

    const arcMarkerBreak = arc<PieArcDatum<any>>()
      .innerRadius(radius + innerLabelPadding)
      .outerRadius(radius + innerLabelPadding);

    return pieData.map((datum, i) => {
      const labelDatum = pieData[i];
      const smartAngle = computeSmartAngle(labelDatum.startAngle, labelDatum.endAngle, shouldOptimizeLabels);

      // Make the marker line longer if the segment is closer to the top or bottom of the chart
      const lineExtension = 0.5 * Math.cos(2 * smartAngle) + 0.5;
      arcMarkerBreak.outerRadius(radius + 20 * lineExtension);
      arcMarkerBreak.innerRadius(radius + 20 * lineExtension);
      const [startX, startY] = arcMarkerStart.centroid({ ...datum, startAngle: smartAngle, endAngle: smartAngle });
      const [breakX, breakY] = arcMarkerBreak.centroid({ ...datum, startAngle: smartAngle, endAngle: smartAngle });

      const rightSide = smartAngle < Math.PI;
      const endX = shouldOptimizeLabels ? breakX + 20 * (rightSide ? 1 : -1) : (radius + 20) * (rightSide ? 1 : -1);
      const textX = endX + 5 * (rightSide ? 1 : -1);

      return {
        startX,
        startY,
        breakX,
        breakY,
        endX,
        endY: breakY,
        textX,
        textY: breakY,
        rightSide,
        datum,
      };
    });
  }, [pieData, dimensions, shouldOptimizeLabels]);

  const rootRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    // Relax labels that are overlapping
    const labelNodes = rootRef.current.querySelectorAll<SVGGElement>(`.${styles['label-text']}`);
    balanceLabelNodes(labelNodes, markers, false, dimensions.outerRadius + dimensions.innerLabelPadding);
    balanceLabelNodes(labelNodes, markers, true, dimensions.outerRadius + dimensions.innerLabelPadding);
  }, [markers, pieData, dimensions]);

  return (
    <g className={styles.markers} aria-hidden="true" ref={rootRef}>
      {markers.map(({ startX, startY, breakX, breakY, endX, endY, textX, textY, rightSide, datum }) => {
        const segment = datum.data.datum;
        const description = segmentDescription?.(segment, visibleDataSum);
        if ((hideTitles && !description) || (hideDescriptions && !segment.title)) {
          return null;
        }
        return (
          <g
            key={datum.data.index}
            className={clsx(styles.label, {
              [styles['label--highlighted']]: highlightedSegment === segment,
              [styles['label--dimmed']]: highlightedSegment !== null && highlightedSegment !== segment,
              [styles['label--align-right']]: !rightSide,
            })}
          >
            <line x1={startX} y1={startY} x2={breakX} y2={breakY} />
            <line x1={breakX} y1={breakY} x2={endX} y2={endY} className={styles['label-line']} />
            <LabelElement
              x={textX}
              y={textY}
              rightSide={rightSide}
              title={segment.title}
              description={description}
              hideTitles={hideTitles}
              hideDescriptions={hideDescriptions}
              containerBoundaries={containerBoundaries}
            />
          </g>
        );
      })}
    </g>
  );
};

function useElementBoundaries(ref: React.RefObject<HTMLElement>): { left: number; right: number } {
  const [state, setState] = useState({ left: 0, right: 0 });
  useResizeObserver(ref, entry => {
    const elementRect = entry.target.getBoundingClientRect();
    setState({ left: elementRect.left, right: elementRect.right });
  });
  return state;
}
