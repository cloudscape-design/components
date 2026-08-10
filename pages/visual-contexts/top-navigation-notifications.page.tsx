// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import VisualContext from '~components/internal/components/visual-context';
import SpaceBetween from '~components/space-between';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { flashbarPermutations, renderFlashbar } from './notifications-permutations';

import styles from './styles.scss';

export default function TopNavigationNotificationsPermutations() {
  return (
    <ScreenshotArea disableAnimations={true} gutters={false}>
      <VisualContext contextName="top-navigation">
        <Box padding="l" className={styles['top-nav-dropdown']}>
          <SpaceBetween size="l">
            <Box variant="h1">Notifications in top-navigation visual context</Box>
            <PermutationsView permutations={flashbarPermutations} render={renderFlashbar} />
          </SpaceBetween>
        </Box>
      </VisualContext>
    </ScreenshotArea>
  );
}
