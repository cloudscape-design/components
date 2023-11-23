// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import '@cloudscape-design/global-styles/dark-mode-utils.css';
import { Button, Container, Header, PageHeader, Link, Icon } from '~components';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import backgroundHeaderDark from './header-dark.png';
import backgroundHeaderLight from './header-light.png';
import styles from './styles.scss';

const Separator = () => <span className={styles.separator} />;

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <SpaceBetween size="xl">
        <PageHeader
          variant="display-l"
          colorMode="default"
          subHeading="Your learning center to build in-demand cloud skills"
          description="Get started quickly and for free today with anti-malware for Amazon S3. With File Storage
                        Security, Cloud Security Posture Management, and well-architected resourcing in Conformity or
                        Workload Security."
          metadata={
            <div>
              Metadata:{' '}
              <span className={styles['inline-list']}>
                <Link href="#" variant="primary">
                  Link can go here
                </Link>
                <Separator />
                <Link href="#" variant="primary" external={true}>
                  External link can go here
                </Link>
                <Separator />
                <span>
                  <Icon name="call" /> +49 0000 13245674
                </span>
              </span>
            </div>
          }
          background={
            <>
              <div
                className={`${styles['header-background-image']} awsui-util-hide-in-dark-mode`}
                style={{ backgroundImage: `url(${backgroundHeaderLight})` }}
              />
              <div
                className={`${styles['header-background-image']} awsui-util-show-in-dark-mode`}
                style={{ backgroundImage: `url(${backgroundHeaderDark})` }}
              />
            </>
          }
          withContainer={true}
          actions={
            <SpaceBetween size="s" direction="horizontal">
              <Button variant="primary">Sign up</Button>
              <Button>Free trial</Button>
            </SpaceBetween>
          }
        >
          AWS Skill Builder
        </PageHeader>

        <PageHeader
          colorMode="dark"
          variant="h1"
          subHeading="Your learning center to build in-demand cloud skills"
          description="Get started quickly and for free today with anti-malware for Amazon S3. With File Storage
                  Security, Cloud Security Posture Management, and well-architected resourcing in Conformity or
                  Workload Security."
          actions={
            <SpaceBetween size="s" direction="horizontal">
              <Button variant="primary">Sign up</Button>
              <Button>Free trial</Button>
            </SpaceBetween>
          }
        >
          AWS Skill Builder
        </PageHeader>

        <PageHeader
          colorMode="dark"
          variant="h1"
          maxWidth="1200px"
          subHeading="Your learning center to build in-demand cloud skills"
          description="Get started quickly and for free today with anti-malware for Amazon S3. With File Storage
            Security, Cloud Security Posture Management, and well-architected resourcing in Conformity or
            Workload Security."
          actions={
            <SpaceBetween size="s" direction="horizontal">
              <Button variant="primary">Sign up</Button>
              <Button>Free trial</Button>
            </SpaceBetween>
          }
          tags={
            <div>
              Tags:{' '}
              <span className={styles['inline-list']}>
                <Link href="#" variant="primary">
                  Free trial
                </Link>
                <Separator />
                <Link href="#" variant="primary">
                  Vendor insights
                </Link>
              </span>
            </div>
          }
          secondaryContent={
            <Container header={<Header variant="h2">Container title</Header>}>
              <SpaceBetween size="l">
                <span>Here you can find more stuff</span>
                <Button>Next step</Button>
              </SpaceBetween>
            </Container>
          }
        >
          AWS Skill Builder
        </PageHeader>

        <PageHeader
          colorMode="dark"
          variant="h1"
          subHeading="Your learning center to build in-demand cloud skills"
          description="Get started quickly and for free today with anti-malware for Amazon S3. With File Storage
            Security, Cloud Security Posture Management, and well-architected resourcing in Conformity or
            Workload Security."
          gridDefinition={[{ colspan: { default: 12, xs: 6 } }, { colspan: { default: 12, xs: 6 } }]}
          secondaryContent={<img src={backgroundHeaderDark} style={{ width: '100%', height: 'auto' }} />}
        >
          AWS Skill Builder
        </PageHeader>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
