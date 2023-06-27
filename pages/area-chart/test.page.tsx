// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import { AreaChartProps } from '~components/area-chart';
import { NonCancelableEventHandler } from '~components/internal/events';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

import Example from './example';
import { createLinearTimeLatencyProps, createLogXYProps } from './series';
import { Box, ButtonDropdown } from '~components';

const logXProps = createLogXYProps({ xLog: true });
const linearLatencyProps = createLinearTimeLatencyProps();
const xDomain = [0, 119];

type Series = AreaChartProps.Series<number>;

export default function () {
  const [visibleSeries, setVisibleSeries] = useState<readonly Series[]>(linearLatencyProps.series);
  const [highlightedSeries, setHighlightedSeries] = useState<null | Series>(null);

  const onFilterChange: NonCancelableEventHandler<AreaChartProps.FilterChangeDetail<number>> = useCallback(event => {
    setVisibleSeries(event.detail.visibleSeries);
  }, []);

  const onHighlightChange: NonCancelableEventHandler<AreaChartProps.HighlightChangeDetail<number>> = useCallback(
    event => {
      setHighlightedSeries(event.detail.highlightedSeries);
    },
    []
  );

  return (
    <>
      <h1>Area charts integration test</h1>
      <ScreenshotArea>
        <SpaceBetween direction="vertical" size="xl">
          <Example name="Linear latency chart" {...linearLatencyProps} xDomain={xDomain} />

          <Example
            name="Controlled linear latency chart"
            {...linearLatencyProps}
            visibleSeries={visibleSeries}
            onFilterChange={onFilterChange}
            highlightedSeries={highlightedSeries}
            onHighlightChange={onHighlightChange}
            xDomain={xDomain}
            detailPopoverFooter={() => (
              <Box margin={{ top: 'm' }}>
                <ButtonDropdown
                  items={[
                    { id: '1', text: 'View' },
                    { id: '2', text: 'Add to filter' },
                  ]}
                  expandToViewport={true}
                >
                  Actions
                </ButtonDropdown>
              </Box>
            )}
          />

          <Example name="Log-x latency chart" {...logXProps} />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
