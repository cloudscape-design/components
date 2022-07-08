// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Container from '~components/container';
import ContentLayout from '~components/internal/components/content-layout';
import Grid from '~components/grid';
import Header from '~components/header';
import Link from '~components/link';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                info={<Link>Info</Link>}
                description="When you create an Amazon CloudFront distribution."
              >
                Create distribution
              </Header>
            }
          >
            <Grid gridDefinition={[{ colspan: 12 }]}>
              <Container
                header={
                  <Header variant="h2" description="Container description">
                    Container title
                  </Header>
                }
              >
                Container content
              </Container>
            </Grid>
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
