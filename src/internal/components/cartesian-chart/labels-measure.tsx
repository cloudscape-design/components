// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useEffect, Fragment } from 'react';
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
  maxLabelsWidth?: number;
}

export default memo(LabelsMeasure) as typeof LabelsMeasure;

// Places the invisible left-hand side labels to calculate their maximum width.
function LabelsMeasure({ scale, ticks, tickFormatter, autoWidth, maxLabelsWidth }: LabelsMeasureProps) {
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

    const formattedValue = tickFormatter ? tickFormatter(value as any) : value.toString();
    const lines = (formattedValue + '').split('\n');

    return (
      <Fragment key={`${value}`}>
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className={styles['labels-inline-start__label']} aria-hidden="true">
            {line}
          </div>
        ))}
      </Fragment>
    );
  };

  return (
    <div
      ref={ref}
      className={clsx(styles['labels-inline-start'], styles['labels-inline-start--hidden'])}
      style={{ maxWidth: maxLabelsWidth }}
    >
      {ticks.map(labelMapper)}
    </div>
  );
}
