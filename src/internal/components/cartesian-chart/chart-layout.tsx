// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

import styles from './styles.css.js';
import clsx from 'clsx';

interface ChartLayoutProps {
  fitHeight?: boolean;
  bottomLabelsHeight: number;
  leftLabels: React.ReactNode;
  bottomLabels: React.ReactNode;
  chartPlot: React.ReactNode;
  labelsMeasure: React.ReactNode;
  popover: React.ReactNode;
}

export const ChartLayout = forwardRef(
  (
    { fitHeight, bottomLabelsHeight, leftLabels, bottomLabels, chartPlot, labelsMeasure, popover }: ChartLayoutProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div className={clsx(styles['chart-container'], fitHeight && styles['chart-container--fit-height'])} ref={ref}>
        {leftLabels}

        <div
          className={clsx(
            styles['chart-container__horizontal'],
            fitHeight && styles['chart-container__horizontal--fit-height']
          )}
        >
          {labelsMeasure}

          <div className={styles['chart-container__vertical']}>
            {fitHeight ? (
              <div className={styles['container-chart-plot-fit-height-wrapper']} style={{ bottom: bottomLabelsHeight }}>
                {chartPlot}
              </div>
            ) : (
              chartPlot
            )}

            {fitHeight ? (
              <div className={styles['container-bottom-labels-fit-height-wrapper']}>{bottomLabels}</div>
            ) : (
              bottomLabels
            )}
          </div>

          {popover}
        </div>
      </div>
    );
  }
);
