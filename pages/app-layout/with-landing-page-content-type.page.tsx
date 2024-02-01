// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Link from '~components/link';
import Box from '~components/box';
import Grid from '~components/grid';
import Container from '~components/container';
import FormField from '~components/form-field';
import SpaceBetween from '~components/space-between';
import ColumnLayout from '~components/column-layout';
import SideNavigation from '~components/side-navigation';
import Flashbar from '~components/flashbar';
import Toggle from '~components/toggle';
import HelpPanel from '~components/help-panel';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Footer, Notifications } from './utils/content-blocks';
//import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import Button from '~components/button';
import styles from './styles.scss';
import { ContentLayout } from '~components';

function Navigation() {
  return (
    <SideNavigation
      header={{
        href: '#',
        text: 'Service name',
      }}
      items={[
        { type: 'link', text: 'Page 1', href: '#/page1' },
        { type: 'link', text: 'Page 2', href: '#/page2' },
        { type: 'link', text: 'Page 3', href: '#/page3' },
        { type: 'link', text: 'Page 4', href: '#/page4' },
        { type: 'divider' },
        {
          type: 'link',
          text: 'Test',
          href: '#/notifications',
        },
        {
          type: 'link',
          text: 'Documentation',
          href: 'https://example.com',
          external: true,
        },
      ]}
    />
  );
}

interface ToolsProps {
  onFlashbarChange: (isChecked: boolean) => void;
  onStackedNotificationChange: (isChecked: boolean) => void;
  onBreadcrumbChange: (isChecked: boolean) => void;
  onNestingChange: (isChecked: boolean) => void;
}

function Tools({ onFlashbarChange, onStackedNotificationChange, onNestingChange }: ToolsProps) {
  const [hasFlash, setFlash] = React.useState(false);
  const [hasStackedNotification, setStackedNotification] = React.useState(false);
  //const [hasBreadcrumb, setBreadcrumb] = React.useState(false);
  const [hasNesting, setNesting] = React.useState(false);

  const handleFlashbarChange = (isChecked: boolean) => {
    setFlash(isChecked);
    if (onFlashbarChange) {
      onFlashbarChange(isChecked);
    }
  };

  const handleStackedNotificationChange = (isChecked: boolean) => {
    setStackedNotification(isChecked);
    if (onStackedNotificationChange) {
      onStackedNotificationChange(isChecked);
    }
  };

  // const handleBreadcrumbChange = (isChecked: boolean) => {
  //   setBreadcrumb(isChecked);
  //   if (onBreadcrumbChange) {
  //     onBreadcrumbChange(isChecked);
  //   }
  // };

  const handleNestingChange = (isChecked: boolean) => {
    setNesting(isChecked);
    if (onNestingChange) {
      onNestingChange(isChecked);
    }
  };

  return (
    <HelpPanel header={<h2>Configuration</h2>}>
      <SpaceBetween size="m">
        <Toggle onChange={({ detail }) => handleFlashbarChange(detail.checked)} checked={hasFlash}>
          Show Flashbar
        </Toggle>
        <Toggle
          onChange={({ detail }) => handleStackedNotificationChange(detail.checked)}
          checked={hasStackedNotification}
        >
          Show stacked notifications
        </Toggle>
        {/* <Toggle onChange={({ detail }) => handleBreadcrumbChange(detail.checked)} checked={hasBreadcrumb}>
          Show Breadcrumb
        </Toggle> */}
        <Toggle onChange={({ detail }) => handleNestingChange(detail.checked)} checked={hasNesting}>
          Wrap in ContentLayout
        </Toggle>
      </SpaceBetween>
    </HelpPanel>
  );
}

type MessageType = 'success' | 'warning' | 'error' | 'info';

interface NotificationsItem {
  type: MessageType;
  content: string;
  id: string;
}

function StackedNotifications() {
  const [items] = React.useState<NotificationsItem[]>([
    {
      type: 'success',
      content: 'This is a success flash message',
      id: 'message_5',
    },
    {
      type: 'warning',
      content: 'This is a warning flash message',
      id: 'message_4',
    },
    {
      type: 'error',
      content: 'This is a dismissible error message',
      id: 'message_3',
    },
    {
      type: 'info',
      content: 'This is an info flash message',
      id: 'message_2',
    },
  ]);
  return <Flashbar items={items} stackItems={true} />;
}

const Content = () => {
  return (
    <Box margin={{ bottom: 'l' }}>
      <div className={styles['custom-home__header']}>
        <Box padding={{ vertical: 'xxxl', horizontal: 's' }}>
          <Grid
            className="homepage-heading"
            gridDefinition={[
              { offset: { l: 2, xxs: 1 }, colspan: { l: 8, xxs: 10 } },
              { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
              { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
            ]}
          >
            <Box fontWeight="normal" padding={{ top: 'xs', bottom: 'xs' }}>
              <span className={styles['custom-home__category']}>Networking &amp; Content Delivery</span>
            </Box>
            <div className={styles['custom-home__header-title']}>
              <Box
                variant="h1"
                fontWeight="heavy"
                padding="n"
                fontSize="display-l"
                className={styles['custom-home__header-title']}
              >
                Service Homepage
              </Box>
              <Box
                fontWeight="light"
                padding={{ bottom: 's' }}
                fontSize="display-l"
                className={styles['custom-home__header-title']}
              >
                Fast and reliable delivery of your static content
              </Box>
              <Box variant="p" fontWeight="normal">
                <span className={styles['custom-home__header-sub-title']}>
                  Service Homepage is a global content delivery network service (CDN) that accelerates delivery of your
                  websites, APIs, video content or other web assets through CDN caching.
                </span>
              </Box>
            </div>
            <div className="custom-home__header-cta">
              <Container header={<Header variant="h2">Create distribution</Header>}>
                <SpaceBetween size="xl">
                  <FormField stretch={true} label="Delivery method">
                    {/* <CustomSelect /> */}
                  </FormField>
                  <Button href="#" variant="primary">
                    Next step
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
          </Grid>
        </Box>
      </div>

      <Box padding={{ top: 'xxxl', horizontal: 's' }}>
        <Grid
          gridDefinition={[
            { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
            { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
          ]}
        >
          <SpaceBetween size="xxl">
            <div>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'm' }}>
                How it works
              </Box>
              <Container>
                <div
                  className={styles.contentPlaceholder}
                  role="img"
                  aria-label="End user traffic enters the nearest AWS Edge Location protected by AWS Shield and AWS WAF before it passes through Regional Edge Caches and Origin Shield to the Application Content Origin"
                ></div>
              </Container>
            </div>

            <div>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'm' }}>
                Benefits and features
              </Box>
              <Container>
                <ColumnLayout columns={2} variant="text-grid">
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      CloudFront console
                    </Box>
                    <Box variant="p">
                      Create, monitor, and manage your content delivery with a few simple clicks on the CloudFront
                      console.
                    </Box>
                  </div>
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      Static and dynamic content
                    </Box>
                    <Box variant="p">
                      Deliver both static content and dynamic content that you can personalize for individual users.
                    </Box>
                  </div>
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      Reporting and analytics
                    </Box>
                    <Box variant="p">
                      Get detailed cache statistics reports, monitor your CloudFront usage in near real-time, track your
                      most popular objects, and set alarms on operational metrics.
                    </Box>
                  </div>
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      Tools and libraries
                    </Box>
                    <Box variant="p">
                      Take advantage of a variety of tools and libraries for managing your CloudFront distribution, like
                      the CloudFront API, the AWS Command Line Interface (AWS CLI), and the AWS SDKs.
                    </Box>
                  </div>
                </ColumnLayout>
              </Container>
            </div>
            <div>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'm' }}>
                Use cases
              </Box>
              <Container>
                <ColumnLayout columns={2} variant="text-grid">
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      Configure multiple origins
                    </Box>
                    <Box variant="p">
                      Configure multiple origin servers and multiple cache behaviors based on URL path patterns on your
                      website. Use AWS origins such as Amazon S3 or Elastic Load Balancing, and add your own custom
                      origins to the mix.
                    </Box>
                    <Link external={true} href="#">
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <Box variant="h3" padding={{ top: 'n' }}>
                      Deliver streaming video
                    </Box>
                    <Box variant="p">
                      Use CloudFront to deliver on-demand video without the need to set up or operate any media servers.
                      CloudFront supports multiple protocols for media streaming.
                    </Box>
                    <Link external={true} href="#">
                      Learn more
                    </Link>
                  </div>
                </ColumnLayout>
              </Container>
            </div>
            <Container header={<Header variant="h2">Related services</Header>}>
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="h3" padding={{ top: 'n' }}>
                    <Link external={true} fontSize="heading-m">
                      Amazon S3
                    </Link>
                  </Box>
                  <Box variant="p">Use Amazon S3 to store the content that CloudFront delivers.</Box>
                </div>
                <div>
                  <Box variant="h3" padding={{ top: 'n' }}>
                    <Link external={true} fontSize="heading-m">
                      Amazon Route 53
                    </Link>
                  </Box>
                  <Box variant="p">
                    Use Amazon Route 53 to route DNS queries for your domain name to your CloudFront distribution.
                  </Box>
                </div>
              </ColumnLayout>
            </Container>
          </SpaceBetween>
          <div className="custom-home__sidebar">
            <SpaceBetween size="xxl">
              <Container header={<Header variant="h2">Pricing (US)</Header>}>
                {/* <SeparatedList
                  ariaLabel="Pricing details"
                  items={[
                    <>
                      <span>10 TB/month</span>
                      <Box variant="span" color="text-body-secondary">
                        $0.085 per GB
                      </Box>
                    </>,
                    <>
                      <span>100 TB/month</span>
                      <Box variant="span" color="text-body-secondary">
                        $0.065 per GB
                      </Box>
                    </>,
                    <>
                      <span>524 TB/month</span>
                      <Box variant="span" color="text-body-secondary">
                        $0.035 per GB
                      </Box>
                    </>,
                    <>
                      <span>4 PB/month</span>
                      <Box variant="span" color="text-body-secondary">
                        $0.025 per GB
                      </Box>
                    </>,
                    <>
                      <Link href="#">Cost calculator</Link>
                    </>,
                  ]}
                /> */}
              </Container>
            </SpaceBetween>
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default function () {
  const [toolsOpen, setToolsOpen] = useState(true);

  const [flashbarVisible, setFlashbarVisible] = React.useState(false);
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [breadcrumbVisible, setBreadcrumbVisible] = React.useState(false);
  const [nestingVisible, setNestingVisible] = React.useState(false);

  const handleFlashbarChange = (isChecked: boolean) => {
    setFlashbarVisible(isChecked);
  };

  const handleStackedNotificationChange = (isChecked: boolean) => {
    setNotificationsVisible(isChecked);
  };

  const handleBreadcrumbChange = (isChecked: boolean) => {
    setBreadcrumbVisible(isChecked);
  };

  const handleNestingChange = (isChecked: boolean) => {
    setNestingVisible(isChecked);
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={breadcrumbVisible ? <Breadcrumbs /> : null}
        disableContentPaddings={true}
        navigation={<Navigation />}
        tools={
          <Tools
            onFlashbarChange={handleFlashbarChange}
            onStackedNotificationChange={handleStackedNotificationChange}
            onBreadcrumbChange={handleBreadcrumbChange}
            onNestingChange={handleNestingChange}
          />
        }
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={
          flashbarVisible && !notificationsVisible ? (
            <Notifications />
          ) : notificationsVisible ? (
            <StackedNotifications />
          ) : (
            <></>
          )
        }
        //content={<Content />}
        content={
          !nestingVisible ? (
            <Content />
          ) : (
            <ContentLayout>
              <Content />
            </ContentLayout>
          )
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
