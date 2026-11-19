// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';
import PieChart, { PieChartProps } from '~components/pie-chart';

import ScreenshotArea from '../utils/screenshot-area';
import { commonProps } from './common';

const data: Array<PieChartProps.Datum> = [
  { title: 'Product A', value: 130 },
  { title: 'Product B', value: 30 },
  { title: 'Product C', value: 20 },
  { title: 'Product D', value: 10 },
  { title: 'Product E', value: 10 },
];

const segmentDescription = (datum: PieChartProps.Datum, sum: number) =>
  `${datum.value} items, ${((datum.value / sum) * 100).toFixed(0)}%`;

export default function () {
  const [activeSegment, setActiveSegment] = useState<PieChartProps.Datum | null>(null);

  return (
    <ScreenshotArea>
      <h1>Controlled Polar charts</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { xxs: 12, s: 12, m: 6, default: 6 } },
            { colspan: { xxs: 12, s: 12, m: 6, default: 6 } },
          ]}
        >
          <Container header={<Header variant="h2">Controlling chart</Header>}>
            <PieChart
              {...commonProps}
              id="chart-1"
              data={data}
              size="medium"
              ariaLabel="Controlling chart"
              segmentDescription={segmentDescription}
              highlightedSegment={activeSegment}
              onHighlightChange={e => {
                setActiveSegment(e.detail.highlightedSegment);
              }}
            />
          </Container>
          <Container header={<Header variant="h2">Passive chart</Header>}>
            <PieChart
              {...commonProps}
              id="chart-2"
              data={data}
              size="medium"
              ariaLabel="Passive chart"
              segmentDescription={segmentDescription}
              highlightedSegment={activeSegment}
              onHighlightChange={e => {
                setActiveSegment(e.detail.highlightedSegment);
              }}
            />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
