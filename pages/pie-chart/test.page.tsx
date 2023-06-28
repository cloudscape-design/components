// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Grid from '~components/grid';
import Box from '~components/box';
import Button from '~components/button';
import PieChart, { PieChartProps } from '~components/pie-chart';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, data1 } from './common';

interface FoodData {
  title: string;
  value: number;
  description?: string;
  calories: number;
}

export default function () {
  const [activeSegment, setActiveSegment] = useState<PieChartProps.Datum | null>(null);

  return (
    <ScreenshotArea>
      <h1>Pie chart integration test</h1>
      <Box padding="l">
        <Grid
          gridDefinition={[
            { colspan: { xxs: 12, s: 12, m: 6, default: 6 } },
            { colspan: { xxs: 12, s: 12, m: 6, default: 6 } },
          ]}
        >
          <div>
            <input id="focus-target" aria-label="focus input" placeholder="focus input" />
            <PieChart<FoodData>
              {...commonProps}
              id="pie-chart"
              data={data1}
              ariaLabel="Food facts"
              size="medium"
              onHighlightChange={e => setActiveSegment(e.detail.highlightedSegment)}
              detailPopoverFooter={segment => <Button>Filter by {segment.title}</Button>}
            />
          </div>

          <PieChart
            {...commonProps}
            id="pie-chart-2"
            data={data1}
            ariaLabel="Food facts"
            size="medium"
            highlightedSegment={activeSegment}
            onHighlightChange={e => setActiveSegment(e.detail.highlightedSegment)}
          />
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
