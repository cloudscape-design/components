// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Fragment, memo, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { ChartDataTypes } from '../../../mixed-line-bar-chart/interfaces';
import { ChartScale, NumericChartScale } from './scales';

import styles from './styles.css.js';

interface LabelsMeasureProps {
  scale: ChartScale | NumericChartScale;
  ticks: readonly ChartDataTypes[];
  tickFormatter?: (value: ChartDataTypes) => string;
  autoWidth: (value: number) => void;
  maxLabelsWidth?: number;
}

export default memo(LabelsMeasure) as typeof LabelsMeasure;

// Places the invisible left-hand side labels to calculate their maximum width.
// Uses a plain useEffect + native ResizeObserver (not useContainerQuery) to avoid
// the synchronous useLayoutEffect initial measurement in component-toolkit's
// useResizeObserver, which triggers nested setState warnings during commit.
function LabelsMeasure({ scale, ticks, tickFormatter, autoWidth, maxLabelsWidth }: LabelsMeasureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prevWidthRef = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(entries => {
      const newWidth = entries[0]?.contentBoxSize?.[0]?.inlineSize ?? entries[0]?.contentRect?.width ?? 0;
      if (Math.abs(newWidth - prevWidthRef.current) >= 1) {
        prevWidthRef.current = newWidth;
        autoWidth(newWidth);
      }
    });
    observer.observe(element, { box: 'content-box' });
    return () => observer.disconnect();
  }, [autoWidth]);

  const labelMapper = (value: ChartDataTypes) => {
    const scaledValue = scale.d3Scale(value as any);
    if (scaledValue === undefined || !isFinite(scaledValue)) {
      return null;
    }

    const formattedValue = tickFormatter ? tickFormatter(value as any) : value.toString();
    const lines = (formattedValue + '').split('\n');

    return (
      <Fragment key={`${value}`}>
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className={styles['labels-inline-start__label']} aria-hidden="true">
            {line}
          </div>
        ))}
      </Fragment>
    );
  };

  return (
    <div
      ref={ref}
      className={clsx(styles['labels-inline-start'], styles['labels-inline-start--hidden'])}
      style={{ maxWidth: maxLabelsWidth }}
    >
      {ticks.map(labelMapper)}
    </div>
  );
}
