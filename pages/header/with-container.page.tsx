// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import '@cloudscape-design/global-styles/dark-mode-utils.css';
import { Box, Button, Container, Grid } from '~components';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import { Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import backgroundHeaderDark from '../header/header-dark.png';
import backgroundHeaderLight from '../header/header-light.png';
import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <header className={styles['content-page-header']}>
        <div
          className={`${styles['header-background-image']} awsui-util-hide-in-dark-mode`}
          style={{ backgroundImage: `url(${backgroundHeaderLight})` }}
        />
        <div
          className={`${styles['header-background-image']} awsui-util-show-in-dark-mode`}
          style={{ backgroundImage: `url(${backgroundHeaderDark})` }}
        />

        <div className={styles['header-content']}>
          <Grid gridDefinition={[{ colspan: { default: 12, m: 8 } }, { colspan: { default: 12, m: 4 } }]}>
            <Container>
              <Box margin="s">
                <Header
                  variant="awsui-h1-page"
                  subHeading="Your learning center to build in-demand cloud skills"
                  description={
                    <div>
                      <SpaceBetween size="l">
                        <Box variant="span">
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
                >
                  AWS Skill Builder
                </Header>
              </Box>
            </Container>
            <div />
          </Grid>
        </div>
      </header>
      <div className={styles['content-page-content']}>
        <Containers />
      </div>
    </ScreenshotArea>
  );
}
