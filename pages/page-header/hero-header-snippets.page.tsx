// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import '@cloudscape-design/global-styles/dark-mode-utils.css';
import { Button, Container, Link, Grid, Box } from '~components';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import backgroundHeaderDark from './header-dark.png';
import backgroundHeaderLight from './header-light.png';
import styles from './styles.scss';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <SpaceBetween size="xl">
        <div className={styles['full-header']}>
          <div
            className={`${styles['header-background-image']} awsui-util-hide-in-dark-mode`}
            style={{ backgroundImage: `url(${backgroundHeaderLight})` }}
          />
          <div
            className={`${styles['header-background-image']} awsui-util-show-in-dark-mode`}
            style={{ backgroundImage: `url(${backgroundHeaderDark})` }}
          />
          <div className={styles['inner-header']}>
            <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }]}>
              <Container>
                <Box padding="s">
                  <Box fontSize="display-l" fontWeight="bold" variant="h1" padding="n">
                    AWS Skill Builder
                  </Box>
                  <Box fontSize="display-l" fontWeight="light">
                    Your learning center to build in-demand cloud skills
                  </Box>
                  <Box variant="p" margin={{ top: 'xs', bottom: 'l' }}>
                    Get started quickly and for free today with anti-malware for Amazon S3. With File Storage Security,
                    Cloud Security Posture Management, and well-architected resourcing in Conformity or Workload
                    Security.
                  </Box>
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary">Sign up</Button>
                    <Button>Free trial</Button>
                  </SpaceBetween>
                </Box>
              </Container>
            </Grid>
          </div>
        </div>

        <div className={styles['full-header']}>
          <div className={styles['inner-header']}>
            <Grid
              gridDefinition={[{ colspan: { default: 12, xs: 8, s: 9 } }, { colspan: { default: 12, xs: 4, s: 3 } }]}
            >
              <div>
                <Box fontWeight="bold" variant="h1">
                  AWS Skill Builder
                </Box>
                <Box variant="p" margin={{ top: 'xs', bottom: 'l' }}>
                  Get started quickly and for free today with anti-malware for Amazon S3. With File Storage Security,
                  Cloud Security Posture Management, and well-architected resourcing in Conformity or Workload Security.
                </Box>
                <SpaceBetween size="xs">
                  <div>
                    Sold by:{' '}
                    <Link external={true} variant="primary" href="#">
                      Third-party vendor
                    </Link>
                  </div>
                  <div>
                    Tags:{' '}
                    <Link variant="primary" href="#">
                      Free trial
                    </Link>
                    {' | '}
                    <Link variant="primary" href="#">
                      Vendor insights
                    </Link>
                  </div>
                </SpaceBetween>
              </div>

              <Box margin={{ top: 'l' }}>
                <SpaceBetween size="s">
                  <Button variant="primary" fullWidth={true}>
                    Continue to subscribe
                  </Button>
                  <Button fullWidth={true}>Request a demo</Button>
                  <Button fullWidth={true}>Save to a list</Button>
                </SpaceBetween>
              </Box>
            </Grid>
          </div>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
