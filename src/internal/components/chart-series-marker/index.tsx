// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../../base-component';

import styles from './styles.css.js';

export type ChartSeriesMarkerType = 'line' | 'rectangle' | 'dashed' | 'hollow-rectangle';

interface ChartSeriesMarkerProps extends BaseComponentProps {
  type: ChartSeriesMarkerType;
  color: string;
}

export default memo(ChartSeriesMarker);

function ChartSeriesMarker({ type = 'line', color }: ChartSeriesMarkerProps) {
  return (
    <span
      className={clsx(styles.marker, styles[`marker--${type}`])}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    ></span>
  );
}
