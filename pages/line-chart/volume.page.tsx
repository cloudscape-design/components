// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Container from '~components/container';
import Header from '~components/header';
import Box from '~components/box';
import LineChart, { LineChartProps } from '~components/line-chart';
import ScreenshotArea from '../utils/screenshot-area';

import { commonProps, lineChartInstructions, latencyData, dateTimeFormatter } from '../mixed-line-bar-chart/common';
import { Link, SpaceBetween } from '~components';

export default function () {
  const [highlightedSeries, setHighlightedSeries] = useState<LineChartProps<Date>['highlightedSeries']>(null);
  return (
    <ScreenshotArea>
      <h1>Line chart integration tests</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Line Chart</Header>}>
          <LineChart
            {...commonProps}
            highlightedSeries={highlightedSeries}
            onHighlightChange={event => setHighlightedSeries(event.detail.highlightedSeries)}
            hideFilter={true}
            id="chart"
            height={130}
            series={[
              {
                title: 'visits-service',
                type: 'line',
                data: latencyData.map(({ time, p90 }) => ({ x: time, y: p90 })),
              },
              { title: 'foo-service', type: 'line', data: latencyData.map(({ time, p50 }) => ({ x: time, y: p50 })) },
            ]}
            xDomain={[latencyData[0].time, latencyData[latencyData.length - 1].time]}
            yDomain={[0, 300]}
            xTitle="Time"
            yTitle="Volume (#)"
            xScaleType="time"
            ariaLabel="Line chart"
            ariaDescription={lineChartInstructions}
            i18nStrings={{ ...commonProps, xTickFormatter: dateTimeFormatter }}
            detailPopoverFooter={() => (
              <div>
                <SpaceBetween size="m">
                  <div>
                    <Box fontWeight="bold" fontSize="heading-s" variant="span">
                      Service:{' '}
                    </Box>
                    <Link href="#" external={true}>
                      {highlightedSeries?.title}
                    </Link>
                  </div>
                </SpaceBetween>
              </div>
            )}
          />
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
