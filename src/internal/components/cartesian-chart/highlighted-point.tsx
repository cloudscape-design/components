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

export interface HighlightedPointProps {
  point: null | SeriesPoint;
  role?: 'group' | 'button';
  ariaLabel?: string;
  ariaHasPopup?: boolean;
  ariaExpanded?: boolean;
}

export default memo(forwardRef(HighlightedPoint));

function HighlightedPoint(
  { point, role = 'group', ariaLabel, ariaHasPopup, ariaExpanded }: HighlightedPointProps,
  ref: React.Ref<SVGGElement>
) {
  if (!point) {
    return null;
  }

  return (
    <g ref={ref} role={role} aria-label={ariaLabel} aria-haspopup={ariaHasPopup} aria-expanded={ariaExpanded}>
      <circle
        key={point.key}
        aria-hidden="true"
        className={styles['vertical-marker-circle-active']}
        cx={point.x}
        cy={point.y}
        r={4}
        stroke={point.color}
        fill={point.color}
      />
    </g>
  );
}
