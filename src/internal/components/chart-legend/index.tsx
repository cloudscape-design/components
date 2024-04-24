// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef, memo } from 'react';

import InternalBox from '../../../box/internal';
import { KeyCode } from '../../keycode';
import SeriesMarker, { ChartSeriesMarkerType } from '../chart-series-marker';
import styles from './styles.css.js';
import { useInternalI18n } from '../../../i18n/context';
import handleKey from '../../utils/handle-key';

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
  const i18n = useInternalI18n('[charts]');
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<Record<number, HTMLElement>>([]);

  const highlightedSeriesIndex = findSeriesIndex(series, highlightedSeries);

  const highlightInlineStart = () => {
    const currentIndex = highlightedSeriesIndex ?? 0;
    const nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : series.length - 1;
    segmentsRef.current[nextIndex]?.focus();
  };

  const highlightInlineEnd = () => {
    const currentIndex = highlightedSeriesIndex ?? 0;
    const nextIndex = currentIndex + 1 < series.length ? currentIndex + 1 : 0;
    segmentsRef.current[nextIndex]?.focus();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === KeyCode.right || event.keyCode === KeyCode.left) {
      // Preventing default fixes an issue in Safari+VO when VO additionally interprets arrow keys as its commands.
      event.preventDefault();

      handleKey(event, {
        onInlineStart: () => highlightInlineStart(),
        onInlineEnd: () => highlightInlineEnd(),
      });
    }
  };

  const handleSelection = (index: number) => {
    if (series[index].datum !== highlightedSeries) {
      onHighlightChange(series[index].datum);
    }
  };

  const handleBlur = (event: React.FocusEvent<Element>) => {
    // We need to check if the next element to be focused inside the plot container or not
    // so we don't clear the selected legend in case we are still focusing elements ( legend elements )
    // inside the plot container
    if (
      event.relatedTarget === null ||
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

  return (
    <>
      <div
        ref={containerRef}
        role="toolbar"
        aria-label={legendTitle || i18n('i18nStrings.legendAriaLabel', ariaLabel)}
        className={styles.root}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
      >
        {legendTitle && (
          <InternalBox fontWeight="bold" className={styles.title}>
            {legendTitle}
          </InternalBox>
        )}

        <div className={styles.list}>
          {series.map((s, index) => {
            const someHighlighted = highlightedSeries !== null;
            const isHighlighted = highlightedSeries === s.datum;
            const isDimmed = someHighlighted && !isHighlighted;
            return (
              <div
                role="button"
                key={index}
                aria-pressed={isHighlighted}
                className={clsx(styles.marker, {
                  [styles['marker--dimmed']]: isDimmed,
                  [styles['marker--highlighted']]: isHighlighted,
                })}
                ref={elem => {
                  if (elem) {
                    segmentsRef.current[index] = elem;
                  } else {
                    delete segmentsRef.current[index];
                  }
                }}
                tabIndex={
                  index === highlightedSeriesIndex || (highlightedSeriesIndex === undefined && index === 0) ? 0 : -1
                }
                onFocus={() => handleSelection(index)}
                onClick={() => handleSelection(index)}
                onMouseOver={() => handleMouseOver(s.datum)}
                onMouseLeave={handleMouseLeave}
              >
                <SeriesMarker color={s.color} type={s.type} /> {s.label}
              </div>
            );
          })}
        </div>
      </div>
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
