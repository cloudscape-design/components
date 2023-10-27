// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Box, Button, Icon } from '~components';
import Alert from '~components/alert';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Breadcrumbs, Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import backgroundHeaderDark from '../header/header-dark.png';

export default function () {
  const [alertVisible, setVisible] = useState(true);

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
                variant="awsui-h1-page"
                info={<Link>Info</Link>}
                description={
                  <div>
                    <SpaceBetween size="xs">
                      <Box variant="h2">Your learning center to build in-demand cloud skills</Box>
                      <SpaceBetween size="m" direction="horizontal">
                        <div>
                          Sold by:{' '}
                          <Link external={true} href="#">
                            Trend Micro
                          </Link>
                        </div>
                        <div>
                          <strong>
                            <Icon name="call" /> XXX XXXXXXX
                          </strong>
                        </div>
                      </SpaceBetween>
                      <Box>
                        Get started quickly and for free today with anti-malware for Amazon S3. With File Storage
                        Security, Cloud Security Posture Management, and well-architected resourcing in Conformity or
                        Workload Security.
                      </Box>
                      <SpaceBetween size="s" direction="horizontal">
                        <Button variant="primary">Sign up</Button>
                        <Button>Free trial</Button>
                      </SpaceBetween>
                    </SpaceBetween>
                  </div>
                }
                actions={<Button variant="primary">Create distribution</Button>}
              >
                Create distribution
              </Header>
            }
            // headerBackgroundImage={backgroundHeaderDark}
          >
            <Containers />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
