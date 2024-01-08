// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';

import { barChartInstructions, commonProps, data3 } from './common';
import { BarChart, Tabs } from '~components';

export default function () {
  return (
    <Box margin="m">
      <h1>Mixed chart integration test</h1>
      <Tabs
        tabs={[{ id: 'chart', label: 'Chart', content: <Chart /> }]}
        i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
      />
    </Box>
  );
}

function Chart() {
  return (
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
    />
  );
}
