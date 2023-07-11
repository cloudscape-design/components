// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useEffect } from 'react';
import clsx from 'clsx';

import { ChartScale, NumericChartScale } from './scales';

import styles from './styles.css.js';
import { ChartDataTypes } from '../../../mixed-line-bar-chart/interfaces';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

interface LabelsMeasureProps {
  scale: ChartScale | NumericChartScale;
  ticks: readonly ChartDataTypes[];
  tickFormatter?: (value: ChartDataTypes) => string;
  autoWidth: (value: number) => void;
}

export default memo(LabelsMeasure) as typeof LabelsMeasure;

// Places the invisible left-hand side labels to calculate their maximum width.
function LabelsMeasure({ scale, ticks, tickFormatter, autoWidth }: LabelsMeasureProps) {
  const [width, ref] = useContainerQuery<number>(rect => rect.contentBoxWidth);

  // Tell elements's width to the parent.
  useEffect(() => {
    autoWidth(width || 0);
  }, [autoWidth, width]);

  const labelMapper = (value: ChartDataTypes) => {
    const scaledValue = scale.d3Scale(value as any);
    if (scaledValue === undefined || !isFinite(scaledValue)) {
      return null;
    }

    return (
      <div key={`${value}`} className={styles['labels-left__label']} aria-hidden="true">
        {tickFormatter ? tickFormatter(value as any) : value.toString()}
      </div>
    );
  };

  return (
    <div ref={ref} className={clsx(styles['labels-left'], styles['labels-left--hidden'])}>
      {ticks.map(labelMapper)}
    </div>
  );
}
