// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import { PieChartProps } from '~components/pie-chart';

const commonProps = {
  loadingText: 'Loading chart data...',
  errorText: 'Error loading chart data.',
  recoveryText: 'Retry',
  empty: (
    <Box textAlign="center" color="inherit">
      <b>No data</b>
      <Box variant="p" color="inherit">
        There is no data to display
      </Box>
    </Box>
  ),
  noMatch: (
    <Box textAlign="center" color="inherit">
      <b>No matching data</b>
      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        There is no data to display
      </Box>
      <Button>Clear filter</Button>
    </Box>
  ),
  i18nStrings: {
    detailsValue: 'Value',
    detailsPercentage: 'Percentage',

    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    filterSelectedAriaLabel: '(selected)',
    detailPopoverDismissAriaLabel: 'Dismiss',

    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'pie chart',
    segmentAriaRoleDescription: 'clickable segment',
  },
};

const data1 = [
  {
    title: 'Potatoes',
    value: 50,
    color: 'brown',
    calories: 77,
  },
  { title: 'Chocolate', value: 35, color: 'chocolate', calories: 546 },
  { title: 'Apples', value: 10, color: 'red', calories: 52 },
  { title: 'Oranges', value: 5, color: 'orange', calories: 47 },
];

const segmentDescription1 = (datum: PieChartProps.Datum) => (datum.title === 'Potatoes' ? 'Most delicious' : '');

const data2 = [
  { title: 'Product A', value: 96 },
  { title: 'Product B', value: 1 },
  { title: 'Product C', value: 1 },
  { title: 'Product D', value: 1 },
  { title: 'Product E', value: 1 },
];

const data3 = [
  { title: 'Product A', value: 130 },
  { title: 'Product B', value: 30 },
  { title: 'Product C', value: 20 },
  { title: 'Product D', value: 10 },
  { title: 'Product E', value: 10 },
];

const overlappingData = [
  { title: 'Product A', value: 1 },
  { title: 'Product B', value: 2 },
  { title: 'Product C', value: 1 },
  { title: 'Product D', value: 50 },
  { title: 'Product E', value: 3 },
  { title: 'Product F', value: 1 },
  { title: 'Product G', value: 1 },
];

export interface FoodData {
  title: string;
  value: number;
  description?: string;
  calories: number;
}

export { commonProps, data1, data2, data3, overlappingData, segmentDescription1 };
