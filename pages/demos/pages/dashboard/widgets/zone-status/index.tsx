// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Rewritten to use PieChart from @cloudscape-design/components
import React from 'react';

import Header from '@cloudscape-design/components/header';
import PieChart from '@cloudscape-design/components/pie-chart';

import { percentageFormatter } from '../chart-commons';
import { WidgetConfig } from '../interfaces';

function ZoneStatusHeader() {
  return (
    <Header variant="h2">
      Zone status - <i>beta</i>
    </Header>
  );
}

function ZoneStatusContent() {
  return (
    <PieChart
      data={[
        { title: 'Operating normally', value: 18 },
        { title: 'Disrupted', value: 2 },
      ]}
      segmentDescription={(datum, sum) => `${datum.value} zones, ${percentageFormatter(datum.value / sum)}`}
      detailPopoverContent={(datum, sum) => [
        { key: 'Zone count', value: datum.value },
        { key: 'Percentage', value: percentageFormatter(datum.value / sum) },
      ]}
      ariaLabel="Zone status chart"
      ariaDescription="Pie chart summarizing the status of all zones."
      fitHeight={true}
      size="large"
      i18nStrings={{
        filterLabel: 'Filter displayed data',
        filterPlaceholder: 'Filter data',
        filterSelectedAriaLabel: 'selected',
        legendAriaLabel: 'Legend',
        chartAriaRoleDescription: 'pie chart',
        segmentAriaRoleDescription: 'segment',
        detailPopoverDismissAriaLabel: 'Dismiss',
      }}
      empty={<span>No data available</span>}
      noMatch={<span>No matching data</span>}
    />
  );
}

export const zoneStatus: WidgetConfig = {
  definition: { defaultRowSpan: 4, defaultColumnSpan: 2, minRowSpan: 3 },
  data: {
    icon: 'pieChart',
    title: 'Zone status',
    description: 'Zone status report',
    header: ZoneStatusHeader,
    content: ZoneStatusContent,
    staticMinHeight: 450,
  },
};
