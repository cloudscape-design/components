// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/internal/components/content-layout';
import Header from '~components/header';
import Box from '~components/box';
import appLayoutLabels from '../app-layout/utils/labels';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import styles from '../app-layout/styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            disableOverlap={true}
            header={
              <Header
                variant="h1"
                description="When you create an Amazon CloudFront distribution, you tell CloudFront where to find your content by specifying your origin servers."
              >
                Content header
              </Header>
            }
          >
            <Box padding={{ vertical: 'xl' }}>
              <Box variant="h2" padding={{ bottom: 'l' }}>
                Demo content
              </Box>
              <div className={styles.contentPlaceholder} />
            </Box>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
