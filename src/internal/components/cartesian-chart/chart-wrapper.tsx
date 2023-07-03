// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import InternalBox from '../../../box/internal';
import { BaseComponentProps } from '../../base-component';

interface ChartWrapperProps {
  fitHeight?: boolean;
  height: number;
  filters: null | React.ReactNode;
  chart: null | React.ReactNode;
  legend: null | React.ReactNode;
  reserveFilterSpace: boolean;
  reserveLegendSpace: boolean;
  baseProps?: BaseComponentProps;
  className?: string;
  onBlur?: (event: React.FocusEvent) => void;
}

export const ChartWrapper = forwardRef(
  (
    {
      fitHeight,
      height,
      filters,
      chart,
      legend,
      reserveFilterSpace,
      reserveLegendSpace,
      baseProps = {},
      className,
      onBlur,
    }: ChartWrapperProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        {...baseProps}
        className={clsx(baseProps.className, className, styles.wrapper, fitHeight && styles['wrapper--fit-height'])}
        onBlur={onBlur}
      >
        <div className={clsx(styles['inner-wrapper'], fitHeight && styles['inner-wrapper--fit-height'])}>
          {filters && (
            <InternalBox className={styles['filter-container']} margin={{ bottom: 'l' }}>
              {filters}
            </InternalBox>
          )}

          <div
            className={clsx(styles.content, {
              [styles['content--reserve-filter']]: reserveFilterSpace,
              [styles['content--reserve-legend']]: reserveLegendSpace,
              [styles['content--fit-height']]: fitHeight,
            })}
            style={{ minHeight: height }}
          >
            {chart}
          </div>

          {legend && <InternalBox margin={{ top: 'm' }}>{legend}</InternalBox>}
        </div>
      </div>
    );
  }
);
