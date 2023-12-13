// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import InternalBox from '../../../box/internal';
import { ChartDetailPair } from '../../../pie-chart/interfaces';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
}

export interface ChartSeriesDetailsProps extends BaseComponentProps {
  details: ReadonlyArray<ChartSeriesDetailItem>;
}

export default memo(forwardRef(ChartSeriesDetails));

function ChartSeriesDetails({ details, ...restProps }: ChartSeriesDetailsProps, ref: React.Ref<HTMLDivElement>) {
  const baseProps = getBaseProps(restProps);
  const className = clsx(baseProps.className, styles.root);

  return (
    <div {...baseProps} className={className} ref={ref}>
      <ul className={styles.list}>
        {details.map(({ key, value, markerType, color, isDimmed }, index) => (
          <li
            key={index}
            className={clsx({
              [styles.dimmed]: isDimmed,
              [styles['list-item']]: true,
            })}
          >
            <div className={styles.key}>
              {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
              <span>{key}</span>
            </div>
            <InternalBox textAlign="right">{value}</InternalBox>
          </li>
        ))}
      </ul>
    </div>
  );
}
