// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, memo } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import InternalBox from '../../../box/internal';
import { ChartDetailPair } from '../../../pie-chart/interfaces';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import InternalExpandableSection from '../../../expandable-section/internal';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  subItems?: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
}

export interface ChartSeriesDetailsProps extends BaseComponentProps {
  details: ReadonlyArray<ChartSeriesDetailItem>;
}

export default memo(ChartSeriesDetails);

function ChartSeriesDetails({ details, ...restProps }: ChartSeriesDetailsProps) {
  const baseProps = getBaseProps(restProps);
  const className = clsx(baseProps.className, styles.root);

  return (
    <div {...baseProps} className={className}>
      <ul className={styles.list}>
        {details.map(({ key, value, markerType, color, isDimmed, subItems }, index) => (
          <li
            key={index}
            className={clsx({
              [styles.dimmed]: isDimmed,
              [styles['list-item']]: true,
              [styles['with-sub-items']]: subItems?.length,
            })}
          >
            {subItems?.length ? (
              <div className={styles.key}>
                {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                <div style={{ width: '100%' }}>
                  <InternalExpandableSection variant="compact" headerText={key} headerActions={<Value value={value} />}>
                    <ul className={styles['sub-items']}>
                      {subItems.map(({ key, value }, index) => (
                        <li key={index} className={styles['inner-list-item']}>
                          <span className={styles.key}>{key}</span>
                          <Value value={value} />
                        </li>
                      ))}
                    </ul>
                  </InternalExpandableSection>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.key}>
                  {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                  <span>{key}</span>
                </div>
                <Value value={value} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Value({ value }: { value: ReactNode }) {
  return (
    <InternalBox textAlign="right" className={styles.value}>
      {value}
    </InternalBox>
  );
}
