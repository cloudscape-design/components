// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import AreaChart, { AreaChartProps } from '~components/area-chart';
import Container from '~components/container';
import Header from '~components/header';

function makeId(name: string, isPermutation?: boolean) {
  if (isPermutation) {
    return undefined;
  }

  return name.toLowerCase().replace(/ /g, '-');
}

export type ExampleProps<T extends AreaChartProps.DataTypes> = AreaChartProps<T> & {
  name: string;
  xTickFormatter?: any;
  yTickFormatter?: any;
  isPermutation?: boolean;
};

export default function Example<T extends AreaChartProps.DataTypes>({
  name,
  xTickFormatter,
  yTickFormatter,
  isPermutation,
  ...chartProps
}: ExampleProps<T>) {
  return (
    <Container header={<Header variant="h2">{name}</Header>}>
      <AreaChart
        id={makeId(name, isPermutation)}
        height={250}
        loadingText="Loading chart data..."
        errorText="Error loading chart data."
        recoveryText="Retry"
        onRecoveryClick={() => {}}
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data</b>
            <Box variant="p" color="inherit">
              There is no data to display
            </Box>
          </Box>
        }
        noMatch={
          <Box textAlign="center" color="inherit">
            <b>No matching data</b>
            <Box padding={{ bottom: 's' }} variant="p" color="inherit">
              There is no data to display
            </Box>
            <Button onClick={() => alert('Not implemented in the example')}>Clear filter</Button>
          </Box>
        }
        ariaLabel={name}
        ariaDescription="Use up/down arrow keys to navigate between series, and left/right arrow keys to navigate within a series."
        i18nStrings={{
          filterLabel: 'Filter displayed data',
          filterPlaceholder: 'Filter data',
          filterSelectedAriaLabel: '(selected)',
          detailTotalLabel: 'Total',
          detailPopoverDismissAriaLabel: 'Dismiss',
          legendAriaLabel: 'Legend',
          chartAriaRoleDescription: 'area chart',
          xAxisAriaRoleDescription: 'x axis',
          yAxisAriaRoleDescription: 'y axis',
          yTickFormatter: yTickFormatter || numberFormatter,
          xTickFormatter,
        }}
        {...chartProps}
      />
    </Container>
  );
}

export function numberFormatter(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value.toFixed(2);
}

export function dateTimeFormatter(date: Date) {
  return date
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    })
    .replace(', ', ',\n');
}
