// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, SpaceBetween } from '~components';
import Popover, { PopoverProps } from '~components/popover';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './scenario-in-container-query.scss';

export default function () {
  const popoverProps: PopoverProps = {
    size: 'medium',
    position: 'bottom',
    header: 'Memory error',
    content: (
      <>
        This instance contains insufficient memory. Stop the instance, choose a different instance type with more
        memory, and restart it.
      </>
    ),
    dismissAriaLabel: 'Close',
  };

  return (
    <Box margin="m">
      <h1>Popover inside a container with CSS container query</h1>

      <ScreenshotArea>
        <SpaceBetween size="m">
          <div>
            <Popover {...{ ...popoverProps, id: 'popover-0', children: 'popover-0' }} />
          </div>

          <div className={styles['container-inline-size']}>
            <Popover {...{ ...popoverProps, id: 'popover-1', children: 'popover-1' }} />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
