// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import PieChart from '~components/pie-chart';
import ScreenshotArea from '../utils/screenshot-area';
import FocusTarget from '../common/focus-target';

import { commonProps, data1, FoodData, segmentDescription1 } from './common';

export default function () {
  return (
    <>
      <h1>Pie chart with links in the values</h1>
      <FocusTarget />
      <ScreenshotArea>
        <PieChart<FoodData>
          {...commonProps}
          hideFilter={true}
          hideLegend={true}
          data={data1}
          size="medium"
          detailPopoverContent={datum =>
            [
              {
                key: 'Popularity',
                value: `${datum.value}%`,
              },
              {
                key: 'Calories per 100g',
                value: `${datum.calories} kcal`,
              },
            ].map(({ key, value }) => ({
              key,
              value: (
                <Link external={true} href="#">
                  {value}
                </Link>
              ),
            }))
          }
          segmentDescription={segmentDescription1}
          hideDescriptions={true}
          hideTitles={true}
        />
      </ScreenshotArea>
    </>
  );
}
