// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Rewritten to use LineChart from @cloudscape-design/components
import React from 'react';

import Header from '@cloudscape-design/components/header';
import LineChart from '@cloudscape-design/components/line-chart';

import { commonEmptyState, commonNoMatchState, dateTimeFormatter, numberFormatter } from '../chart-commons';
import { WidgetConfig } from '../interfaces';
import { networkTrafficSeries } from './data';

function NetworkTrafficHeader() {
  return (
    <Header variant="h2" description="Incoming and outgoing network traffic">
      Network traffic
    </Header>
  );
}

function NetworkTrafficContent() {
  return (
    <LineChart
      series={networkTrafficSeries}
      xDomain={[
        networkTrafficSeries[0].data[0].x,
        networkTrafficSeries[0].data[networkTrafficSeries[0].data.length - 1].x,
      ]}
      yDomain={[0, 200000]}
      i18nStrings={{
        xTickFormatter: dateTimeFormatter,
        yTickFormatter: numberFormatter,
        filterLabel: 'Filter displayed instances',
        filterPlaceholder: 'Filter instances',
        filterSelectedAriaLabel: 'selected',
        legendAriaLabel: 'Legend',
        chartAriaRoleDescription: 'line chart',
        xAxisAriaRoleDescription: 'x axis',
        yAxisAriaRoleDescription: 'y axis',
      }}
      ariaLabel="Network traffic"
      fitHeight={true}
      height={300}
      xTitle="Time (UTC)"
      yTitle="Data transferred"
      empty={commonEmptyState}
      noMatch={commonNoMatchState}
    />
  );
}

export const networkTraffic: WidgetConfig = {
  definition: { defaultRowSpan: 4, defaultColumnSpan: 2, minRowSpan: 3 },
  data: {
    icon: 'lineChart',
    title: 'Network traffic',
    description: 'Incoming and outgoing network traffic',
    header: NetworkTrafficHeader,
    content: NetworkTrafficContent,
    staticMinHeight: 560,
  },
};

export default NetworkTrafficContent;
