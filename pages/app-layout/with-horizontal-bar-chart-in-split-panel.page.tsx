// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SplitPanel } from '~components';
import AppLayout from '~components/app-layout';
import BarChart from '~components/bar-chart';

import { barChartInstructions, commonProps, multipleBarsData } from '../mixed-line-bar-chart/common';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        analyticsMetadata={{
          flowType: 'home',
          instanceIdentifier: 'demo-page',
        }}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        splitPanel={
          <SplitPanel header="Split panel" i18nStrings={splitPaneli18nStrings}>
            <BarChart
              {...commonProps}
              height={400}
              series={multipleBarsData}
              xDomain={['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']}
              yDomain={[0, 8]}
              xTitle="Food"
              yTitle="Consumption"
              xScaleType="categorical"
              horizontalBars={true}
              ariaLabel="Horizontal Bar Chart with negative values"
              ariaDescription={barChartInstructions}
            />
          </SplitPanel>
        }
      />
    </ScreenshotArea>
  );
}
