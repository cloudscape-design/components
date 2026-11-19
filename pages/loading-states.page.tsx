// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { BarChart, Box, Button, ButtonDropdown, Cards, SpaceBetween, Table } from '~components';

import { cardDefinition } from './cards/hooks.page';
import { barChartInstructions, commonProps, data3 } from './mixed-line-bar-chart/common';
import { generateItems } from './table/generate-data';
import { columnsConfig } from './table/shared-configs';

const tableItems = generateItems(10);

export default function () {
  const [isEmpty, setIsEmpty] = useState(true);
  const [statusType, setStatus] = useState<'loading' | 'error' | 'finished'>('finished');

  useEffect(() => {
    // Start fetching data
    setTimeout(() => {
      setStatus('loading');
    }, 5000);

    // Imitate an error
    setTimeout(() => {
      setStatus('error');
    }, 10000);

    // Imitate retry
    setTimeout(() => {
      setStatus('loading');
    }, 15000);

    // Data fetched
    setTimeout(() => {
      setIsEmpty(false);
      setStatus('finished');
    }, 20000);
  }, []);

  return (
    <div>
      <h1>Loading states</h1>
      <Box padding="l">
        <SpaceBetween size="m">
          <Button loading={statusType === 'loading'} loadingText="Preparing submit...">
            Submit
          </Button>

          <ButtonDropdown loading={statusType === 'loading'} loadingText="Preparing actions..." items={[]}>
            Actions
          </ButtonDropdown>

          <ChartExample isEmpty={isEmpty} statusType={statusType} />

          <Table
            header="Instances (Table)"
            columnDefinitions={columnsConfig}
            items={isEmpty ? [] : tableItems}
            empty="No data"
            loading={statusType === 'loading'}
            loadingText="Loading instances table..."
          />

          <Cards
            header="Instances (Cards)"
            cardDefinition={cardDefinition}
            items={isEmpty ? [] : tableItems}
            empty="No data"
            loading={statusType === 'loading'}
            loadingText="Loading instances cards..."
          />
        </SpaceBetween>
      </Box>
    </div>
  );
}

function ChartExample({ isEmpty, statusType }: { isEmpty: boolean; statusType: 'loading' | 'error' | 'finished' }) {
  return (
    <BarChart
      {...commonProps}
      height={250}
      statusType={statusType}
      series={
        isEmpty
          ? []
          : [
              { title: 'Calories', type: 'bar', data: data3 },
              { title: 'Threshold', type: 'threshold', y: 400 },
            ]
      }
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
