// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import MixedLineBarChart from '~components/mixed-line-bar-chart';
import { colorChartsThresholdInfo } from '~design-tokens';

import { barChartInstructions, commonProps, data3, data4 } from './common';
import { Modal } from '~components';

export default function () {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Box margin="m">
      <h1>Mixed chart integration test</h1>
      <Button onClick={() => setIsOpen(true)}>Show in modal</Button>
      {isOpen ? (
        <Modal visible={true} onDismiss={() => setIsOpen(false)}>
          <Chart />
        </Modal>
      ) : (
        <Chart />
      )}
    </Box>
  );
}

function Chart() {
  return (
    <MixedLineBarChart
      id="chart"
      {...commonProps}
      height={250}
      series={[
        { title: 'Happiness', type: 'bar', data: data4.filter(({ x }) => x !== 'Chocolate') },
        { title: 'Calories', type: 'line', data: data3 },
        { title: 'Threshold', type: 'threshold', y: 420, color: colorChartsThresholdInfo },
      ]}
      xDomain={data3.map(d => d.x)}
      yDomain={[0, 650]}
      xTitle="Food"
      yTitle="Calories (kcal)"
      xScaleType="categorical"
      ariaLabel="Mixed chart 1"
      ariaDescription={barChartInstructions}
      detailPopoverFooter={xValue => <Button>Filter by {xValue}</Button>}
    />
  );
}
