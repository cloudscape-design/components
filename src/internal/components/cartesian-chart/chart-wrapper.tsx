// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { BaseComponentProps, getBaseProps } from '../../base-component';
import InternalBox from '../../../box/internal';
import InternalSpaceBetween from '../../../space-between/internal';

interface ChartWrapperProps extends BaseComponentProps {
  chartMinHeight: number;
  defaultFilter: React.ReactNode;
  additionalFilters: React.ReactNode;
  reserveFilterSpace: boolean;
  reserveLegendSpace: boolean;
  chartStatus: React.ReactNode;
  chart: React.ReactNode;
  legend: React.ReactNode;
  onBlur?(event: React.FocusEvent): void;
}

export const ChartWrapper = forwardRef(
  (
    {
      chartMinHeight,
      defaultFilter,
      additionalFilters,
      reserveFilterSpace,
      reserveLegendSpace,
      chartStatus,
      chart,
      legend,
      onBlur,
      ...props
    }: ChartWrapperProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const baseProps = getBaseProps(props);
    return (
      <div ref={ref} {...baseProps} className={clsx(baseProps.className, styles.wrapper)} onBlur={onBlur}>
        {defaultFilter && additionalFilters && (
          <InternalBox className={styles['filter-container']} margin={{ bottom: 'l' }}>
            <InternalSpaceBetween
              size="l"
              direction="horizontal"
              className={clsx({ [styles['has-default-filter']]: !!defaultFilter })}
            >
              {defaultFilter}
              {additionalFilters}
            </InternalSpaceBetween>
          </InternalBox>
        )}

        <div
          className={clsx(styles.content, {
            [styles['content--reserve-filter']]: reserveFilterSpace,
            [styles['content--reserve-legend']]: reserveLegendSpace,
          })}
          style={{ minHeight: chartMinHeight }}
        >
          {chartStatus}
          {chart}
        </div>

        {legend && <InternalBox margin={{ top: 'm' }}>{legend}</InternalBox>}
      </div>
    );
  }
);
