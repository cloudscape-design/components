// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, ReactNode, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import ChartSeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import InternalExpandableSection from '../../../expandable-section/internal';
import getSeriesDetailsText from './series-details-text';

interface ChartDetailPair {
  key: ReactNode;
  value: ReactNode;
}

interface ListItemProps {
  itemKey: ReactNode;
  value: ReactNode;
  subItems?: ReadonlyArray<ChartDetailPair>;
  markerType?: ChartSeriesMarkerType;
  color?: string;
}

export interface ChartSeriesDetailItem extends ChartDetailPair {
  markerType?: ChartSeriesMarkerType;
  color?: string;
  isDimmed?: boolean;
  subItems?: ReadonlyArray<ChartDetailPair>;
  expandable?: boolean;
  seriesTitle?: string;
}
export type ExpandedSeries = Set<string>;

export interface ChartSeriesDetailsProps extends BaseComponentProps {
  details: ReadonlyArray<ChartSeriesDetailItem>;
  expandedSeries?: ExpandedSeries;
  setPopoverText?: (s: string) => void;
  setExpandedState?: (seriesTitle: string, state: boolean) => void;
}

export default memo(ChartSeriesDetails);

function ChartSeriesDetails({
  details,
  expandedSeries,
  setPopoverText,
  setExpandedState,
  ...restProps
}: ChartSeriesDetailsProps) {
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

  const isExpanded = (serieTitle: string) => !!expandedSeries && expandedSeries.has(serieTitle);

  return (
    <div {...baseProps} className={className} ref={detailsRef}>
      <ul className={styles.list}>
        {details.map(({ key, value, markerType, color, isDimmed, subItems, expandable, seriesTitle }, index) => (
          <li
            key={index}
            className={clsx({
              [styles.dimmed]: isDimmed,
              [styles['list-item']]: true,
              [styles['with-sub-items']]: subItems?.length,
              [styles.expandable]: expandable,
            })}
          >
            {subItems?.length && expandable && seriesTitle ? (
              <ExpandableSeries
                itemKey={key}
                value={value}
                markerType={markerType}
                color={color}
                subItems={subItems}
                expanded={isExpanded(seriesTitle)}
                setExpandedState={state => setExpandedState && setExpandedState(seriesTitle, state)}
              />
            ) : (
              <NonExpandableSeries
                itemKey={key}
                value={value}
                markerType={markerType}
                color={color}
                subItems={subItems}
              />
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
  expanded,
}: {
  items: ReadonlyArray<ChartDetailPair>;
  expandable?: boolean;
  expanded?: boolean;
}) {
  return (
    <ul className={clsx(styles['sub-items'], expandable && styles.expandable)}>
      {items.map(({ key, value }, index) => (
        <li
          key={index}
          className={clsx(
            styles['inner-list-item'],
            styles['key-value-pair'],
            (expanded || !expandable) && styles.announced
          )}
        >
          <span className={styles.key}>{key}</span>
          <span className={styles.value}>{value}</span>
        </li>
      ))}
    </ul>
  );
}

function ExpandableSeries({
  itemKey,
  value,
  subItems,
  markerType,
  color,
  expanded,
  setExpandedState,
}: ListItemProps &
  Required<Pick<ListItemProps, 'subItems'>> & {
    expanded: boolean;
    setExpandedState: (state: boolean) => void;
  }) {
  return (
    <div className={styles['expandable-section']}>
      {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
      <div className={styles['full-width']}>
        <InternalExpandableSection
          variant="compact"
          headerText={itemKey}
          headerActions={<span className={clsx(styles.value, styles.expandable)}>{value}</span>}
          expanded={expanded}
          onChange={({ detail }) => setExpandedState(detail.expanded)}
        >
          <SubItems items={subItems} expandable={true} expanded={expanded} />
        </InternalExpandableSection>
      </div>
    </div>
  );
}

function NonExpandableSeries({ itemKey, value, subItems, markerType, color }: ListItemProps) {
  return (
    <>
      <div className={clsx(styles['key-value-pair'], styles.announced)}>
        <div className={styles.key}>
          {markerType && color && <ChartSeriesMarker type={markerType} color={color} />}
          <span>{itemKey}</span>
        </div>
        <span className={styles.value}>{value}</span>
      </div>
      {subItems && <SubItems items={subItems} />}
    </>
  );
}
