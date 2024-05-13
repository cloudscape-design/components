// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, act } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import { ElementWrapper } from '../../../lib/components/test-utils/dom';
import { ChartScale, NumericChartScale } from '../../../lib/components/internal/components/cartesian-chart/scales';
import { useNavigation, UseNavigationProps } from '../../../lib/components/mixed-line-bar-chart/hooks/use-navigation';

import { ChartDataTypes } from '../../../lib/components/mixed-line-bar-chart/interfaces';
import makeScaledBarGroups from '../../../lib/components/mixed-line-bar-chart/make-scaled-bar-groups';
import makeScaledSeries from '../../../lib/components/mixed-line-bar-chart/make-scaled-series';
import {
  lineSeries1,
  lineSeries2,
  lineSeries3,
  barSeries,
  barSeries2,
  thresholdSeries,
  xThresholdSeries1,
} from './common';
import { VerticalMarkerX } from '../interfaces';

const xScale = new ChartScale('linear', [0, 3], [0, 3]);
const yScale = new NumericChartScale('linear', [0, 15], [0, 15], null);
const categoricalScale = new ChartScale('categorical', ['Potatoes', 'Chocolate', 'Apples', 'Oranges'], [0, 100]);

const commonProps: Omit<UseNavigationProps<ChartDataTypes>, 'xScale' | 'yScale' | 'barGroups' | 'scaledSeries'> = {
  horizontalBars: false,
  highlightedSeries: null,
  isHandlersDisabled: false,
  series: [],
  visibleSeries: [],
  highlightedPoint: null,
  highlightedGroupIndex: null,
  verticalMarkerX: null,
  pinPopover: jest.fn(),
  highlightSeries: jest.fn(),
  highlightPoint: jest.fn(),
  highlightGroup: jest.fn(),
  clearHighlightedSeries: jest.fn(),
  highlightX: jest.fn(),
};

const buildNavigationProps = (
  customProps: Partial<UseNavigationProps<ChartDataTypes>> &
    Pick<UseNavigationProps<ChartDataTypes>, 'xScale' | 'yScale'>
): UseNavigationProps<ChartDataTypes> => {
  const props = { ...commonProps, ...customProps };

  if (customProps.series && !customProps.visibleSeries) {
    props.visibleSeries = customProps.series;
  }

  return {
    ...props,
    scaledSeries: makeScaledSeries(props.visibleSeries, props.xScale, props.yScale),
    barGroups: makeScaledBarGroups(props.visibleSeries, props.xScale, 0, 0, 'y'),
  };
};

class UseNavigationWrapper extends ElementWrapper {
  static selectors = {
    highlightedSeries: 'highlighted-series',
    highlightedPoint: 'highlighted-point',
    highlightedGroupIndex: 'highlighted-group-index',
    highlightedX: 'highlighted-x',
  };

  findKeyboardArea() {
    return this;
  }

  findHighlightedSeries() {
    return this.findByClassName(UseNavigationWrapper.selectors.highlightedSeries);
  }

  findHighlightedPoint() {
    return this.findByClassName(UseNavigationWrapper.selectors.highlightedPoint);
  }

  findHighlightedGroupIndex() {
    return this.findByClassName(UseNavigationWrapper.selectors.highlightedGroupIndex);
  }

  findHighlightedX() {
    return this.findByClassName(UseNavigationWrapper.selectors.highlightedX);
  }
}

function RenderedNavigationHook(props: UseNavigationProps<ChartDataTypes>) {
  const [highlightedSeries, setHighlightedSeries] = useState(props.highlightedSeries);
  const [highlightedPoint, setHighlightedPoint] = useState(props.highlightedPoint);
  const [highlightedGroupIndex, setHighlightedGroup] = useState(props.highlightedGroupIndex);
  const [highlightedX, setHighlightedX] = useState<VerticalMarkerX<any> | null>(null);

  const { onFocus, onKeyDown } = useNavigation({
    ...props,
    highlightSeries: series => setHighlightedSeries(series),
    highlightPoint: point => {
      setHighlightedPoint(point);
      setHighlightedSeries(point?.series);
    },
    highlightGroup: group => {
      setHighlightedSeries(null);
      setHighlightedPoint(null);
      setHighlightedGroup(group);
    },
    highlightX: setHighlightedX,
    highlightedSeries,
    highlightedPoint,
    highlightedGroupIndex,
  });

  return (
    <div onFocus={onFocus} onKeyDown={onKeyDown} tabIndex={-1}>
      <span className={UseNavigationWrapper.selectors.highlightedSeries}>{highlightedSeries?.title}</span>
      <span className={UseNavigationWrapper.selectors.highlightedGroupIndex}>{highlightedGroupIndex}</span>
      <span className={UseNavigationWrapper.selectors.highlightedPoint}>
        {highlightedPoint?.x},{highlightedPoint?.y}
      </span>
      <span className={UseNavigationWrapper.selectors.highlightedX}>{highlightedX?.scaledX}</span>
    </div>
  );
}

function renderNavigationHook(
  customProps: Partial<UseNavigationProps<ChartDataTypes>> &
    Pick<UseNavigationProps<ChartDataTypes>, 'xScale' | 'yScale'>
) {
  const props = buildNavigationProps(customProps);

  const { rerender, container } = render(<RenderedNavigationHook {...props} />);
  const wrapper = new UseNavigationWrapper(container.firstChild as HTMLElement);

  return { rerender, wrapper };
}

describe('Line charts', () => {
  describe('with one single series', () => {
    const series: any[] = [
      {
        index: 0,
        color: 'blue',
        series: lineSeries1,
      },
    ];

    const lineProps = { xScale, yScale, series };

    test('highlights first point when focused', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(lineSeries1.title);
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,10');
    });

    test('can navigate horizontally', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,10');

      act(() => wrapper.keydown(KeyCode.right));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,8');

      // Loop back
      act(() => wrapper.keydown(KeyCode.left));
      act(() => wrapper.keydown(KeyCode.left));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('3,10');
    });
  });

  describe('with multiple series', () => {
    const series: any[] = [
      {
        index: 0,
        color: 'blue',
        series: lineSeries1,
      },
      {
        index: 1,
        color: 'green',
        series: lineSeries2,
      },
      {
        index: 2,
        color: 'grey',
        series: thresholdSeries,
      },
      {
        index: 3,
        color: 'red',
        series: xThresholdSeries1,
      },
    ];

    const lineProps = { xScale, yScale, series };

    test('highlights all points from all series at the first X coordinate when focused', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');
    });

    test('can navigate vertically through series', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(lineSeries1.title);

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(lineSeries2.title);

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(thresholdSeries.title);

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(xThresholdSeries1.title);

      // Loop around to show all series again
      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedSeries()?.getElement()).toHaveTextContent(lineSeries1.title);

      act(() => wrapper.keydown(KeyCode.up));
      expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');
    });

    test('can navigate horizontally within all series', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

      act(() => wrapper.keydown(KeyCode.right));
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('1');

      act(() => wrapper.keydown(KeyCode.left));
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('0');

      // Loop back
      act(() => wrapper.keydown(KeyCode.left));
      expect(wrapper.findHighlightedX()?.getElement()).toHaveTextContent('3');
    });

    test('can navigate horizontally within one series', () => {
      const { wrapper } = renderNavigationHook(lineProps);
      act(() => wrapper.focus());

      act(() => wrapper.keydown(KeyCode.down));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('0,10');

      act(() => wrapper.keydown(KeyCode.right));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('1,8');

      // Loop back
      act(() => wrapper.keydown(KeyCode.left));
      act(() => wrapper.keydown(KeyCode.left));
      expect(wrapper.findHighlightedPoint()?.getElement()).toHaveTextContent('3,10');
    });
  });
});

describe('Bar charts', () => {
  const series: any[] = [
    {
      index: 0,
      color: 'blue',
      series: barSeries,
    },
    {
      index: 1,
      color: 'orange',
      series: barSeries2,
    },
    {
      index: 2,
      color: 'grey',
      series: thresholdSeries,
    },
  ];

  const barProps = {
    xScale: categoricalScale,
    yScale,
    series,
  };

  test('highlights first bar series when focused', () => {
    const { wrapper } = renderNavigationHook(barProps);

    act(() => wrapper.focus());

    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
  });

  test('cannot navigate vertically through series', () => {
    const { wrapper } = renderNavigationHook(barProps);
    act(() => wrapper.focus());
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();

    act(() => wrapper.keydown(KeyCode.down));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();

    act(() => wrapper.keydown(KeyCode.up));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
  });

  test('can navigate horizontally', () => {
    const { wrapper } = renderNavigationHook(barProps);

    act(() => wrapper.focus());
    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('1');

    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('2');

    // Loop back
    act(() => wrapper.keydown(KeyCode.left));
    act(() => wrapper.keydown(KeyCode.left));
    act(() => wrapper.keydown(KeyCode.left));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('3');
  });

  test('when navigating vertically, multiple bar series are treated as one navigable group', () => {
    const { wrapper } = renderNavigationHook({
      ...barProps,
      series: [
        {
          index: 0,
          color: 'blue',
          series: barSeries,
        },
        {
          index: 1,
          color: 'red',
          series: barSeries2,
        },
      ],
    });

    act(() => wrapper.focus());
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');

    // Moving vertically does nothing when there are only bar series in the chart
    act(() => wrapper.keydown(KeyCode.down));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
  });

  // TODO: Properly test navigating over gaps
  test.skip('skips over gaps when moving horizontally', () => {
    const { wrapper } = renderNavigationHook({
      ...barProps,
      xScale: new ChartScale('categorical', ['gap1', 'Potatoes', 'gap2', 'Chocolate', 'Apples', 'Oranges'], [0, 100]),
      series: [
        {
          index: 0,
          color: 'blue',
          series: barSeries,
        },
        {
          index: 1,
          color: 'red',
          // This series has no data for "Apple"
          series: barSeries2,
        },
      ],
    });

    act(() => wrapper.focus());

    // Should start in "Potatoes" because the first domain item is a gap
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('1');

    // Another gap
    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('3');

    // "Apple" is not a gap because it exists in at least one bar series
    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('4');
  });
});

describe('Mixed charts', () => {
  const series = [
    {
      index: 0,
      color: 'blue',
      series: barSeries,
    },
    {
      index: 1,
      color: 'orange',
      series: barSeries2,
    },
    {
      index: 2,
      color: 'grey',
      series: thresholdSeries,
    },
    {
      index: 3,
      color: 'red',
      series: lineSeries3,
    },
  ];

  const chartProps = {
    xScale: categoricalScale,
    yScale,
    series,
  };

  test('highlights first series when focused', () => {
    const { wrapper } = renderNavigationHook(chartProps);

    act(() => wrapper.focus());

    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
  });

  test('cannot navigate vertically through series', () => {
    const { wrapper } = renderNavigationHook(chartProps);
    act(() => wrapper.focus());

    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();

    // Charts with bars can only be navigated horizontally as a group, not vertically
    act(() => wrapper.keydown(KeyCode.down));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();

    act(() => wrapper.keydown(KeyCode.up));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('0');
    expect(wrapper.findHighlightedSeries()?.getElement()).toBeEmptyDOMElement();
  });

  test('can navigate horizontally in ltr', () => {
    const { wrapper } = renderNavigationHook(chartProps);

    act(() => wrapper.focus());
    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('1');

    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('2');

    // Loop back
    act(() => wrapper.keydown(KeyCode.left));
    act(() => wrapper.keydown(KeyCode.left));
    act(() => wrapper.keydown(KeyCode.left));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('3');
  });

  test('can navigate horizontally in rtl', () => {
    const { wrapper } = renderNavigationHook({ ...chartProps, isRtl: true });

    act(() => wrapper.focus());
    act(() => wrapper.keydown(KeyCode.left));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('1');

    act(() => wrapper.keydown(KeyCode.left));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('2');

    // Loop back
    act(() => wrapper.keydown(KeyCode.right));
    act(() => wrapper.keydown(KeyCode.right));
    act(() => wrapper.keydown(KeyCode.right));
    expect(wrapper.findHighlightedGroupIndex()?.getElement()).toHaveTextContent('3');
  });
});
