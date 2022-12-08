// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import useChartModel, { UseChartModelProps } from '../model/use-chart-model';
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { ChartDataTypes } from '../../internal/components/cartesian-chart/interfaces';
import { act, render } from '@testing-library/react';
import { AreaChartProps } from '../interfaces';
import { KeyCode } from '../../internal/keycode';
import { useReaction } from '../model/async-store';
import { ChartModel } from '../model';
import PlotPoint = ChartModel.PlotPoint;

class UseChartModelWrapper extends ElementWrapper {
  static selectors = {
    highlightedPoint: 'highlighted-point',
    highlightedSeries: 'highlighted-series',
    highlightedX: 'highlighted-x',
  };

  findHighlightedPoint() {
    return this.findByClassName(UseChartModelWrapper.selectors.highlightedPoint);
  }

  findHighlightedSeries() {
    return this.findByClassName(UseChartModelWrapper.selectors.highlightedSeries);
  }

  findHighlightedX() {
    return this.findByClassName(UseChartModelWrapper.selectors.highlightedX);
  }
}

function RenderChartModelHook(props: UseChartModelProps<ChartDataTypes>) {
  const [highlightedSeries, setHighlightedSeries] = useState<null | AreaChartProps.Series<ChartDataTypes>>(null);
  const [visibleSeries, setVisibleSeries] = useState(props.visibleSeries);
  const [highlightedPoint, setHighlightedPoint] = useState<PlotPoint<ChartDataTypes> | null>(null);
  const [highlightedX, setHighlightedX] = useState<readonly PlotPoint<ChartDataTypes>[] | null>(null);

  const { computed, handlers, interactions } = useChartModel({
    ...props,
    highlightedSeries,
    setHighlightedSeries,
    visibleSeries,
    setVisibleSeries,
  });

  useReaction(interactions, state => state.highlightedPoint, setHighlightedPoint);
  useReaction(interactions, state => state.highlightedX, setHighlightedX);

  return (
    <div
      onFocus={event => {
        handlers.onSVGFocus(event, 'keyboard');
      }}
      onKeyDown={handlers.onSVGKeyDown}
      tabIndex={-1}
    >
      <span>{computed.xTicks.length}</span>
      <span className={UseChartModelWrapper.selectors.highlightedPoint}>
        {highlightedPoint ? `${highlightedPoint.x},${highlightedPoint.value}` : null}
      </span>
      <span className={UseChartModelWrapper.selectors.highlightedSeries}>{highlightedSeries?.title}</span>
      <span className={UseChartModelWrapper.selectors.highlightedX}>
        {highlightedX === null ? null : highlightedX[0].x}
      </span>
      <span>{visibleSeries[0].title}</span>
    </div>
  );
}

function renderChartModelHook(props: UseChartModelProps<ChartDataTypes>) {
  const { rerender, container } = render(<RenderChartModelHook {...props} />);
  const wrapper = new UseChartModelWrapper(container.firstChild as HTMLElement);
  return { rerender, wrapper };
}

describe('useChartModel', () => {
  const series: readonly AreaChartProps.Series<ChartDataTypes>[] = [
    {
      type: 'area',
      title: 'series1',
      color: 'orange',
      data: [
        { x: 0, y: 1 },
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 },
      ],
    },
    {
      type: 'area',
      title: 'series2',
      color: 'blue',
      data: [
        { x: 0, y: 2 },
        { x: 1, y: 4 },
        { x: 2, y: 6 },
        { x: 3, y: 8 },
      ],
    },
  ];

  describe('keyboard navigation', () => {
    it('cycles between the different series', () => {
      const { wrapper } = renderChartModelHook({
        height: 0,
        highlightedSeries: null,
        setHighlightedSeries: (_series: AreaChartProps.Series<ChartDataTypes> | null) => _series,
        setVisibleSeries: (_series: readonly AreaChartProps.Series<ChartDataTypes>[]) => _series,
        width: 0,
        xDomain: undefined,
        xScaleType: 'linear',
        yScaleType: 'linear',
        externalSeries: series,
        visibleSeries: series,
      });
      act(() => wrapper.focus());

      // Show all series
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');
      expect(wrapper.findHighlightedPoint()?.getElement()).toBeEmptyDOMElement();

      // Show first series (from the end)
      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,2');

      // Show second series (from the end)
      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,1');

      // Loop back to show all series
      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');
      expect(wrapper.findHighlightedPoint()?.getElement()).toBeEmptyDOMElement();
    });

    describe('navigation across X axis', () => {
      it('highlights next or previous point in the data series when a series is focused', () => {
        const { wrapper } = renderChartModelHook({
          height: 0,
          highlightedSeries: null,
          setHighlightedSeries: (_series: AreaChartProps.Series<ChartDataTypes> | null) => _series,
          setVisibleSeries: (_series: readonly AreaChartProps.Series<ChartDataTypes>[]) => _series,
          width: 0,
          xDomain: undefined,
          xScaleType: 'linear',
          yScaleType: 'linear',
          externalSeries: series,
          visibleSeries: series,
        });
        act(() => wrapper.focus());

        act(() => wrapper.keydown(KeyCode.down));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,2');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,4');
      });

      it('highlights next or previous X when no series is focused', () => {
        const { wrapper } = renderChartModelHook({
          height: 0,
          highlightedSeries: null,
          setHighlightedSeries: (_series: AreaChartProps.Series<ChartDataTypes> | null) => _series,
          setVisibleSeries: (_series: readonly AreaChartProps.Series<ChartDataTypes>[]) => _series,
          width: 0,
          xDomain: undefined,
          xScaleType: 'linear',
          yScaleType: 'linear',
          externalSeries: series,
          visibleSeries: series,
        });
        act(() => wrapper.focus());
        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');
      });
    });
  });
});
