// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';
import clsx from 'clsx';

import { TICK_LENGTH, TICK_MARGIN } from './constants';
import { NumericChartScale } from './scales';

import styles from './styles.css.js';

interface EmphasizedBaselineProps {
  axis?: 'x' | 'y';
  width: number;
  height: number;
  scale: NumericChartScale;
}

export default memo(EmphasizedBaseline) as typeof EmphasizedBaseline;

function EmphasizedBaseline({ axis = 'x', width, height, scale }: EmphasizedBaselineProps) {
  // Y position of the zero baseline, if it exists
  const baselineY = scale.d3Scale(0) ?? NaN;
  const showYBaseline = axis === 'x' && isFinite(baselineY) && baselineY <= height;

  if (showYBaseline) {
    return (
      <line
        className={clsx(styles.axis, styles['axis--emphasized'])}
        x1={-TICK_MARGIN}
        x2={width}
        y1={baselineY}
        y2={baselineY}
        aria-hidden="true"
      />
    );
  }

  if (axis === 'y') {
    return (
      <line
        className={clsx(styles.axis, styles['axis--emphasized'])}
        x1={0}
        y1={0}
        x2={0}
        y2={height + TICK_LENGTH}
        aria-hidden="true"
      />
    );
  }

  return null;
}
