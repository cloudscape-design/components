// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useRef } from 'react';
import clsx from 'clsx';

import { ChartDataTypes } from './interfaces';
import { ChartScale, NumericChartScale } from './scales';
import { TICK_LENGTH, TICK_LINE_HEIGHT, TICK_MARGIN } from './constants';

import styles from './styles.css.js';
import { formatTicks, getVisibleTicks, FormattedTick } from './label-utils';
import { useInternalI18n } from '../../../i18n/context';

interface BlockEndLabelsProps {
  axis?: 'x' | 'y';
  width: number;
  height: number;
  scale: ChartScale | NumericChartScale;
  title?: string;
  ariaRoleDescription?: string;
  offsetLeft?: number;
  offsetRight?: number;
  virtualTextRef: React.Ref<SVGTextElement>;
  formattedTicks: readonly FormattedTick[];
}

export function useBLockEndLabels({
  ticks,
  scale,
  tickFormatter,
}: {
  scale: ChartScale | NumericChartScale;
  ticks: readonly ChartDataTypes[];
  tickFormatter?: (value: ChartDataTypes) => string;
}) {
  const virtualTextRef = useRef<SVGTextElement>(null);

  const cacheRef = useRef<{ [label: string]: number }>({});
  const getLabelSpace = (label: string) => {
    if (cacheRef.current[label] !== undefined && cacheRef.current[label] !== 0) {
      return cacheRef.current[label];
    }
    if (virtualTextRef.current && virtualTextRef.current.getComputedTextLength) {
      virtualTextRef.current.textContent = label;
      cacheRef.current[label] = virtualTextRef.current.getComputedTextLength();
      return cacheRef.current[label];
    }
    return 0;
  };

  const formattedTicks = formatTicks({ ticks, scale, getLabelSpace, tickFormatter });

  if (virtualTextRef.current) {
    virtualTextRef.current.textContent = '';
  }

  let height = TICK_LENGTH + TICK_MARGIN;
  for (const { lines } of formattedTicks) {
    height = Math.max(height, TICK_LENGTH + TICK_MARGIN + lines.length * TICK_LINE_HEIGHT);
  }

  return { virtualTextRef, formattedTicks, height };
}

export default memo(BlockEndLabels) as typeof BlockEndLabels;

// Renders the visible tick labels on the bottom axis, as well as their grid lines.
function BlockEndLabels({
  axis = 'x',
  width,
  height,
  scale,
  title,
  ariaRoleDescription,
  offsetLeft = 0,
  offsetRight = 0,
  virtualTextRef,
  formattedTicks,
}: BlockEndLabelsProps) {
  const i18n = useInternalI18n('[charts]');

  const xOffset = scale.isCategorical() && axis === 'x' ? Math.max(0, scale.d3Scale.bandwidth() - 1) / 2 : 0;

  const from = 0 - offsetLeft - xOffset;
  const until = width + offsetRight - xOffset;
  const balanceLabels = axis === 'x' && scale.scaleType !== 'log';
  const visibleTicks = getVisibleTicks(formattedTicks, from, until, balanceLabels);

  return (
    <g
      transform={`translate(0,${height})`}
      className={styles['labels-bottom']}
      aria-label={title}
      role="list"
      aria-roledescription={i18n('i18nStrings.chartAriaRoleDescription', ariaRoleDescription)}
      aria-hidden={true}
    >
      {visibleTicks.map(
        ({ position, lines }, index) =>
          isFinite(position) && (
            <g
              key={index}
              transform={`translate(${position + xOffset},0)`}
              className={clsx(styles.ticks, styles['ticks--bottom'], {
                [styles['ticks--x']]: axis === 'x',
                [styles['ticks--y']]: axis === 'y',
              })}
              role="listitem"
              aria-label={lines.join('\n')}
            >
              <line className={styles.ticks__line} x1={0} x2={0} y1={0} y2={TICK_LENGTH} aria-hidden="true" />
              {lines.map((line, lineIndex) => (
                <text
                  className={styles.ticks__text}
                  key={lineIndex}
                  x={0}
                  y={TICK_LENGTH + TICK_MARGIN + lineIndex * TICK_LINE_HEIGHT}
                >
                  {line}
                </text>
              ))}
            </g>
          )
      )}

      <text ref={virtualTextRef} x={0} y={0} style={{ visibility: 'hidden' }} aria-hidden="true"></text>
    </g>
  );
}
