// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, memo } from 'react';

import styles from './styles.css.js';

interface SeriesPoint {
  key: string;
  x: number;
  y: number;
  color: string;
}

export interface VerticalMarkerProps {
  height: number;
  showPoints?: boolean;
  showLine?: boolean;
  points: null | readonly SeriesPoint[];
  ariaLabel?: string;
}

export default memo(forwardRef(VerticalMarker));

function VerticalMarker(
  { height, showPoints = true, showLine = true, points, ariaLabel }: VerticalMarkerProps,
  ref: React.Ref<SVGLineElement>
) {
  const [firstPoint] = points || [];

  return (
    <g>
      <line
        ref={ref}
        aria-hidden="true"
        aria-label={ariaLabel}
        className={styles['vertical-marker']}
        style={{ visibility: showLine && firstPoint ? 'visible' : 'hidden' }}
        x1={firstPoint?.x}
        x2={firstPoint?.x}
        y1={0}
        y2={height}
      />

      {showPoints &&
        points &&
        points.map(point => (
          <circle
            key={point.key}
            aria-hidden="true"
            className={styles['vertical-marker-circle']}
            cx={point.x}
            cy={point.y}
            r={4}
            stroke={point.color}
          />
        ))}
    </g>
  );
}
