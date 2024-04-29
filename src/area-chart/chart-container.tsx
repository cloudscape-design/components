// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useEffect, memo, useRef, useMemo } from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

import ChartPlot from '../internal/components/chart-plot';
import AxisLabel from '../internal/components/cartesian-chart/axis-label';
import LabelsMeasure from '../internal/components/cartesian-chart/labels-measure';
import InlineStartLabels from '../internal/components/cartesian-chart/inline-start-labels';
import BlockEndLabels, { useBLockEndLabels } from '../internal/components/cartesian-chart/block-end-labels';
import EmphasizedBaseline from '../internal/components/cartesian-chart/emphasized-baseline';
import { AreaChartProps } from './interfaces';
import { ChartModel } from './model';
import AreaDataSeries from './elements/data-series';
import AreaChartPopover from './elements/chart-popover';
import AreaHighlightedPoint from './elements/highlighted-point';
import AreaVerticalMarker from './elements/vertical-marker';

import useHighlightDetails from './elements/use-highlight-details';
import useContainerWidth from '../internal/utils/use-container-width';
import { useSelector } from './async-store';
import { CartesianChartContainer } from '../internal/components/cartesian-chart/chart-container';

const DEFAULT_CHART_WIDTH = 500;
const INLINE_START_LABELS_MARGIN = 16;
const BLOCK_END_LABELS_OFFSET = 12;

type TickFormatter = undefined | ((value: AreaChartProps.DataTypes) => string);

interface ChartContainerProps<T extends AreaChartProps.DataTypes>
  extends Pick<
    AreaChartProps<T>,
    | 'xTitle'
    | 'yTitle'
    | 'xTickFormatter'
    | 'yTickFormatter'
    | 'detailTotalFormatter'
    | 'detailPopoverSize'
    | 'detailPopoverFooter'
    | 'ariaLabel'
    | 'ariaLabelledby'
    | 'ariaDescription'
    | 'i18nStrings'
  > {
  model: ChartModel<T>;
  autoWidth: (value: number) => void;
  fitHeight?: boolean;
  minHeight: number;
}

export default memo(ChartContainer) as typeof ChartContainer;

function ChartContainer<T extends AreaChartProps.DataTypes>({
  model,
  autoWidth,
  xTitle,
  yTitle,
  detailPopoverSize,
  detailPopoverFooter,
  ariaLabel,
  ariaLabelledby,
  ariaDescription,
  i18nStrings: {
    xTickFormatter: deprecatedXTickFormatter,
    yTickFormatter: deprecatedYTickFormatter,
    detailTotalFormatter: deprecatedDetailTotalFormatter,
    detailTotalLabel,
    chartAriaRoleDescription,
    xAxisAriaRoleDescription,
    yAxisAriaRoleDescription,
    detailPopoverDismissAriaLabel,
  } = {},
  fitHeight,
  minHeight,
  xTickFormatter = deprecatedXTickFormatter,
  yTickFormatter = deprecatedYTickFormatter,
  detailTotalFormatter = deprecatedDetailTotalFormatter,
}: ChartContainerProps<T>) {
  const [inlineStartLabelsWidth, setInlineStartLabelsWidth] = useState(0);
  const [containerWidth, containerWidthRef] = useContainerWidth(DEFAULT_CHART_WIDTH);
  const maxInlineStartLabelsWidth = Math.round(containerWidth / 2);

  const blockEndLabelsProps = useBLockEndLabels({
    ticks: model.computed.xTicks,
    scale: model.computed.xScale,
    tickFormatter: xTickFormatter as TickFormatter,
  });

  // Calculate the width of the plot area and tell it to the parent.
  const plotWidth = Math.max(0, containerWidth - inlineStartLabelsWidth - INLINE_START_LABELS_MARGIN);
  useEffect(() => {
    autoWidth(plotWidth);
  }, [autoWidth, plotWidth]);

  const highlightDetails = useHighlightDetails({
    model,
    xTickFormatter,
    yTickFormatter,
    detailTotalFormatter,
    detailTotalLabel,
  });

  const highlightedPointRef = useRef<SVGGElement>(null);

  const mergedRef = useMergeRefs(containerWidthRef, model.refs.container);

  const isPointHighlighted = model.interactions.get().highlightedPoint !== null;

  const highlightedX = useSelector(model.interactions, state => state.highlightedX);

  const detailPopoverFooterContent = useMemo(
    () => (detailPopoverFooter && highlightedX ? detailPopoverFooter(highlightedX[0].x) : null),
    [detailPopoverFooter, highlightedX]
  );

  return (
    <CartesianChartContainer
      ref={mergedRef}
      minHeight={minHeight + blockEndLabelsProps.height}
      fitHeight={!!fitHeight}
      leftAxisLabel={<AxisLabel axis="y" position="left" title={yTitle} />}
      leftAxisLabelMeasure={
        <LabelsMeasure
          scale={model.computed.yScale}
          ticks={model.computed.yTicks}
          tickFormatter={yTickFormatter as TickFormatter}
          autoWidth={setInlineStartLabelsWidth}
          maxLabelsWidth={maxInlineStartLabelsWidth}
        />
      }
      bottomAxisLabel={<AxisLabel axis="x" position="bottom" title={xTitle} />}
      chartPlot={
        <ChartPlot
          ref={model.refs.plot}
          width="100%"
          height={fitHeight ? `calc(100% - ${blockEndLabelsProps.height}px)` : model.height}
          offsetBottom={blockEndLabelsProps.height}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledby}
          ariaDescription={ariaDescription}
          ariaRoleDescription={chartAriaRoleDescription}
          activeElementKey={!highlightDetails?.isPopoverPinned && highlightDetails?.activeLabel}
          activeElementRef={isPointHighlighted ? highlightedPointRef : model.refs.verticalMarker}
          activeElementFocusOffset={isPointHighlighted ? 3 : { x: 8, y: 0 }}
          isClickable={!highlightDetails?.isPopoverPinned}
          onMouseMove={model.handlers.onSVGMouseMove}
          onMouseOut={model.handlers.onSVGMouseOut}
          onClick={model.handlers.onSVGMouseDown}
          onKeyDown={model.handlers.onSVGKeyDown}
          onApplicationFocus={model.handlers.onApplicationFocus}
          onApplicationBlur={model.handlers.onApplicationBlur}
        >
          <line
            ref={model.refs.plotMeasure}
            x1="0"
            x2="0"
            y1="0"
            y2="100%"
            stroke="transparent"
            strokeWidth={1}
            style={{ pointerEvents: 'none' }}
          />

          <InlineStartLabels
            plotWidth={model.width}
            plotHeight={model.height}
            scale={model.computed.yScale}
            ticks={model.computed.yTicks}
            tickFormatter={yTickFormatter}
            title={yTitle}
            ariaRoleDescription={yAxisAriaRoleDescription}
            maxLabelsWidth={maxInlineStartLabelsWidth}
          />

          <AreaDataSeries model={model} />

          <BlockEndLabels
            {...blockEndLabelsProps}
            width={model.width}
            height={model.height}
            scale={model.computed.xScale}
            title={xTitle}
            ariaRoleDescription={xAxisAriaRoleDescription}
            offsetLeft={inlineStartLabelsWidth + BLOCK_END_LABELS_OFFSET}
            offsetRight={BLOCK_END_LABELS_OFFSET}
          />

          <EmphasizedBaseline width={model.width} height={model.height} scale={model.computed.yScale} />

          <AreaVerticalMarker model={model} />

          <AreaHighlightedPoint ref={highlightedPointRef} model={model} ariaLabel={highlightDetails?.activeLabel} />
        </ChartPlot>
      }
      popover={
        <AreaChartPopover
          model={model}
          highlightDetails={highlightDetails}
          dismissAriaLabel={detailPopoverDismissAriaLabel}
          size={detailPopoverSize}
          footer={detailPopoverFooterContent}
          onBlur={model.handlers.onApplicationBlur}
        />
      }
    />
  );
}
