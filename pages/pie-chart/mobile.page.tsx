// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Box from '~components/box';
import PieChart from '~components/pie-chart';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, data1, data2, data3, FoodData, segmentDescription1 } from './common';

export default function () {
  return (
    <ScreenshotArea>
      <h1>Polar charts</h1>
      <Box padding="l">
        <SpaceBetween size="m">
          <Container header={<Header variant="h2">Food facts</Header>}>
            <PieChart<FoodData>
              {...commonProps}
              data={data1}
              ariaLabel="Food facts"
              size="small"
              legendTitle="Legend"
              ariaDescription="Potatoes are most delicious"
              detailPopoverContent={datum => [
                {
                  key: 'Popularity',
                  value: `${datum.value}%`,
                },
                {
                  key: 'Calories per 100g',
                  value: `${datum.calories} kcal`,
                },
              ]}
              segmentDescription={segmentDescription1}
              hideFilter={true}
            />
          </Container>
          <Container header={<Header variant="h2">Donut Chart</Header>}>
            <PieChart
              {...commonProps}
              data={data3}
              size="small"
              variant="donut"
              ariaLabel="Donut chart"
              ariaDescription="Product A is the most popular"
              hideFilter={true}
              innerMetricValue="200"
              innerMetricDescription="Items sold"
              hideDescriptions={true}
              i18nStrings={{
                ...commonProps.i18nStrings,
                chartAriaRoleDescription: 'donut chart',
              }}
            />
          </Container>
          <Container header={<Header variant="h2">Minimal pie Chart</Header>}>
            <PieChart
              {...commonProps}
              ariaLabel="Minimal pie chart"
              size="small"
              variant="donut"
              data={[
                { title: 'Complete', value: 160, color: '#3481CC' },
                { title: 'Incomplete', value: 40, color: '#879596' },
                { title: 'Error', value: 0, color: '#ba2e0f' },
              ]}
              innerMetricValue="80%"
              innerMetricDescription={'Complete'}
              hideFilter={true}
            />
          </Container>
          <Container header={<Header variant="h2">Pie Chart</Header>}>
            <PieChart {...commonProps} ariaLabel="Some pie chart" data={data2} size="small" hideFilter={true} />
          </Container>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
