// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, memo } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import { ChartDetailPair } from '../../../pie-chart/interfaces';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import InternalExpandableSection from '../../../expandable-section/internal';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  subItems?: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
  expandable?: boolean;
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
        {details.map(({ key, value, markerType, color, isDimmed, subItems, expandable }, index) => (
          <li
            key={index}
            className={clsx({
              [styles.dimmed]: isDimmed,
              [styles['list-item']]: true,
              [styles['with-sub-items']]: subItems?.length,
              [styles.expandable]: expandable,
            })}
          >
            {subItems?.length && expandable ? (
              <div className={styles['key-value-pair']}>
                {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                <div className={styles['full-width']}>
                  <InternalExpandableSection
                    variant="compact"
                    headerText={key}
                    headerActions={<span className={clsx(styles.value, styles.expandable)}>{value}</span>}
                  >
                    <SubItems items={subItems} expandable={expandable} />
                  </InternalExpandableSection>
                </div>
              </div>
            ) : (
              <>
                <div className={styles['key-value-pair']}>
                  <div className={styles.key}>
                    {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                    <span>{key}</span>
                  </div>
                  <span className={styles.value}>{value}</span>
                </div>
                {subItems && <SubItems items={subItems} />}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubItems({
  items,
  expandable,
}: {
  items: ReadonlyArray<{ key: ReactNode; value: ReactNode }>;
  expandable?: boolean;
}) {
  return (
    <ul className={clsx(styles['sub-items'], expandable && styles.expandable)}>
      {items.map(({ key, value }, index) => (
        <li key={index} className={styles['inner-list-item']}>
          <span className={styles.key}>{key}</span>
          <span className={styles.value}>{value}</span>
        </li>
      ))}
    </ul>
  );
}
