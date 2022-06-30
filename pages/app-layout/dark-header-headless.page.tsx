// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Header from '~components/header';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <Box padding={{ vertical: 'l' }}>
            <Header variant="h1">Content header</Header>
            <div className={styles.contentPlaceholder} />
          </Box>
        }
      />
    </ScreenshotArea>
  );
}
