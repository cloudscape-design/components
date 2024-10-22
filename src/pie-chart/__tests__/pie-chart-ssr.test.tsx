/**
 * @jest-environment node
 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import PieChart, { PieChartProps } from '../../../lib/components/pie-chart';

const defaultData: Array<PieChartProps.Datum> = [
  {
    title: 'Segment 1',
    value: 20,
  },
  {
    title: 'Segment 2',
    value: 10,
  },
  {
    title: 'Segment 3',
    value: 8,
  },
];

test('renders component without errors in SSR', () => {
  renderToStaticMarkup(
    React.createElement(PieChart, {
      statusType: 'finished',
      data: defaultData,
      visibleSegments: defaultData,
    })
  );
});
