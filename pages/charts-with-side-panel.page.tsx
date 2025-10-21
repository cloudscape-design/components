// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { AppLayout, Button, MixedLineBarChartProps, PieChart, SpaceBetween, SplitPanel } from '~components';
import LineChart from '~components/line-chart';

import { SimplePage } from './app/templates';
import labels from './app-layout/utils/labels';
import { splitPaneli18nStrings } from './app-layout/utils/strings';
import AreaChartExample from './area-chart/example';
import { createLinearTimeLatencyProps } from './area-chart/series';
import { commonProps as commonLineProps, data2 as lineData } from './mixed-line-bar-chart/common';
import { commonProps as commonPieProps, data1 as pieData } from './pie-chart/common';

const linearLatencyProps = createLinearTimeLatencyProps();

type ExpectedSeries = MixedLineBarChartProps.LineDataSeries<number> | MixedLineBarChartProps.ThresholdSeries;

const series: ReadonlyArray<ExpectedSeries> = [
  { title: 'Series 1', type: 'line', data: lineData },
  { title: 'Threshold', type: 'threshold', y: 150 },
];

export default function () {
  const [splitPanelSize, setSplitPanelSize] = useState(300);
  const [sidePanelVisible, setSidePanelVisible] = useState(false);
  const toggleButton = <Button onClick={() => setSidePanelVisible(prev => !prev)}>Toggle side panel</Button>;
  return (
    <AppLayout
      ariaLabels={labels}
      navigationHide={true}
      toolsHide={true}
      splitPanelOpen={sidePanelVisible}
      splitPanelPreferences={{ position: 'side' }}
      splitPanel={
        <SplitPanel header="Details" i18nStrings={splitPaneli18nStrings}>
          Side panel content
        </SplitPanel>
      }
      splitPanelSize={splitPanelSize}
      onSplitPanelResize={({ detail }) => setSplitPanelSize(detail.size)}
      content={
        <SimplePage
          title="Line chart with side panel demo"
          subtitle="Open side panel from chart's popover. The popover's position should be updated."
          screenshotArea={{}}
        >
          <SpaceBetween size="m">
            <LineChart
              {...commonLineProps}
              hideFilter={true}
              height={200}
              series={series}
              xTitle="Time"
              yTitle="Latency (ms)"
              xScaleType="linear"
              ariaLabel="Line chart"
              detailPopoverFooter={() => toggleButton}
            />

            <AreaChartExample
              name="Linear latency chart"
              {...linearLatencyProps}
              detailPopoverFooter={() => toggleButton}
            />

            <PieChart
              {...commonPieProps}
              data={pieData}
              ariaLabel="Food facts"
              size="medium"
              detailPopoverFooter={() => toggleButton}
            />
          </SpaceBetween>
        </SimplePage>
      }
    />
  );
}
