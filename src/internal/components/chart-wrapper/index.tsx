// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { BaseComponentProps, getBaseProps } from '../../base-component/index.js';
import InternalBox from '../../../box/internal.js';
import InternalSpaceBetween from '../../../space-between/internal.js';

interface ChartWrapperProps extends BaseComponentProps {
  fitHeight: boolean;
  defaultFilter: React.ReactNode;
  additionalFilters: React.ReactNode;
  reserveFilterSpace: boolean;
  reserveLegendSpace: boolean;
  chartStatus: React.ReactNode;
  chart: React.ReactNode;
  legend: React.ReactNode;
  onBlur?(event: React.FocusEvent): void;
  contentClassName?: string;
  contentMinHeight?: number;
}

export const ChartWrapper = forwardRef(
  (
    {
      defaultFilter,
      additionalFilters,
      reserveFilterSpace,
      reserveLegendSpace,
      chartStatus,
      chart,
      legend,
      onBlur,
      contentClassName,
      contentMinHeight,
      fitHeight,
      ...props
    }: ChartWrapperProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const baseProps = getBaseProps(props);

    const filtersNode = (defaultFilter || additionalFilters) && (
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
    );

    const legendNode = legend && <InternalBox margin={{ top: 'm' }}>{legend}</InternalBox>;

    if (fitHeight) {
      return (
        <div
          ref={ref}
          {...baseProps}
          className={clsx(baseProps.className, styles.wrapper, styles['wrapper--fit-height'])}
          onBlur={onBlur}
        >
          <div className={clsx(styles['inner-wrapper'], styles['inner-wrapper--fit-height'])}>
            {filtersNode}

            <div
              className={clsx(styles.content, contentClassName, {
                [styles['content--reserve-filter']]: reserveFilterSpace,
                [styles['content--reserve-legend']]: reserveLegendSpace,
                [styles['content--fit-height']]: true,
              })}
            >
              {chartStatus}
              {chart}
            </div>

            {legendNode}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} {...baseProps} className={clsx(baseProps.className, styles.wrapper)} onBlur={onBlur}>
        {filtersNode}

        <div
          className={clsx(styles.content, contentClassName, {
            [styles['content--reserve-filter']]: reserveFilterSpace,
            [styles['content--reserve-legend']]: reserveLegendSpace,
          })}
          style={{ minHeight: contentMinHeight }}
        >
          {chartStatus}
          {chart}
        </div>

        {legendNode}
      </div>
    );
  }
);
