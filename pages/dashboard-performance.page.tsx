// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Button, Checkbox, Container, MixedLineBarChart, PieChart, SpaceBetween } from '~components';
import AppContext, { AppContextType } from './app/app-context';
import ScreenshotArea from './utils/screenshot-area';
import { barChartInstructions, commonProps, data3, data4 } from './mixed-line-bar-chart/common';
import { colorChartsThresholdInfo } from '~design-tokens';
import { FoodData, commonProps as commonPropsPie, data1 } from './pie-chart/common';

type DemoContext = React.Context<
  AppContextType<{
    fitHeight: boolean;
    hideFilter: boolean;
    hideLegend: boolean;
  }>
>;

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const fitHeight = urlParams.fitHeight ?? true;
  const [isActive, setIsActive] = useState(false);
  return (
    <Box padding="m">
      <h1>Dashboard performance test</h1>

      <Box>
        <Checkbox checked={fitHeight} onChange={e => setUrlParams({ fitHeight: e.detail.checked })}>
          fit height
        </Checkbox>
        <Checkbox checked={urlParams.hideFilter} onChange={e => setUrlParams({ hideFilter: e.detail.checked })}>
          hide filter
        </Checkbox>
        <Checkbox checked={urlParams.hideLegend} onChange={e => setUrlParams({ hideLegend: e.detail.checked })}>
          hide legend
        </Checkbox>
      </Box>

      <ScreenshotArea>
        {isActive ? (
          <SpaceBetween size="l">
            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '8px',
                height: 800,
              }}
            >
              <Container fitHeight={true} header="800px mixed">
                <MixedLineBarChart
                  {...commonProps}
                  fitHeight={fitHeight}
                  height={500}
                  hideFilter={urlParams.hideFilter}
                  hideLegend={urlParams.hideLegend}
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
              </Container>
            </div>

            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '8px',
                height: 800,
              }}
            >
              <Container fitHeight={true} header="800px pie">
                <PieChart<FoodData>
                  {...commonPropsPie}
                  fitHeight={fitHeight}
                  hideFilter={urlParams.hideFilter}
                  hideLegend={urlParams.hideLegend}
                  data={data1}
                  ariaLabel="Food facts"
                  size="medium"
                  detailPopoverFooter={segment => <Button>Filter by {segment.title}</Button>}
                  variant="donut"
                  innerMetricValue="180"
                />
              </Container>
            </div>
          </SpaceBetween>
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
    </Box>
  );
}
