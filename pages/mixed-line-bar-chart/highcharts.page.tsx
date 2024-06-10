// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { merge } from 'lodash';
import Box from '~components/box';
import Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import ScreenshotArea from '../utils/screenshot-area';
import {
  fontFamilyBase,
  fontSizeBodyS,
  fontSizeBodyM,
  colorTextBodyDefault,
  colorTextBodySecondary,
  fontWeightHeadingS,
  colorChartsLineTick,
  colorChartsThresholdNeutral,
  colorChartsPaletteCategorical1,
  colorChartsPaletteCategorical2,
  colorChartsPaletteCategorical3,
  colorChartsPaletteCategorical4,
  colorChartsPaletteCategorical5,
  colorChartsPaletteCategorical6,
  colorChartsPaletteCategorical7,
  colorChartsPaletteCategorical8,
  colorChartsPaletteCategorical9,
  colorChartsPaletteCategorical10,
  colorBorderPopover,
} from '~design-tokens';

import { data1, data2, data3, data4, commonProps, lineChartInstructions } from './common';
import {
  data1 as pieData1,
  data3 as pieData3,
  overlappingData,
  commonProps as pieCommonProps,
} from '../pie-chart/common';
import { ColumnLayout, LineChart, PieChart, SpaceBetween } from '~components';

HighchartsAccessibility(Highcharts);
HighchartsMore(Highcharts);

Highcharts.AST.allowedAttributes.push('data-reactroot');

const AXIS_OPTIONS: Highcharts.XAxisOptions & Highcharts.YAxisOptions = {
  tickColor: colorChartsLineTick,
  lineColor: colorChartsLineTick,
  gridLineColor: colorChartsLineTick,
  lineWidth: 2,
  crosshair: true,
  title: {
    style: {
      color: colorTextBodyDefault,
      fontSize: fontSizeBodyM,
      fontWeight: fontWeightHeadingS,
    },
  },
  labels: {
    style: {
      color: colorTextBodySecondary,
      fontSize: fontSizeBodyS,
    },
  },
};

const BASE_THEME: Highcharts.Options = {
  colors: [
    colorChartsPaletteCategorical1,
    colorChartsPaletteCategorical2,
    colorChartsPaletteCategorical3,
    colorChartsPaletteCategorical4,
    colorChartsPaletteCategorical5,
    colorChartsPaletteCategorical6,
    colorChartsPaletteCategorical7,
    colorChartsPaletteCategorical8,
    colorChartsPaletteCategorical9,
    colorChartsPaletteCategorical10,
  ],
  chart: {
    backgroundColor: 'transparent',
    style: {
      font: fontFamilyBase,
      color: colorTextBodyDefault,
      fontSize: fontSizeBodyM,
    },
  },
  xAxis: AXIS_OPTIONS,
  yAxis: merge({}, AXIS_OPTIONS, {
    lineWidth: 0,
  }),
  legend: {
    enabled: true,
    align: 'left',
    verticalAlign: 'bottom',
    squareSymbol: true,
    itemStyle: {
      fontSize: fontSizeBodyM,
    },
  },
  tooltip: {
    enabled: true,
    shape: 'callout',
    headerShape: 'callout',
    shared: true,
    stickOnContact: true,
    useHTML: true,
    headerFormat: ReactDOMServer.renderToString(
      <Box variant="h2" fontSize="heading-xs">
        {'{point.key}'}
      </Box>
    ),
    borderRadius: 8,
    borderColor: colorBorderPopover,
    borderWidth: 2,
    // backgroundColor: colorBackgroundPopover,
    shadow: false,
    padding: 12,
    style: {
      fontSize: fontSizeBodyM,
    },
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
};

Highcharts.setOptions(BASE_THEME);

export default function () {
  const options: Highcharts.Options = {
    title: { text: '' },
    series: [
      { type: 'line', data: data1 },
      { type: 'line', data: data2 },
    ],
    xAxis: {
      title: { text: 'Time' },
    },
    yAxis: {
      title: { text: 'Latency (ms)' },
      plotLines: [
        {
          value: 150,
          label: {
            // text: 'Threshold',
          },
          color: colorChartsThresholdNeutral,
          width: 2,
          dashStyle: 'ShortDash',
        },
      ],
    },
  };

  const pieChartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: ReactDOMServer.renderToString(
        <>
          <Box variant="h1" tagOverride="div" color="text-label" padding="n" textAlign="center">
            200
            <Box variant="h3" color="text-body-secondary" tagOverride="div" padding="n">
              Items sold
            </Box>
          </Box>
        </>
      ),
      useHTML: true,
      floating: true,
      align: 'center',
      verticalAlign: 'middle',
    },
    plotOptions: {
      pie: {
        shadow: false,
        borderRadius: 4,
      },
    },
    legend: {
      enabled: true,
    },

    series: [
      {
        type: 'pie',
        name: 'something',
        innerSize: '80%',
        data: overlappingData.map(({ title, value }) => ({ name: title, y: value })),
        dataLabels: {
          style: {
            font: fontFamilyBase,
            color: colorTextBodyDefault,
            fontSize: fontSizeBodyM,
            fontWeight: fontWeightHeadingS,
            textOutline: '',
          },
        },
      },
    ],
  };

  const multiAxisOptions: Highcharts.Options = {
    title: {
      text: '',
    },
    series: [
      {
        type: 'column',
        data: data4.map(({ y }) => y),
      },
      {
        type: 'line',
        data: data3.map(({ y }) => y),
      },
    ],
    xAxis: [
      {
        title: {
          text: 'Time',
        },
        crosshair: true,
        categories: data3.map(d => d.x),
      },
    ],
    yAxis: [
      {
        title: {
          text: 'Happiness',
        },
        opposite: true,
      },
      {
        title: {
          text: 'Calories',
        },
      },
    ],
  };

  return (
    <ScreenshotArea>
      <h2>Mixed charts</h2>
      <Box padding="l">
        <ColumnLayout columns={2}>
          <HighchartsReact highcharts={Highcharts} options={options} />
          <LineChart
            {...commonProps}
            height={250}
            series={[
              { title: 'Series 1', type: 'line', data: data1 },
              { title: 'Series 2', type: 'line', data: data2 },
              { title: 'Threshold', type: 'threshold', y: 150 },
            ]}
            xDomain={[0, 32]}
            yDomain={[0, 300]}
            xTitle="Time"
            yTitle="Latency (ms)"
            xScaleType="linear"
            ariaLabel="Line chart"
            hideFilter={true}
            ariaDescription={lineChartInstructions}
          />
        </ColumnLayout>
      </Box>

      <h2>Pie charts</h2>
      <Box padding="l">
        <ColumnLayout columns={2}>
          <HighchartsReact highcharts={Highcharts} options={merge({}, BASE_THEME, pieChartOptions)} />
          <PieChart
            {...pieCommonProps}
            data={overlappingData}
            size="medium"
            variant="donut"
            ariaLabel="Donut chart"
            ariaDescription="Product A is the most popular"
            innerMetricValue="200"
            innerMetricDescription="Items sold"
            hideDescriptions={true}
            hideLegend={true}
            hideFilter={true}
            i18nStrings={{
              ...pieCommonProps.i18nStrings,
              chartAriaRoleDescription: 'donut chart',
            }}
          />
        </ColumnLayout>
      </Box>

      <h2>Multiple axes (now possible with Highcharts!)</h2>
      <Box padding="l">
        <HighchartsReact highcharts={Highcharts} options={merge({}, BASE_THEME, multiAxisOptions)} />
      </Box>

      <h2>Erorr thresholds (now possible with Highcharts!)</h2>
      <Box padding="l">
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            title: { text: '' },
            series: [
              { name: 'Stream 1', type: 'column', data: data2.slice(0, 15).map(({ y }) => y) },
              {
                name: 'Error',
                type: 'errorbar',
                data: data2.slice(0, 15).map(({ y }) => [y - Math.random() * 30, y + Math.random() * 15]),
              },
            ],
            yAxis: {
              title: { text: 'Latency' },
            },
          }}
        />
      </Box>
    </ScreenshotArea>
  );
}
