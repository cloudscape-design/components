// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import LineChart from '~components/line-chart';
import Link from '~components/link';

import ScreenshotArea from '../utils/screenshot-area';
import { networkTrafficDomain, networkTrafficSeries } from './line-chart-data';

const numberTickFormatter = (value: number) => {
  if (Math.abs(value) < 1000) {
    return value.toString();
  }
  return (value / 1000).toFixed() + 'k';
};

const dateTimeFormatter = (date: Date) =>
  date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
    .split(',')
    .join('\n');

const commonChartProps = {
  loadingText: 'Loading chart',
  errorText: 'Error loading data.',
  recoveryText: 'Retry',
  empty: (
    <Box textAlign="center" color="inherit">
      <b>No data available</b>
      <Box variant="p" color="inherit">
        There is no data available
      </Box>
    </Box>
  ),
  noMatch: (
    <Box textAlign="center" color="inherit">
      <b>No matching data</b>
      <Box variant="p" color="inherit">
        There is no matching data to display
      </Box>
    </Box>
  ),
  i18nStrings: {
    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    filterSelectedAriaLabel: 'selected',
    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'line chart',
    xAxisAriaRoleDescription: 'x axis',
    yAxisAriaRoleDescription: 'y axis',
    yTickFormatter: numberTickFormatter,
  },
};

export default function () {
  return (
    <ScreenshotArea>
      <Container header={<Header>Networking</Header>}>
        <LineChart
          {...commonChartProps}
          hideFilter={true}
          fitHeight={true}
          height={25}
          series={networkTrafficSeries}
          yDomain={[0, 200000]}
          xDomain={networkTrafficDomain}
          xScaleType="time"
          xTitle="Time (UTC)"
          yTitle="Data transferred"
          xTickFormatter={dateTimeFormatter}
          ariaLabel="Network traffic"
          ariaDescription={'Line chart showing transferred data of all your instances.'}
          i18nStrings={{
            ...commonChartProps.i18nStrings,
            filterLabel: 'Filter displayed instances',
            filterPlaceholder: 'Filter instances',
          }}
          detailPopoverSeriesContent={({ series, y }) => ({
            key: (
              <Link external={true} href="#">
                {series.title}
              </Link>
            ),
            value: y,
          })}
        />
      </Container>
    </ScreenshotArea>
  );
}
