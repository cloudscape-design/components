// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useRef } from 'react';
import clsx from 'clsx';

import { ChartScale, NumericChartScale } from './scales';
import { TICK_LENGTH, TICK_LINE_HEIGHT, TICK_MARGIN } from './constants';

import styles from './styles.css.js';
import { formatTicks, getLabelBBox, getVisibleTicks } from './label-utils';
import { ChartDataTypes } from '../../../mixed-line-bar-chart/interfaces';
import { useInternalI18n } from '../../../i18n/context';
import ResponsiveText from '../responsive-text';

const OFFSET_PX = 12;

interface LeftLabelsProps {
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

export default memo(LeftLabels) as typeof LeftLabels;

// Renders the visible tick labels on the left axis, as well as their grid lines.
function LeftLabels({
  axis = 'y',
  plotWidth,
  plotHeight,
  maxLabelsWidth = Number.POSITIVE_INFINITY,
  scale,
  ticks,
  tickFormatter,
  title,
  ariaRoleDescription,
}: LeftLabelsProps) {
  const i18n = useInternalI18n('[charts]');
  const virtualTextRef = useRef<SVGTextElement>(null);

  const yOffset = axis === 'x' && scale.isCategorical() ? Math.max(0, scale.d3Scale.bandwidth() - 1) / 2 : 0;

  const labelToBoxCache = useRef<{ [label: string]: DOMRect }>({});
  const getLabelSpace = (label: string) => {
    if (labelToBoxCache.current[label] !== undefined) {
      return labelToBoxCache.current[label].height;
    }
    const labelBBox = getLabelBBox(virtualTextRef.current, label);
    if (labelBBox) {
      labelToBoxCache.current[label] = labelBBox;
      return labelToBoxCache.current[label].height;
    }
    return 0;
  };

  const formattedTicks = formatTicks({ ticks, scale, getLabelSpace, tickFormatter });

  if (virtualTextRef.current) {
    virtualTextRef.current.textContent = '';
  }

  const from = 0 - OFFSET_PX - yOffset;
  const until = plotHeight + OFFSET_PX - yOffset;
  const visibleTicks = getVisibleTicks(formattedTicks, from, until);

  return (
    <g
      className={clsx(styles['labels-left'])}
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
                const lineTextProps = {
                  x: -(TICK_LENGTH + TICK_MARGIN),
                  y: lineIndex * TICK_LINE_HEIGHT,
                  className: styles.ticks__text,
                  children: line,
                };
                return labelToBoxCache.current[lines[0]]?.width > maxLabelsWidth ? (
                  <ResponsiveText {...lineTextProps} maxWidth={maxLabelsWidth} />
                ) : (
                  <text {...lineTextProps} />
                );
              })}
            </g>
          )
      )}

      <text ref={virtualTextRef} x={0} y={0} style={{ visibility: 'hidden' }} aria-hidden="true"></text>
    </g>
  );
}
