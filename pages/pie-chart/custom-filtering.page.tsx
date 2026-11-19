// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import PieChart from '~components/pie-chart';
import Toggle from '~components/toggle';

import ScreenshotArea from '../utils/screenshot-area';
import { commonProps, data1, FoodData } from './common';

export default function () {
  const [visibleSegments, setVisibleSegments] = useState<ReadonlyArray<FoodData>>(data1);
  const [checked, setChecked] = useState(false);

  return (
    <ScreenshotArea>
      <h1>Pie charts with additional filtering</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Food facts</Header>}>
          <PieChart<FoodData>
            {...commonProps}
            data={data1}
            ariaLabel="Food facts"
            size="large"
            legendTitle="Legend"
            onFilterChange={e => {
              console.log(e.detail);
              setVisibleSegments(e.detail.visibleSegments);
            }}
            visibleSegments={visibleSegments}
            additionalFilters={
              <Toggle
                checked={checked}
                onChange={e => {
                  setChecked(e.detail.checked);
                  if (e.detail.checked) {
                    setVisibleSegments(visibleSegments.filter(segment => segment.calories < 75));
                  } else {
                    setVisibleSegments(data1);
                  }
                }}
              >
                Only below 75 calories
              </Toggle>
            }
          />
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
