// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Link from '../../../lib/components/link';
import MixedLineBarChart, { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import chartSeriesDetailsStyles from '../../../lib/components/internal/components/chart-series-details/styles.css.js';
import { renderMixedChart } from './common';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

jest.mock('../../../lib/components/popover/utils/positions', () => ({
  ...jest.requireActual('../../../lib/components/popover/utils/positions'),
  calculatePosition: () => ({
    internalPosition: 'top-right',
    boundingOffset: { top: 100, left: 100, width: 200, height: 100 },
  }),
  getOffsetDimensions: () => ({ offsetWidth: 100, offsetHeight: 200 }),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

describe('Chart series details', () => {
  const barSeries: MixedLineBarChartProps.DataSeries<string> = {
    type: 'bar',
    title: 'Bar Series 1',
    data: [
      { x: 'Group 1', y: 2 },
      { x: 'Group 2', y: 4 },
      { x: 'Group 3', y: 4 },
      { x: 'Group 4', y: 9 },
    ],
  };

  const lineSeries: MixedLineBarChartProps.DataSeries<string> = {
    type: 'line',
    title: 'Bar Series 2',
    data: [
      { x: 'Group 1', y: 5 },
      { x: 'Group 2', y: 2 },
      { x: 'Group 3', y: 1 },
      { x: 'Group 4', y: 3 },
    ],
  };

  const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
    type: 'threshold',
    title: 'Threshold 1',
    y: 6,
  };

  const mixedChartProps = {
    series: [barSeries, { ...lineSeries }, thresholdSeries] as ReadonlyArray<
      MixedLineBarChartProps.ChartSeries<string>
    >,
    height: 250,
    xDomain: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
    yDomain: [0, 20],
    xScaleType: 'categorical' as const,
  };

  describe('Links', () => {
    test('renders links in keys', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({ key: <Link>{series.title}</Link>, value: y })}
        />
      );

      wrapper.findApplication()!.focus();
      expect(wrapper.findDetailPopover()!.findSeries()![0].findKey()!.findLink()).toBeTruthy();
    });

    test('renders links in values', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({ key: series.title, value: <Link>{y}</Link> })}
        />
      );

      wrapper.findApplication()!.focus();
      expect(wrapper.findDetailPopover()!.findSeries()![0].findValue()!.findLink()).toBeTruthy();
    });
  });

  describe('Nested items', () => {
    test('renders nested items', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: series.title,
            value: y,
            subItems: [
              {
                key: 'a',
                value: 1,
              },
              {
                key: 'b',
                value: 2,
              },
            ],
          })}
        />
      );

      wrapper.findApplication()!.focus();
      const subItems = wrapper.findDetailPopover()!.findSeries()![0].findSubItems()!;
      expect(subItems[0].findKey()!.getElement()).toHaveTextContent('a');
      expect(subItems[0].findValue()!.getElement()).toHaveTextContent('1');
      expect(subItems[1].findKey()!.getElement()).toHaveTextContent('b');
      expect(subItems[1].findValue()!.getElement()).toHaveTextContent('2');
    });

    test('does not render nested items list if the length of sub-items is 0', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: series.title,
            value: y,
            subItems: [],
          })}
        />
      );

      wrapper.findApplication()!.focus();
      const series = wrapper.findDetailPopover()!.findSeries()![0];
      expect(series.findSubItems()).toHaveLength(0);
      expect(series.findByClassName(chartSeriesDetailsStyles['.sub-items'])).toBeNull();
      expect(series.getElement().classList).not.toContain(chartSeriesDetailsStyles['with-sub-items']);
    });
  });

  describe('Dev warnings', () => {
    test('logs a warning when `expandable` is used for a series with no sub-items', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: series.title,
            value: y,
            expandable: true,
          })}
        />
      );

      wrapper.findApplication()!.focus();
      expect(warnOnce).toHaveBeenCalledWith(
        'MixedLineBarChart',
        '`expandable` was set to `true` for a series without sub-items. This property will be ignored.'
      );
    });

    test('logs a warning and ignores the custom property when a ReactNode is used for an expandable key', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: <Link>{series.title}</Link>,
            value: y,
            expandable: true,
            subItems: [
              {
                key: 'a',
                value: 1,
              },
            ],
          })}
        />
      );

      wrapper.findApplication()!.focus();
      expect(warnOnce).toHaveBeenCalledWith(
        'MixedLineBarChart',
        'A ReactNode was used for the key of an expandable series. The series title will be used instead because nested interactive elements can cause accessiblity issues'
      );
    });

    test('logs a warning when a ReactNode is used for both key and value', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          {...mixedChartProps}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: <Link>{series.title}</Link>,
            value: <Link>{y}</Link>,
          })}
        />
      );

      wrapper.findApplication()!.focus();
      expect(warnOnce).toHaveBeenCalledWith(
        'MixedLineBarChart',
        'Use a ReactNode for the key or the value of a series, but not for both'
      );
    });
  });
});
