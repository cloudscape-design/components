// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';

import Popover from '~components/popover';
import Box from '~components/box';
import styles from './positioning.scss';
import ScreenshotArea from '../utils/screenshot-area';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import AppContext, { AppContextType } from '../app/app-context';

type PopoverPlacementContext = React.Context<
  AppContextType<{ position?: string; placement?: string; tallTrigger?: boolean }>
>;

export default function () {
  const {
    urlParams: { position, placement, tallTrigger },
  } = useContext(AppContext as PopoverPlacementContext);

  if (!position || !placement) {
    return (
      <Page>
        <Box color="text-status-error">Use position and placement query params.</Box>
      </Page>
    );
  }

  if (position !== 'left' && position !== 'right' && position !== 'top' && position !== 'bottom') {
    return (
      <Page>
        <Box color="text-status-error">Invalid position.</Box>
      </Page>
    );
  }

  const [vertical, horizontal] = placement.split('-');
  const selectedRow = { top: 1, center: 2, bottom: 3 }[vertical];
  const selectedCol = { left: 1, center: 2, right: 3 }[horizontal];

  if (!selectedRow || !selectedCol) {
    return (
      <Page>
        <Box color="text-status-error">Invalid placement.</Box>
      </Page>
    );
  }

  return (
    <Page>
      <ScreenshotArea gutters={false} className={styles.grid}>
        {[1, 2, 3].map(row =>
          [1, 2, 3].map(col => {
            if (row !== selectedRow || col !== selectedCol) {
              return null;
            }

            return (
              <div
                key={`${row}${col}`}
                className={clsx(styles.square, styles[`square-row-${row}`], styles[`square-col-${col}`])}
              >
                <Popover
                  id={`popover-${row}-${col}`}
                  size="large"
                  fixedWidth={true}
                  position={position}
                  header="Info"
                  content={<Content />}
                  dismissAriaLabel="Close"
                  triggerType="custom"
                >
                  <button id="popover-trigger" className={clsx(tallTrigger && styles['tall-trigger'])}>
                    {!tallTrigger && 'Open popover'}
                  </button>
                </Popover>
              </div>
            );
          })
        )}
      </ScreenshotArea>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1>Popover placement test</h1>
      {children}
    </>
  );
}

function Content() {
  return (
    <SpaceBetween size="l" direction="horizontal">
      <SpaceBetween size="l">
        <ValueWithLabel label="Label for key">Value</ValueWithLabel>
        <ValueWithLabel label="Label for key">
          <StatusIndicator>Positive</StatusIndicator>
        </ValueWithLabel>
      </SpaceBetween>
      <SpaceBetween size="l">
        <ValueWithLabel label="Label for key">Value</ValueWithLabel>
        <ValueWithLabel label="Label for key">
          <Link href="#" externalIconAriaLabel="This link opens in a new tab" external={true}>
            Website
          </Link>
        </ValueWithLabel>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function ValueWithLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Box variant="awsui-key-label">{label}</Box>
      <div>{children}</div>
    </div>
  );
}
