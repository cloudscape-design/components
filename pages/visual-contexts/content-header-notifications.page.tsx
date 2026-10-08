// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import VisualContext from '~components/internal/components/visual-context';
import SpaceBetween from '~components/space-between';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { alertPermutations, flashbarPermutations, renderAlert, renderFlashbar } from './notifications-permutations';

import styles from './styles.scss';

export default function ContentHeaderNotificationsPermutations() {
  return (
    <ScreenshotArea disableAnimations={true} gutters={false}>
      <VisualContext contextName="content-header">
        <Box padding="l" className={styles.main}>
          <SpaceBetween size="l">
            <Box variant="h1">Notifications in content-header visual context</Box>
            <PermutationsView permutations={flashbarPermutations} render={renderFlashbar} />
            <PermutationsView permutations={alertPermutations} render={renderAlert} />
          </SpaceBetween>
        </Box>
      </VisualContext>
    </ScreenshotArea>
  );
}
