// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';

import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import labels from './utils/labels';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        disableContentPaddings={true}
        notifications={
          <div className={styles.highlightBorder}>
            <Box variant="h2">Notifications</Box>
          </div>
        }
        content={
          <div className={styles.highlightBorder}>
            <Box variant="h1">Content</Box>
          </div>
        }
        navigation={<Box variant="h2">Navigation</Box>}
        tools={<Box variant="h2">Tools</Box>}
      />
    </ScreenshotArea>
  );
}
