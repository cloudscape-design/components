// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';

interface CartesianChartContainerProps {
  minHeight: number;
  fitHeight: boolean;
  leftAxisLabel: React.ReactNode;
  leftAxisLabelMeasure: React.ReactNode;
  bottomAxisLabel: React.ReactNode;
  chartPlot: React.ReactNode;
  popover: React.ReactNode;
}

const CONTENT_MIN_HEIGHT_BOUNDARY = 40;

export const CartesianChartContainer = forwardRef(
  (
    {
      minHeight,
      fitHeight,
      leftAxisLabel,
      leftAxisLabelMeasure,
      bottomAxisLabel,
      chartPlot,
      popover,
    }: CartesianChartContainerProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (fitHeight) {
      return (
        <div className={clsx(styles['chart-container'], styles['fit-height'])} ref={ref}>
          {leftAxisLabel}

          <div className={clsx(styles['chart-container-outer'], styles['fit-height'])}>
            {leftAxisLabelMeasure}

            <div className={styles['chart-container-inner']}>
              <div
                className={clsx(styles['chart-container-plot-wrapper'], styles['fit-height'])}
                style={{ minHeight: Math.max(minHeight, CONTENT_MIN_HEIGHT_BOUNDARY) }}
              >
                <div className={clsx(styles['chart-container-plot'], styles['fit-height'])}>{chartPlot}</div>
              </div>

              <div className={clsx(styles['chart-container-bottom-labels'], styles['fit-height'])}>
                {bottomAxisLabel}
              </div>
            </div>

            {popover}
          </div>
        </div>
      );
    }

    return (
      <div className={styles['chart-container']} ref={ref}>
        {leftAxisLabel}

        <div className={styles['chart-container-outer']}>
          {leftAxisLabelMeasure}

          <div className={styles['chart-container-inner']}>
            {chartPlot}
            {bottomAxisLabel}
          </div>

          {popover}
        </div>
      </div>
    );
  }
);
