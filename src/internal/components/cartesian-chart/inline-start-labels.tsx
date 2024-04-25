// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useRef } from 'react';
import clsx from 'clsx';

import { ChartScale, NumericChartScale } from './scales';
import { TICK_LENGTH, TICK_LINE_HEIGHT, TICK_MARGIN } from './constants';

import styles from './styles.css.js';
import { formatTicks, getSVGTextSize, getVisibleTicks } from './label-utils';
import { ChartDataTypes } from '../../../mixed-line-bar-chart/interfaces';
import { useInternalI18n } from '../../../i18n/context';
import ResponsiveText from '../responsive-text';
import { getIsRtl } from '../../direction';

const OFFSET_PX = 12;

interface InlineStartLabelsProps {
  axis?: 'x' | 'y';
  plotWidth: number;
  plotHeight: number;
  maxLabelsWidth?: number;
  scale: ChartScale | NumericChartScale;
  ticks: readonly ChartDataTypes[];
  tickFormatter?: (value: number) => string;
  title?: string;
  ariaRoleDescription?: string;
}

export default memo(InlineStartLabels) as typeof InlineStartLabels;

// Renders the visible tick labels on the value axis, as well as their grid lines.
function InlineStartLabels({
  axis = 'y',
  plotWidth,
  plotHeight,
  maxLabelsWidth = Number.POSITIVE_INFINITY,
  scale,
  ticks,
  tickFormatter,
  title,
  ariaRoleDescription,
}: InlineStartLabelsProps) {
  const i18n = useInternalI18n('[charts]');
  const virtualTextRef = useRef<SVGTextElement>(null);

  const yOffset = axis === 'x' && scale.isCategorical() ? Math.max(0, scale.d3Scale.bandwidth() - 1) / 2 : 0;

  const labelToBoxCache = useRef<{ [label: string]: undefined | { width: number; height: number } }>({});
  const getLabelSpace = (label: string) => {
    if (labelToBoxCache.current[label] !== undefined) {
      return labelToBoxCache.current[label]?.height ?? 0;
    }
    if (virtualTextRef.current) {
      virtualTextRef.current.textContent = label;
    }
    labelToBoxCache.current[label] = getSVGTextSize(virtualTextRef.current);
    return labelToBoxCache.current[label]?.height ?? 0;
  };

  const formattedTicks = formatTicks({ ticks, scale, getLabelSpace, tickFormatter });

  if (virtualTextRef.current) {
    virtualTextRef.current.textContent = '';
  }

  const from = 0 - OFFSET_PX - yOffset;
  const until = plotHeight + OFFSET_PX - yOffset;
  const visibleTicks = getVisibleTicks(formattedTicks, from, until);

  const isRtl = virtualTextRef.current ? getIsRtl(virtualTextRef.current) : false;

  return (
    <g
      className={clsx(styles['labels-inline-start'])}
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
              role="listitem"
              transform={`translate(0,${position + yOffset})`}
              className={clsx(styles.ticks, axis === 'x' ? styles['ticks--x'] : styles['ticks--y'])}
            >
              {axis === 'y' && (
                <line
                  className={clsx(styles.grid, styles.ticks_line)}
                  x1={-TICK_LENGTH}
                  y1={0}
                  x2={plotWidth}
                  y2={0}
                  aria-hidden="true"
                />
              )}

              {lines.map((line, lineIndex) => {
                const x = -(TICK_LENGTH + TICK_MARGIN);
                const lineTextProps = {
                  x: !isRtl ? x : plotWidth - x,
                  y: (lineIndex - (lines.length - 1) * 0.5) * TICK_LINE_HEIGHT,
                  className: styles.ticks__text,
                  children: line,
                };
                return (labelToBoxCache.current[lines[0]]?.width ?? 0) > maxLabelsWidth ? (
                  <ResponsiveText key={lineIndex} {...lineTextProps} maxWidth={maxLabelsWidth} />
                ) : (
                  <text key={lineIndex} {...lineTextProps} />
                );
              })}
            </g>
          )
      )}

      <text ref={virtualTextRef} x={0} y={0} style={{ visibility: 'hidden' }} aria-hidden="true"></text>
    </g>
  );
}
