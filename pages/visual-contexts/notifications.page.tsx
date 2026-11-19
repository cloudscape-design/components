// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import SpaceBetween from '~components/space-between';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { alertPermutations, flashbarPermutations, renderAlert, renderFlashbar } from './notifications-permutations';

export default function NotificationsPermutations() {
  return (
    <ScreenshotArea disableAnimations={true} gutters={false}>
      <Box padding="l">
        <SpaceBetween size="l">
          <Box variant="h1">Notifications on the page surface</Box>
          <PermutationsView permutations={flashbarPermutations} render={renderFlashbar} />
          <PermutationsView permutations={alertPermutations} render={renderAlert} />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
