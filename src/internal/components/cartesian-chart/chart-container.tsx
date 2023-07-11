// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';

interface CartesianChartContainerProps {
  fitHeight: boolean;
  leftAxisLabel: React.ReactNode;
  leftAxisLabelMeasure: React.ReactNode;
  bottomAxisLabel: React.ReactNode;
  chartPlot: React.ReactNode;
  popover: React.ReactNode;
}

export const CartesianChartContainer = forwardRef(
  (
    {
      fitHeight,
      leftAxisLabel,
      leftAxisLabelMeasure,
      bottomAxisLabel,
      chartPlot,
      popover,
    }: CartesianChartContainerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const withFitHeight = (className: string) => clsx(className, fitHeight && styles['fit-height']);
    return (
      <div className={withFitHeight(styles['chart-container'])} ref={ref}>
        {leftAxisLabel}

        <div className={withFitHeight(styles['chart-container-outer'])}>
          {leftAxisLabelMeasure}

          <div className={styles['chart-container-inner']}>
            <div className={withFitHeight(styles['chart-container-plot-wrapper'])}>
              <div className={withFitHeight(styles['chart-container-plot'])}>{chartPlot}</div>
            </div>

            <div className={withFitHeight(styles['chart-container-bottom-labels'])}>{bottomAxisLabel}</div>
          </div>

          {popover}
        </div>
      </div>
    );
  }
);
