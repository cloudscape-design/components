// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef, memo, useState } from 'react';

import LiveRegion from '../live-region';
import InternalBox from '../../../box/internal';
import { KeyCode } from '../../keycode';
import SeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';

export interface ChartLegendItem<T> {
  label: string;
  color: string;
  type: ChartSeriesMarkerType;
  datum: T;
}

export interface ChartLegendProps<T> {
  series: ReadonlyArray<ChartLegendItem<T>>;
  highlightedSeries: T | null;
  legendTitle?: string;
  ariaLabel?: string;
  plotContainerRef?: React.RefObject<HTMLDivElement>;
  onHighlightChange: (series: T | null) => void;
}

export default memo(ChartLegend) as typeof ChartLegend;

function ChartLegend<T>({
  series,
  onHighlightChange,
  highlightedSeries,
  legendTitle,
  ariaLabel,
  plotContainerRef,
}: ChartLegendProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightLeft = () => {
    const currentIndex = findSeriesIndex(series, highlightedSeries) || 0;
    const nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : series.length - 1;
    onHighlightChange(series[nextIndex].datum);
  };

  const highlightRight = () => {
    const currentIndex = findSeriesIndex(series, highlightedSeries) || 0;
    const nextIndex = currentIndex + 1 < series.length ? currentIndex + 1 : 0;
    onHighlightChange(series[nextIndex].datum);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.right || event.keyCode === KeyCode.left) {
      // Preventing default fixes an issue in Safari+VO when VO additionally interprets arrow keys as its commands.
      event.preventDefault();

      switch (event.keyCode) {
        case KeyCode.left:
          return highlightLeft();

        case KeyCode.right:
          return highlightRight();

        default:
          return;
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onHighlightChange(highlightedSeries || series[0].datum);
  };

  const handleBlur = (event: React.FocusEvent<Element>) => {
    setIsFocused(false);

    // We need to check if the next element to be focused inside the plot container or not
    // so we don't clear the selected legend in case we are still focusing elements ( legend elements )
    // inside the plot container
    if (
      event.relatedTarget === null ||
      !(event.relatedTarget instanceof Element) ||
      (containerRef.current &&
        !containerRef.current.contains(event.relatedTarget) &&
        !plotContainerRef?.current?.contains(event.relatedTarget))
    ) {
      onHighlightChange(null);
    }
  };

  const handleMouseOver = (s: T) => {
    if (s !== highlightedSeries) {
      onHighlightChange(s);
    }
  };

  const handleMouseLeave = () => {
    onHighlightChange(null);
  };

  const highlightedSeriesLabel = findSeriesLabel(series, highlightedSeries);

  return (
    <>
      <div
        tabIndex={0}
        className={styles.root}
        ref={containerRef}
        role="application"
        aria-label={legendTitle || ariaLabel}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {legendTitle && (
          <InternalBox fontWeight="bold" className={styles.title}>
            {legendTitle}
          </InternalBox>
        )}

        <ul className={styles.list}>
          {series.map((s, index) => {
            const someHighlighted = highlightedSeries !== null;
            const isHighlighted = highlightedSeries === s.datum;
            const isDimmed = someHighlighted && !isHighlighted;
            return (
              <li
                key={index}
                onMouseOver={handleMouseOver.bind(null, s.datum)}
                onMouseLeave={handleMouseLeave}
                className={clsx(styles.marker, {
                  [styles['marker--dimmed']]: isDimmed,
                  [styles['marker--highlighted']]: isHighlighted,
                  [styles['marker--focused']]: isHighlighted && isFocused,
                })}
                aria-disabled={isDimmed ? true : undefined}
              >
                <SeriesMarker color={s.color} type={s.type} /> {s.label}
              </li>
            );
          })}
        </ul>
      </div>

      <LiveRegion>{isFocused ? highlightedSeriesLabel : null}</LiveRegion>
    </>
  );
}

function findSeriesIndex<T>(series: ReadonlyArray<ChartLegendItem<T>>, targetSeries: null | T): undefined | number {
  for (let index = 0; index < series.length; index++) {
    if (series[index].datum === targetSeries) {
      return index;
    }
  }
  return undefined;
}

function findSeriesLabel<T>(series: ReadonlyArray<ChartLegendItem<T>>, targetSeries: null | T): null | string {
  for (const s of series) {
    if (s.datum === targetSeries) {
      return s.label;
    }
  }
  return null;
}
