// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useImperativeHandle, useRef } from 'react';

import useChartModel, { UseChartModelProps } from '../../../lib/components/area-chart/model/use-chart-model';
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';
import { ChartDataTypes } from '../../../lib/components/internal/components/cartesian-chart/interfaces';
import { act, render, fireEvent } from '@testing-library/react';
import { AreaChartProps } from '../../../lib/components/area-chart/interfaces';
import { useReaction } from '../../../lib/components/area-chart/async-store';
import { ChartModel } from '../../../lib/components/area-chart/model';
import PlotPoint = ChartModel.PlotPoint;

class UseChartModelWrapper extends ElementWrapper {
  static selectors = {
    highlightedPoint: 'highlighted-point',
    highlightedSeries: 'highlighted-series',
    highlightedX: 'highlighted-x',
    plot: 'plot',
    popover: 'popover',
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

  findPlot() {
    return this.findByClassName(UseChartModelWrapper.selectors.plot);
  }

  findDetailPopover() {
    return this.findByClassName(UseChartModelWrapper.selectors.popover);
  }
}

function RenderChartModelHook(props: UseChartModelProps<ChartDataTypes>) {
  const [highlightedSeries, setHighlightedSeries] = useState<null | AreaChartProps.Series<ChartDataTypes>>(null);
  const [visibleSeries, setVisibleSeries] = useState(props.visibleSeries);
  const [highlightedPoint, setHighlightedPoint] = useState<PlotPoint<ChartDataTypes> | null>(null);
  const [highlightedX, setHighlightedX] = useState<readonly PlotPoint<ChartDataTypes>[] | null>(null);
  const svgRef = useRef(null);
  const popoverRef = useRef(null);

  const { computed, handlers, interactions, refs } = useChartModel({
    ...props,
    highlightedSeries,
    setHighlightedSeries,
    visibleSeries,
    setVisibleSeries,
    popoverRef,
  });

  useReaction(interactions, state => state.highlightedPoint, setHighlightedPoint);
  useReaction(interactions, state => state.highlightedX, setHighlightedX);

  useImperativeHandle(refs.plot, () => ({
    svg: svgRef.current!,
    focusPlot: jest.fn(),
    focusApplication: jest.fn(),
  }));

  return (
    <div
      onFocus={event => {
        handlers.onApplicationFocus(event, 'keyboard');
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
      <svg
        onMouseMove={handlers.onSVGMouseMove}
        onMouseOut={handlers.onSVGMouseOut}
        className={UseChartModelWrapper.selectors.plot}
        ref={svgRef}
      >
        area plot
      </svg>
      <div className={UseChartModelWrapper.selectors.popover} ref={popoverRef} onMouseLeave={handlers.onPopoverLeave}>
        <div>Popover</div>
      </div>
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
        popoverRef: { current: null },
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

    describe('navigation across X axis, ltr', () => {
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
          popoverRef: { current: null },
        });
        act(() => wrapper.focus());

        act(() => wrapper.keydown(KeyCode.down));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,2');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,4');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('2,6');

        act(() => wrapper.keydown(KeyCode.left));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,4');

        act(() => wrapper.keydown(KeyCode.down));
        act(() => wrapper.keydown(KeyCode.up));
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
          popoverRef: { current: null },
        });
        act(() => wrapper.focus());
        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');
      });
    });

    describe('navigation across X axis, rtl', () => {
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
          popoverRef: { current: null },
        });
        act(() => wrapper.focus());

        wrapper.getElement().style.direction = 'rtl';

        act(() => wrapper.keydown(KeyCode.down));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,2');

        act(() => wrapper.keydown(KeyCode.left));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,4');

        act(() => wrapper.keydown(KeyCode.left));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('2,6');

        act(() => wrapper.keydown(KeyCode.right));
        expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,4');

        act(() => wrapper.keydown(KeyCode.down));
        act(() => wrapper.keydown(KeyCode.up));
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
          popoverRef: { current: null },
        });
        act(() => wrapper.focus());

        wrapper.getElement().style.direction = 'rtl';

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

        act(() => wrapper.keydown(KeyCode.left));
        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');
      });
    });

    describe('Detail Popover', () => {
      test('does not clear highlighted X on mouseOut if moving within popover', () => {
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
          popoverRef: { current: null },
        });

        const mouseMoveEvent = {
          relatedTarget: wrapper.findPlot()?.getElement(),
          clientX: 100,
          clientY: 100,
        } as any;

        act(() => {
          fireEvent.mouseMove(wrapper.findPlot()!.getElement(), mouseMoveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');

        const mouseOutEvent = {
          relatedTarget: wrapper.findDetailPopover()?.getElement(),
          clientX: 0,
          clientY: 0,
        } as any;

        act(() => {
          fireEvent.mouseOut(wrapper.findPlot()!.getElement(), mouseOutEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');
      });

      test('clear highlighted X when mouse leaves popover', () => {
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
          popoverRef: { current: null },
        });

        const mouseMoveEvent = {
          relatedTarget: wrapper.findPlot()?.getElement(),
          clientX: 100,
          clientY: 100,
        } as any;

        act(() => {
          fireEvent.mouseMove(wrapper.findPlot()!.getElement(), mouseMoveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');

        const mouseOutEvent = {
          relatedTarget: wrapper.findDetailPopover()?.getElement(),
          clientX: 0,
          clientY: 0,
        } as any;

        act(() => {
          fireEvent.mouseOut(wrapper.findPlot()!.getElement(), mouseOutEvent);
        });

        const mouseLeaveEvent = {
          relatedTarget: wrapper.getElement(),
          clientX: 400,
          clientY: 400,
        } as any;

        act(() => {
          fireEvent.mouseLeave(wrapper.findDetailPopover()!.getElement(), mouseLeaveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('');
      });

      test('clear highlighted X when mouse exited from the page', () => {
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
          popoverRef: { current: null },
        });

        const mouseMoveEvent = {
          relatedTarget: wrapper.findPlot()?.getElement(),
          clientX: 100,
          clientY: 100,
        } as any;

        act(() => {
          fireEvent.mouseMove(wrapper.findPlot()!.getElement(), mouseMoveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');

        const mouseLeaveEvent = {
          relatedTarget: window, // when mouse exited the page, relatedTarget is set to window.
          clientX: 0,
          clientY: 0,
        } as any;

        act(() => {
          fireEvent.mouseLeave(wrapper.findDetailPopover()!.getElement(), mouseLeaveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('');
      });

      test('keep highlighted X when mouse leaves popover but in plot', () => {
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
          popoverRef: { current: null },
        });

        const mouseMoveEvent = {
          relatedTarget: wrapper.findPlot()?.getElement(),
          clientX: 100,
          clientY: 100,
        } as any;

        act(() => {
          fireEvent.mouseMove(wrapper.findPlot()!.getElement(), mouseMoveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');

        const mouseOutEvent = {
          relatedTarget: wrapper.findDetailPopover()?.getElement(),
          clientX: 0,
          clientY: 0,
        } as any;

        act(() => {
          fireEvent.mouseOut(wrapper.findPlot()!.getElement(), mouseOutEvent);
        });

        const mouseLeaveEvent = {
          relatedTarget: wrapper.findPlot()!.getElement(),
          clientX: 100,
          clientY: 100,
        } as any;

        act(() => {
          fireEvent.mouseLeave(wrapper.findDetailPopover()!.getElement(), mouseLeaveEvent);
        });

        expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');
      });
    });
  });
});
