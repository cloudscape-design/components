// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import { arc, PieArcDatum } from 'd3-shape';

import { PieChartProps } from './interfaces';
import { dimensionsBySize, refreshDimensionsBySize } from './utils';
import { InternalChartDatum } from './pie-chart';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import clsx from 'clsx';

interface SegmentsProps<T> {
  pieData: Array<PieArcDatum<InternalChartDatum<T>>>;
  highlightedSegment: T | null;
  size: NonNullable<PieChartProps['size']>;
  variant: PieChartProps['variant'];
  containerRef: React.RefObject<HTMLDivElement>;
  focusedSegmentRef: React.RefObject<SVGGElement>;
  popoverTrackRef: React.RefObject<SVGCircleElement>;
  segmentAriaRoleDescription?: string;

  onClick: (datum: InternalChartDatum<T>) => void;
  onMouseOver: (datum: InternalChartDatum<T>) => void;
  onMouseOut: () => void;
}

export default function Segments<T extends PieChartProps.Datum>({
  pieData,
  highlightedSegment,
  size,
  variant,
  containerRef,
  focusedSegmentRef,
  popoverTrackRef,
  segmentAriaRoleDescription,
  onClick,
  onMouseOver,
  onMouseOut,
}: SegmentsProps<T>) {
  const isRefresh = useVisualRefresh(containerRef);

  const { arcFactory, highlightedArcFactory } = useMemo(() => {
    const dimensions = isRefresh ? refreshDimensionsBySize[size] : dimensionsBySize[size];
    const radius = dimensions.outerRadius;
    const innerRadius = variant === 'pie' ? 0 : dimensions.innerRadius;
    const cornerRadius = dimensions.cornerRadius || 0;

    const arcFactory = arc<PieArcDatum<InternalChartDatum<any>>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const highlightedArcFactory = arc<PieArcDatum<InternalChartDatum<any>>>()
      .innerRadius(radius + 4)
      .outerRadius(radius + 6);

    return {
      arcFactory,
      highlightedArcFactory,
    };
  }, [size, variant, isRefresh]);

  const centroid = useMemo(() => {
    for (const datum of pieData) {
      if (datum.data.datum === highlightedSegment) {
        const [centroidLeft, centroidTop] = arcFactory.centroid(datum);
        return { cx: centroidLeft, cy: centroidTop };
      }
    }
    return null;
  }, [highlightedSegment, pieData, arcFactory]);

  return (
    <g onMouseLeave={() => onMouseOut()}>
      {pieData.map(datum => {
        const isHighlighted = highlightedSegment === datum.data.datum;
        const isDimmed = highlightedSegment !== null && !isHighlighted;
        const arcPath = arcFactory(datum) || undefined;
        const highlightedPath = highlightedArcFactory(datum) || undefined;
        return (
          <g
            key={datum.data.index}
            onClick={() => onClick(datum.data)}
            onMouseOver={() => onMouseOver(datum.data)}
            className={clsx(styles.segment, {
              [styles['segment--highlighted']]: isHighlighted,
              [styles['segment--dimmed']]: isDimmed,
            })}
            ref={isHighlighted ? focusedSegmentRef : undefined}
            aria-label={`${datum.data.datum.title} (${datum.data.datum.value})`}
            role="button"
            aria-roledescription={segmentAriaRoleDescription}
          >
            <path d={arcPath} fill={datum.data.color} className={styles.segment__path} aria-hidden="true" />
            <path
              d={highlightedPath}
              fill={datum.data.color}
              className={clsx(styles.segment__path, styles.segment__highlight)}
              aria-hidden="true"
            />
          </g>
        );
      })}

      <circle {...centroid} ref={popoverTrackRef} r="1" opacity="0" aria-hidden="true" />
    </g>
  );
}
