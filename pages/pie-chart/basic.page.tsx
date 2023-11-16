// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Grid from '~components/grid';
import Select, { SelectProps } from '~components/select';
import FormField from '~components/form-field';
import Box from '~components/box';
import PieChart from '~components/pie-chart';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, data1, data2, data3, FoodData, segmentDescription1 } from './common';

const statusMap: Record<string, 'finished' | 'loading' | 'error'> = {
  finished: 'finished',
  loading: 'loading',
  error: 'error',
} as const;

const statusOptions: Array<SelectProps.Option> = Object.keys(statusMap).map(status => ({ value: status }));

export default function () {
  const [currentStatus, setStatus] = useState(statusOptions[0]);

  return (
    <ScreenshotArea>
      <h1>Polar charts</h1>
      <Box padding="l">
        <div style={{ width: '20rem' }}>
          <FormField label="Chart status">
            <Select
              options={statusOptions}
              selectedOption={currentStatus}
              onChange={event => setStatus(event.detail.selectedOption)}
            />
          </FormField>
        </div>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 6 } },
            { colspan: { default: 12, s: 4 } },
            { colspan: { default: 12, s: 4 } },
            { colspan: { default: 12, s: 4 } },
          ]}
        >
          <Container header={<Header variant="h2">Food facts</Header>}>
            <PieChart<FoodData>
              {...commonProps}
              statusType={statusMap[currentStatus.value || 'finished']}
              data={data1}
              ariaLabel="Food facts"
              size="medium"
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
              hideDescriptions={true}
              hideTitles={true}
            />
          </Container>
          <Container header={<Header variant="h2">Donut Chart</Header>}>
            <PieChart
              {...commonProps}
              statusType={statusMap[currentStatus.value || 'finished']}
              data={data3}
              size="large"
              variant="donut"
              ariaLabel="Donut chart"
              ariaDescription="Product A is the most popular"
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
              statusType={statusMap[currentStatus.value || 'finished']}
              ariaLabel="Minimal pie chart"
              size="medium"
              variant="donut"
              data={[
                { title: 'Complete', value: 160, color: '#3481CC' },
                { title: 'Incomplete', value: 40, color: '#879596' },
                { title: 'Error', value: 0, color: '#ba2e0f' },
              ]}
              innerMetricValue="80%"
              innerMetricDescription={'Complete'}
              hideTitles={true}
              hideDescriptions={true}
              hideFilter={true}
            />
          </Container>
          <Container header={<Header variant="h2">Pie Chart</Header>}>
            <PieChart {...commonProps} ariaLabel="Some pie chart" data={data2} size="medium" />
          </Container>
          <Container header={<Header variant="h2">Pie Chart</Header>}>
            <PieChart {...commonProps} ariaLabel="Empty pie chart" data={[]} size="medium" />
          </Container>
          <Container header={<Header variant="h2">Pie Chart</Header>}>
            <PieChart {...commonProps} ariaLabel="Loading chart" data={data2} size="medium" statusType="loading" />
          </Container>
          <Container header={<Header variant="h2">Pie Chart</Header>}>
            <PieChart {...commonProps} ariaLabel="Broken pie chart" data={data2} size="medium" statusType="error" />
          </Container>
        </Grid>
      </Box>
    </ScreenshotArea>
  );
}
