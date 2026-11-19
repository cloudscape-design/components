// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import clsx from 'clsx';

import {
  NonCancelableCustomEvent,
  Popover,
  PopoverProps,
  SegmentedControl,
  SegmentedControlProps,
  SpaceBetween,
  SplitPanel,
} from '~components';
import AppLayout from '~components/app-layout';
import BarChart from '~components/bar-chart';

import { barChartInstructions, commonProps, multipleBarsData } from '../mixed-line-bar-chart/common';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';
import * as toolsContent from './utils/tools-content';

import styles from '../popover/positioning.scss';

type ContentType = 'grid' | 'chart';

export default function () {
  const [content, setContent] = useState<ContentType>('grid');
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState<PopoverProps.Position>('top');
  const onPositionChange = useCallback((event: NonCancelableCustomEvent<SegmentedControlProps.ChangeDetail>) => {
    setPosition(event.detail.selectedId as PopoverProps.Position);
  }, []);

  return (
    <AppLayout
      ariaLabels={labels}
      analyticsMetadata={{
        flowType: 'home',
        instanceIdentifier: 'demo-page',
      }}
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      tools={<Tools>{toolsContent.long}</Tools>}
      content={
        <>
          <h1>Popover inside split panel</h1>
          <SpaceBetween size="s">
            <SegmentedControl
              data-testid="content-control"
              label="Split panel content"
              options={[
                { id: 'grid', text: 'Grid' },
                { id: 'chart', text: 'Chart' },
              ]}
              selectedId={content}
              onChange={({ detail }) => setContent(detail.selectedId as ContentType)}
            />
            {content === 'grid' && (
              <div>
                <div>Popover position</div>
                <SegmentedControl
                  data-testid="position-control"
                  label="Position"
                  options={[
                    { id: 'top', text: 'Top' },
                    { id: 'right', text: 'Right' },
                    { id: 'bottom', text: 'Bottom' },
                    { id: 'left', text: 'Left' },
                  ]}
                  selectedId={position}
                  onChange={onPositionChange}
                />
              </div>
            )}
          </SpaceBetween>
        </>
      }
      splitPanelOpen={open}
      onSplitPanelToggle={({ detail }) => setOpen(detail.open)}
      splitPanel={
        <SplitPanel header="Split panel" i18nStrings={splitPaneli18nStrings}>
          <ScreenshotArea gutters={false}>
            {content === 'grid' && (
              <div className={styles.grid}>
                {[1, 2, 3].map(row =>
                  [1, 2, 3].map(col => (
                    <div
                      key={`${row}${col}`}
                      className={clsx(styles.square, styles[`square-row-${row}`], styles[`square-col-${col}`])}
                    >
                      <Popover
                        data-testid={`popover-${row}-${col}`}
                        size="medium"
                        position={position}
                        header="Memory error"
                        content={
                          <>
                            This instance contains insufficient memory. Stop the instance, choose a different instance
                            type with more memory, and restart it.
                          </>
                        }
                        dismissAriaLabel="Close"
                      >
                        Click!
                      </Popover>
                    </div>
                  ))
                )}
              </div>
            )}

            {content === 'chart' && (
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
            )}
          </ScreenshotArea>
        </SplitPanel>
      }
    />
  );
}
