// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';

import { NumericChartScale } from './scales';

import styles from './styles.css.js';

export default memo(VerticalGridLines) as typeof VerticalGridLines;

function VerticalGridLines({ ticks, scale, height }: { ticks: number[]; scale: NumericChartScale; height: number }) {
  return (
    <g aria-hidden="true">
      {ticks.map(tick => {
        const x = scale.d3Scale(tick) ?? NaN;
        return isFinite(x) && <line key={tick} className={styles.grid} x1={x} y1={0} x2={x} y2={height} />;
      })}
    </g>
  );
}
