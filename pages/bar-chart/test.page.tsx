// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Grid from '~components/grid';
import Box from '~components/box';
import BarChart from '~components/bar-chart';
import ButtonDropdown from '~components/button-dropdown';
import ScreenshotArea from '../utils/screenshot-area';

import {
  data3,
  commonProps,
  dateTimeFormatter,
  multipleBarsData,
  barTimeSeries,
  barTimeData,
  barChartInstructions,
} from '../mixed-line-bar-chart/common';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Bar chart integration test</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
            { colspan: { s: 12, m: 6, default: 6 } },
          ]}
        >
          <div>
            <input id="focus-target" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart"
              height={250}
              series={[{ title: 'Calories', type: 'bar', data: data3 }]}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart"
              ariaDescription={barChartInstructions}
              detailPopoverFooter={() => (
                <ButtonDropdown
                  items={[
                    { id: '1', text: 'View' },
                    { id: '2', text: 'Add to filter' },
                  ]}
                  expandToViewport={true}
                >
                  Actions
                </ButtonDropdown>
              )}
            />
          </div>
          <BarChart
            {...commonProps}
            id="chart-grouped"
            height={250}
            series={[...multipleBarsData, { title: 'Threshold', type: 'threshold', y: 9 }]}
            xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
            yDomain={[0, 12]}
            xTitle="Food"
            yTitle="Consumption"
            xScaleType="categorical"
            ariaLabel="Grouped bar chart"
            ariaDescription={barChartInstructions}
          />
          <div>
            <input id="focus-target-2" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart-stacked"
              height={300}
              series={barTimeSeries}
              xDomain={barTimeData.map(({ x }) => new Date(x.getTime()))}
              yDomain={[0, 2000000]}
              xTitle="Time (UTC)"
              yTitle="Bytes transferred"
              xScaleType="categorical"
              stackedBars={true}
              ariaLabel="Multiple data series line chart"
              i18nStrings={{ ...commonProps.i18nStrings, xTickFormatter: dateTimeFormatter }}
              ariaDescription={barChartInstructions}
            />
          </div>

          <BarChart
            {...commonProps}
            id="chart-horizontal"
            height={300}
            series={multipleBarsData}
            xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
            yDomain={[0, 8]}
            xTitle="Food"
            yTitle="Consumption"
            xScaleType="categorical"
            horizontalBars={true}
            ariaLabel="Horizontal bar chart"
            ariaDescription={barChartInstructions}
          />
          <div>
            <input id="focus-target-3" aria-label="focus input" placeholder="focus input" />
            <BarChart
              {...commonProps}
              id="chart-title-wrapping"
              height={250}
              series={[
                { title: 'An extremely long series title causing wrapping in the popover', type: 'bar', data: data3 },
              ]}
              xDomain={['Potatoes', 'Tangerines', 'Chocolate', 'Apples', 'Oranges']}
              yDomain={[0, 700]}
              xTitle="Food"
              yTitle="Calories (kcal)"
              xScaleType="categorical"
              ariaLabel="Bar chart"
              ariaDescription={barChartInstructions}
            />
          </div>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
