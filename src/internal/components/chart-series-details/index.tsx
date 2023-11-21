// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import { ChartDetailPair } from '../../../pie-chart/interfaces';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import InternalExpandableSection from '../../../expandable-section/internal';
import getSeriesDetailsText from './series-details-text';

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  subItems?: ReadonlyArray<ChartDetailPair>;
  expandable?: boolean;
}

export interface ChartSeriesDetailsProps extends BaseComponentProps {
  details: ReadonlyArray<ChartSeriesDetailItem>;
  setPopoverText?: (s: string) => void;
}

export default memo(ChartSeriesDetails);

function ChartSeriesDetails({ details, setPopoverText, ...restProps }: ChartSeriesDetailsProps) {
  const baseProps = getBaseProps(restProps);
  const className = clsx(baseProps.className, styles.root);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Once the component has rendered, pass its content in plain text
  // so that it can be used by screen readers.
  useEffect(() => {
    if (setPopoverText) {
      if (detailsRef.current) {
        setPopoverText(getSeriesDetailsText(detailsRef.current));
      }
      return () => {
        setPopoverText('');
      };
    }
  }, [details, setPopoverText]);

  return (
    <div {...baseProps} className={className} ref={detailsRef}>
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
              <div className={styles['expandable-section']}>
                {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
                <ExpandableSubItems headerKey={key} headerValue={value} subItems={subItems} />
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

function SubItems({ items, expandable }: { items: ReadonlyArray<ChartDetailPair>; expandable?: boolean }) {
  return (
    <ul className={clsx(styles['sub-items'], expandable && styles.expandable)}>
      {items.map(({ key, value }, index) => (
        <li key={index} className={clsx(styles['inner-list-item'], styles['key-value-pair'])}>
          <span className={styles.key}>{key}</span>
          <span className={styles.value}>{value}</span>
        </li>
      ))}
    </ul>
  );
}

function ExpandableSubItems({
  headerKey,
  headerValue,
  subItems,
}: {
  headerKey: ReactNode;
  headerValue: ReactNode;
  subItems: ReadonlyArray<ChartDetailPair>;
}) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    // Reset expanded state to false when a different coordinate is hovered
    setExpanded(false);
  }, [subItems]);
  return (
    <div className={styles['full-width']}>
      <InternalExpandableSection
        variant="compact"
        headerText={headerKey}
        headerActions={<span className={clsx(styles.value, styles.expandable)}>{headerValue}</span>}
        expanded={expanded}
        onChange={({ detail }) => setExpanded(detail.expanded)}
      >
        <SubItems items={subItems} expandable={true} />
      </InternalExpandableSection>
    </div>
  );
}
