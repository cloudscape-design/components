// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box } from '~components';
import ChartFilter from '~components/internal/components/chart-filter';
import {
  colorChartsPaletteCategorical1,
  colorChartsPaletteCategorical2,
  colorChartsThresholdNeutral,
} from '~design-tokens';

export default function () {
  return (
    <Box padding="m">
      <h1>Chart filter demo</h1>

      <ChartFilter
        series={[
          {
            label: 'Site 1',
            color: colorChartsPaletteCategorical1,
            type: 'line',
            datum: 'Site 1',
          },
          {
            label: 'Site 2',
            color: colorChartsPaletteCategorical2,
            type: 'line',
            datum: 'Site 2',
          },
          {
            label: 'Threshold',
            color: colorChartsThresholdNeutral,
            type: 'line',
            datum: 'Threshold',
          },
        ]}
        selectedSeries={['Site 2']}
        onChange={() => {}}
      />
    </Box>
  );
}
