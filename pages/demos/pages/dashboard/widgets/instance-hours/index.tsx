// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Rewritten to use BarChart from @cloudscape-design/components
import React from 'react';

import BarChart from '@cloudscape-design/components/bar-chart';
import Header from '@cloudscape-design/components/header';

import { commonEmptyState, commonNoMatchState, dateFormatter, numberFormatter } from '../chart-commons';
import { WidgetConfig } from '../interfaces';
import { cpuData } from './data';

function InstanceHoursHeader() {
  return (
    <Header variant="h2" description="Daily instance hours by instance type">
      Instance hours
    </Header>
  );
}

function InstanceHoursContent() {
  const series = [
    { title: 'm1.large', type: 'bar' as const, data: cpuData.map(d => ({ x: new Date(d.date), y: d['m1.large'] })) },
    { title: 'm1.xlarge', type: 'bar' as const, data: cpuData.map(d => ({ x: new Date(d.date), y: d['m1.xlarge'] })) },
    { title: 'm1.medium', type: 'bar' as const, data: cpuData.map(d => ({ x: new Date(d.date), y: d['m1.medium'] })) },
    { title: 'm1.small', type: 'bar' as const, data: cpuData.map(d => ({ x: new Date(d.date), y: d['m1.small'] })) },
  ];

  return (
    <BarChart
      series={series}
      xDomain={cpuData.map(d => new Date(d.date))}
      yDomain={[0, 2000]}
      stackedBars={true}
      i18nStrings={{
        xTickFormatter: dateFormatter,
        yTickFormatter: numberFormatter,
        filterLabel: 'Filter displayed instance types',
        filterPlaceholder: 'Filter instance types',
        filterSelectedAriaLabel: 'selected',
        legendAriaLabel: 'Legend',
        chartAriaRoleDescription: 'bar chart',
        xAxisAriaRoleDescription: 'x axis',
        yAxisAriaRoleDescription: 'y axis',
      }}
      ariaLabel="Instance hours"
      fitHeight={true}
      height={300}
      xTitle="Date"
      yTitle="Total instance hours"
      empty={commonEmptyState}
      noMatch={commonNoMatchState}
    />
  );
}

export const instanceHours: WidgetConfig = {
  definition: { defaultRowSpan: 4, defaultColumnSpan: 2, minRowSpan: 3 },
  data: {
    icon: 'barChart',
    title: 'Instance hours',
    description: 'Daily instance hours by instance type',
    header: InstanceHoursHeader,
    content: InstanceHoursContent,
    staticMinHeight: 560,
  },
};
