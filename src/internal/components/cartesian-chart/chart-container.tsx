// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import styles from './styles.css.js';

interface CartesianChartContainerProps {
  leftAxisLabel: React.ReactNode;
  leftAxisLabelMeasure: React.ReactNode;
  bottomAxisLabel: React.ReactNode;
  chartPlot: React.ReactNode;
  popover: React.ReactNode;
}

export const CartesianChartContainer = forwardRef(
  (
    { leftAxisLabel, leftAxisLabelMeasure, bottomAxisLabel, chartPlot, popover }: CartesianChartContainerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div className={styles['chart-container']} ref={ref}>
        {leftAxisLabel}

        <div className={styles['chart-container__horizontal']}>
          {leftAxisLabelMeasure}

          <div className={styles['chart-container__vertical']}>
            {chartPlot}

            {bottomAxisLabel}
          </div>

          {popover}
        </div>
      </div>
    );
  }
);
