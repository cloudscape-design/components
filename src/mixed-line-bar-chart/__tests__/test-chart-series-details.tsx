// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Link from '../../../lib/components/link';
import { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import chartSeriesDetailsStyles from '../../../lib/components/internal/components/chart-series-details/styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { MixedLineBarChartWrapper } from '../../../lib/components/test-utils/dom/index.js';
import { BarChartProps } from '../../../lib/components/bar-chart/interfaces.js';
import { BarChartWrapper, LineChartWrapper } from '../../../lib/components/test-utils/dom';
import { LineChartProps } from '../../../lib/components/line-chart/interfaces.js';

type RenderBarChart = (props: BarChartProps<string>) => {
  wrapper: BarChartWrapper;
};

type RenderLineChart = (props: LineChartProps<string>) => {
  wrapper: LineChartWrapper;
};

type RenderMixedChart = (props: MixedLineBarChartProps<string>) => {
  wrapper: MixedLineBarChartWrapper;
};

export default function testChartSeriesDetails({
  renderChart,
}: {
  renderChart: RenderBarChart | RenderLineChart | RenderMixedChart;
}) {
  afterEach(() => {
    (warnOnce as jest.Mock).mockReset();
  });

  describe('Chart series details', () => {
    const chartProps = {
      series: [],
      height: 250,
      xDomain: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
      yDomain: [0, 20],
      xScaleType: 'categorical' as const,
    };

    describe('Links', () => {
      test('renders links in keys', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: <Link>{series.title}</Link>,
            value: y,
          }),
        });

        wrapper.findApplication()!.focus();
        expect(wrapper.findDetailPopover()!.findSeries()![0].findKey()!.findLink()).toBeTruthy();
      });

      test('renders links in values', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: series.title,
            value: <Link>{y}</Link>,
          }),
        });

        wrapper.findApplication()!.focus();
        expect(wrapper.findDetailPopover()!.findSeries()![0].findValue()!.findLink()).toBeTruthy();
      });
    });

    describe('Nested items', () => {
      describe('renders nested items', () => {
        test.each([false, true])('with expandable sub-items: %s', expandable => {
          const { wrapper } = renderChart({
            ...chartProps,
            detailPopoverSeriesContent: ({
              series,
              y,
            }: {
              series: MixedLineBarChartProps.ChartSeries<string>;
              y: number;
            }) => ({
              key: series.title,
              value: y,
              expandable,
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
            }),
          });

          wrapper.findApplication()!.focus();
          const subItems = wrapper.findDetailPopover()!.findSeries()![0].findSubItems()!;
          expect(subItems[0].findKey()!.getElement()).toHaveTextContent('a');
          expect(subItems[0].findValue()!.getElement()).toHaveTextContent('1');
          expect(subItems[1].findKey()!.getElement()).toHaveTextContent('b');
          expect(subItems[1].findValue()!.getElement()).toHaveTextContent('2');
        });
      });

      test('does not render nested items list if the length of sub-items is 0', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: series.title,
            value: y,
            subItems: [],
          }),
        });

        wrapper.findApplication()!.focus();
        const series = wrapper.findDetailPopover()!.findSeries()![0];
        expect(series.findSubItems()).toHaveLength(0);
        expect(series.findByClassName(chartSeriesDetailsStyles['.sub-items'])).toBeNull();
        expect(series.getElement().classList).not.toContain(chartSeriesDetailsStyles['with-sub-items']);
      });
    });

    describe('Dev warnings', () => {
      test('logs a warning when `expandable` is used for a series with no sub-items', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: series.title,
            value: y,
            expandable: true,
          }),
        });

        wrapper.findApplication()!.focus();
        expect(warnOnce).toHaveBeenCalledWith(
          'MixedLineBarChart',
          '`expandable` was set to `true` for a series without sub-items. This property will be ignored.'
        );
      });

      test('logs a warning and ignores the custom property when a ReactNode is used for an expandable key', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: <Link>{series.title}</Link>,
            value: y,
            expandable: true,
            subItems: [
              {
                key: 'a',
                value: 1,
              },
            ],
          }),
        });

        wrapper.findApplication()!.focus();
        expect(warnOnce).toHaveBeenCalledWith(
          'MixedLineBarChart',
          'A ReactNode was used for the key of an expandable series. The series title will be used instead because nested interactive elements can cause accessiblity issues'
        );
      });

      test('logs a warning when a ReactNode is used for both key and value', () => {
        const { wrapper } = renderChart({
          ...chartProps,
          detailPopoverSeriesContent: ({ series, y }) => ({
            key: <Link>{series.title}</Link>,
            value: <Link>{y}</Link>,
          }),
        });

        wrapper.findApplication()!.focus();
        expect(warnOnce).toHaveBeenCalledWith(
          'MixedLineBarChart',
          'Use a ReactNode for the key or the value of a series, but not for both'
        );
      });
    });
  });
}
