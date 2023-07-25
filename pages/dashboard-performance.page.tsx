// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import {
  AppLayout,
  BarChart,
  BarChartProps,
  Button,
  Checkbox,
  Container,
  ContentLayout,
  Grid,
  Header,
} from '~components';
import AppContext, { AppContextType } from './app/app-context';
import ScreenshotArea from './utils/screenshot-area';
import { barChartInstructions, commonProps, dateTimeFormatter } from './mixed-line-bar-chart/common';

type DemoContext = React.Context<
  AppContextType<{
    fitHeight: boolean;
    hideFilter: boolean;
    hideLegend: boolean;
  }>
>;

const cpuData = [
  { date: new Date(2020, 8, 16), 'm1.large': 878, 'm1.xlarge': 491, 'm1.medium': 284, 'm1.small': 70 },
  { date: new Date(2020, 8, 17), 'm1.large': 781, 'm1.xlarge': 435, 'm1.medium': 242, 'm1.small': 96 },
  { date: new Date(2020, 8, 18), 'm1.large': 788, 'm1.xlarge': 478, 'm1.medium': 311, 'm1.small': 79 },
  { date: new Date(2020, 8, 19), 'm1.large': 729, 'm1.xlarge': 558, 'm1.medium': 298, 'm1.small': 97 },
  { date: new Date(2020, 8, 20), 'm1.large': 988, 'm1.xlarge': 530, 'm1.medium': 255, 'm1.small': 97 },
  { date: new Date(2020, 8, 21), 'm1.large': 1016, 'm1.xlarge': 445, 'm1.medium': 339, 'm1.small': 70 },
  { date: new Date(2020, 8, 22), 'm1.large': 987, 'm1.xlarge': 549, 'm1.medium': 273, 'm1.small': 62 },
  { date: new Date(2020, 8, 23), 'm1.large': 986, 'm1.xlarge': 518, 'm1.medium': 341, 'm1.small': 67 },
  { date: new Date(2020, 8, 24), 'm1.large': 925, 'm1.xlarge': 454, 'm1.medium': 382, 'm1.small': 68 },
  { date: new Date(2020, 8, 25), 'm1.large': 742, 'm1.xlarge': 538, 'm1.medium': 361, 'm1.small': 70 },
  { date: new Date(2020, 8, 26), 'm1.large': 920, 'm1.xlarge': 486, 'm1.medium': 262, 'm1.small': 91 },
  { date: new Date(2020, 8, 27), 'm1.large': 826, 'm1.xlarge': 457, 'm1.medium': 248, 'm1.small': 76 },
  { date: new Date(2020, 8, 28), 'm1.large': 698, 'm1.xlarge': 534, 'm1.medium': 243, 'm1.small': 66 },
  { date: new Date(2020, 8, 29), 'm1.large': 1003, 'm1.xlarge': 523, 'm1.medium': 393, 'm1.small': 70 },
  { date: new Date(2020, 8, 30), 'm1.large': 811, 'm1.xlarge': 527, 'm1.medium': 353, 'm1.small': 88 },
];

export const cpuDomain = cpuData.map(({ date }) => date);

export const cpuSeries: BarChartProps<Date>['series'] = [
  {
    title: 'm1.large',
    type: 'bar',
    data: cpuData.map(datum => ({ x: datum.date, y: datum['m1.large'] })),
  },
  {
    title: 'm1.xlarge',
    type: 'bar',
    data: cpuData.map(datum => ({ x: datum.date, y: datum['m1.xlarge'] })),
  },
  {
    title: 'm1.medium',
    type: 'bar',
    data: cpuData.map(datum => ({ x: datum.date, y: datum['m1.medium'] })),
  },
  {
    title: 'm1.small',
    type: 'bar',
    data: cpuData.map(datum => ({ x: datum.date, y: datum['m1.small'] })),
  },
];

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const fitHeight = urlParams.fitHeight ?? true;
  const [isActive, setIsActive] = useState(false);
  return (
    <AppLayout
      contentType="dashboard"
      content={
        <ContentLayout header={<Header>Dashboard performance test</Header>}>
          <Container>
            <Checkbox checked={fitHeight} onChange={e => setUrlParams({ fitHeight: e.detail.checked })}>
              fit height
            </Checkbox>
            <Checkbox checked={urlParams.hideFilter} onChange={e => setUrlParams({ hideFilter: e.detail.checked })}>
              hide filter
            </Checkbox>
            <Checkbox checked={urlParams.hideLegend} onChange={e => setUrlParams({ hideLegend: e.detail.checked })}>
              hide legend
            </Checkbox>
          </Container>

          <ScreenshotArea>
            {isActive ? (
              <Grid gridDefinition={[{ colspan: { l: 8, m: 8, default: 12 } }]}>
                <BaseStaticWidget header={<Header>Instance hours</Header>}>
                  <BarChart
                    {...commonProps}
                    height={350}
                    fitHeight={fitHeight}
                    yDomain={[0, 2000]}
                    xDomain={cpuDomain}
                    xScaleType="categorical"
                    stackedBars={true}
                    hideFilter={true}
                    series={cpuSeries}
                    xTitle="Date"
                    yTitle="Total instance hours"
                    ariaLabel="Instance hours"
                    ariaDescription={`Bar chart showing total instance hours per instance type over the last 15 days. ${barChartInstructions}`}
                    i18nStrings={{
                      ...commonProps.i18nStrings,
                      filterLabel: 'Filter displayed instance types',
                      filterPlaceholder: 'Filter instance types',
                      xTickFormatter: dateTimeFormatter,
                    }}
                  />
                </BaseStaticWidget>
              </Grid>
            ) : (
              <Button
                onClick={() => {
                  setIsActive(true);
                  console.time('render');
                  requestAnimationFrame(() => console.timeEnd('render'));
                }}
              >
                Render charts
              </Button>
            )}
          </ScreenshotArea>
        </ContentLayout>
      }
    />
  );
}

function BaseStaticWidget({ header, children, footer }: any) {
  return (
    <div style={{ minHeight: '550px', height: '100%' }}>
      <Container header={header} fitHeight={true} footer={footer}>
        {children}
      </Container>
    </div>
  );
}
