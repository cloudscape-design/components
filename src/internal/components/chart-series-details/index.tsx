// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import InternalBox from '../../../box/internal';
import { ChartDetailPair, ChartDetailLink } from '../../../pie-chart/interfaces';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import ExpandableSection from '../../../expandable-section/internal';
import Link from '../../../link/internal';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  details?: ReadonlyArray<{ key: string; value: number | string }>;
  detailsOpen?: boolean;
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
        {details.map(({ key, value, markerType, color, isDimmed, details, detailsOpen, link }, index) => (
          <li
            key={index}
            className={clsx({
              [styles.dimmed]: isDimmed,
              [styles['list-item']]: true,
              [styles['with-details']]: details,
            })}
          >
            {details ? (
              <div className={styles.key}>
                {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                <div style={{ width: '100%' }}>
                  <ExpandableSection
                    variant="compact"
                    headerText={key}
                    defaultExpanded={detailsOpen}
                    headerActions={<Value value={value} link={link} expandable={true} />}
                  >
                    {details.map(({ key, value }) => (
                      <div key={key} className={styles['inner-list-item']}>
                        <span className={styles.key}>{key}</span>
                        <Value value={value} />
                      </div>
                    ))}
                  </ExpandableSection>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.key}>
                  {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                  <span>{key}</span>
                </div>
                <Value value={value} link={link} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Value({ value, link, expandable }: { value: string | number; link?: ChartDetailLink; expandable?: boolean }) {
  return (
    <InternalBox textAlign="right">
      <span className={clsx(styles.value, expandable && styles['expandable-value'], link && styles['value-link'])}>
        {link ? (
          <Link href={link.href} external={link.external}>
            {value}
          </Link>
        ) : (
          value
        )}
      </span>
    </InternalBox>
  );
}
