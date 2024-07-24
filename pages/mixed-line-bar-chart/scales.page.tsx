// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import MixedLineBarChart from '~components/mixed-line-bar-chart';

import ScreenshotArea from '../utils/screenshot-area';
import {
  commonProps,
  data2,
  data3,
  dateTimeFormatter,
  latencyData,
  lineChartInstructions,
  logarithmicData,
} from './common';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Mixed charts</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 12 } },
          ]}
        >
          <Container header={<Header variant="h2">Linear Line Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              ariaLabel="Linear line chart"
              series={[{ title: 'Series 1', type: 'line', data: data2 }]}
              xDomain={[0, 12]}
              yDomain={[100, 300]}
              xTitle="X value"
              yTitle="Y value"
              hideFilter={true}
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Linear Bar Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              ariaLabel="Linear line chart"
              series={[{ title: 'Series 1', type: 'bar', data: data3 }]}
              xDomain={data3.map(({ x }) => x)}
              yDomain={[0, 600]}
              xScaleType="categorical"
              xTitle="X value"
              yTitle="Y value"
              hideFilter={true}
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Logarithmic Line Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              ariaLabel="Logarithmic line chart"
              series={[{ title: 'Series 1', type: 'line', data: logarithmicData }]}
              xDomain={[0, 12]}
              yDomain={[100, 1000000]}
              xTitle="X value"
              yTitle="Y value"
              hideFilter={true}
              yScaleType="log"
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Logarithmic Line Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              ariaLabel="Logarithmic line chart"
              series={[{ title: 'Series 1', type: 'line', data: logarithmicData }]}
              xDomain={[1, 12]}
              yDomain={[100, 1000000]}
              xTitle="X value"
              yTitle="Y value"
              xScaleType="log"
              yScaleType="log"
              hideFilter={true}
              ariaDescription={lineChartInstructions}
            />
          </Container>
          <Container header={<Header variant="h2">Time-based Line Chart</Header>}>
            <MixedLineBarChart
              {...commonProps}
              height={250}
              ariaLabel="Time-based line chart"
              series={[
                { title: 'Series 1', type: 'line', data: latencyData.map(({ time, p90 }) => ({ x: time, y: p90 })) },
              ]}
              xDomain={[latencyData[0].time, latencyData[latencyData.length - 1].time]}
              yDomain={[100, 300]}
              xScaleType="time"
              xTitle="X value"
              yTitle="Y value"
              hideFilter={true}
              i18nStrings={{ ...commonProps, xTickFormatter: dateTimeFormatter }}
              ariaDescription={lineChartInstructions}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
