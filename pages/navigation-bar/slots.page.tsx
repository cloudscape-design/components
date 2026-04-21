// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Header } from '~components';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const start = (
  <Link href="#" fontSize="heading-m" color="inverted">
    App Name
  </Link>
);

export default function NavigationBarSlotsPage() {
  return (
    <article>
      <h1>Navigation Bar — Slot Combinations</h1>
      <ScreenshotArea gutters={false}>
        <SpaceBetween size="m">
          <Box>
            <Header variant="h3">No slots (empty)</Header>
            <NavigationBar ariaLabel="Empty" />
          </Box>

          <Box>
            <Header variant="h3">Start only</Header>
            <NavigationBar ariaLabel="Start only" content={start} />
          </Box>

          <Box>
            <Header variant="h3">Center only</Header>
            <NavigationBar ariaLabel="Center only" />
          </Box>

          <Box>
            <Header variant="h3">End only</Header>
            <NavigationBar ariaLabel="End only" />
          </Box>

          <Box>
            <Header variant="h3">Start + End</Header>
            <NavigationBar ariaLabel="Start and end" content={start} />
          </Box>

          <Box>
            <Header variant="h3">Start + Center</Header>
            <NavigationBar ariaLabel="Start and center" content={start} />
          </Box>

          <Box>
            <Header variant="h3">Center + End</Header>
            <NavigationBar ariaLabel="Center and end" />
          </Box>

          <Box>
            <Header variant="h3">Start + Center + End</Header>
            <NavigationBar ariaLabel="All slots" content={start} />
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
