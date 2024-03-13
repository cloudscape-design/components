// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import AppLayout from '~components/app-layout';
import clsx from 'clsx';
import Box from '~components/box';
import Grid from '~components/grid';
import Container from '~components/container';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import Icon from '~components/icon';
import ColumnLayout from '~components/column-layout';
import SideNavigation from '~components/side-navigation';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import Toggle from '~components/toggle';
import HelpPanel from '~components/help-panel';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Footer, Notifications } from './utils/content-blocks';
import labels from './utils/labels';
import Button from '~components/button';
import styles from './styles.scss';
import { ContentLayout } from '~components';
import AppContext from '../app/app-context';
//import * as awsui from '@amzn/awsui-design-tokens';
//import { colorBackgroundContainerHeader } from '~design-tokens';
// * to be used to be able select all

// List component
interface SeparatedListProps {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  items: Array<React.ReactNode>;
}
function SeparatedList({ ariaLabel, ariaLabelledBy, items }: SeparatedListProps) {
  return (
    <ul aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className={styles['separated-list']}>
      {items.map((item, index) => (
        <li className={styles['separated-list-item']} key={index}>
          {item}
        </li>
      ))}
    </ul>
  );
}

// HeroHeader component
function HeroHeader() {
  const selectOptions: SelectProps.Options = [{ value: 'First' }, { value: 'Second' }, { value: 'Third' }];
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>({ value: 'First' });
  return (
    <div>
      <div className={clsx(styles['inner-header'])}>
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }]}>
          <Box margin={{ top: 'xxl' }}>
            <Box fontWeight="normal" padding={{ top: 'xs', bottom: 'xs' }}>
              <span className={clsx(styles['custom-home__category'])}>Category</span>
            </Box>
            <Box
              fontSize="display-l"
              fontWeight="bold"
              variant="h1"
              padding="n"
              className={clsx(styles['custom-home__header-title'])}
            >
              Hero Header
            </Box>
            <Box fontSize="display-l" fontWeight="light" className={clsx(styles['custom-home__header-sub-title'])}>
              Industry solutions to unlock innovation
            </Box>
            <Box
              variant="p"
              margin={{ top: 'xs', bottom: 'l' }}
              className={clsx(styles['custom-home__header-sub-title'])}
            >
              Shorten procurement times, implement the controls you need to operate with confidence, and enable your
              organization to unlock innovation.
            </Box>
          </Box>
          <Box margin={{ top: 'xxl', bottom: 'xxl' }}>
            <Container header={<Header variant="h2">Create distribution</Header>}>
              <SpaceBetween direction="vertical" size="xl">
                <FormField stretch={true} label="Delivery method">
                  <Select
                    ariaLabel="Demo select"
                    selectedOption={selectedOption}
                    options={selectOptions}
                    onChange={event => setSelectedOption(event.detail.selectedOption)}
                  />
                </FormField>
                <Button href="#" variant="primary">
                  Next step
                </Button>
              </SpaceBetween>
            </Container>
          </Box>
        </Grid>
      </div>
    </div>
  );
}

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
  onHeaderTypeChange: (isChecked: string) => void;
}

function Tools({
  onFlashbarChange,
  onStackedNotificationChange,
  onBreadcrumbChange,
  onNestingChange,
  onHeaderTypeChange,
}: ToolsProps) {
  const [hasFlash, setFlash] = React.useState(true);
  const [hasStackedNotification, setStackedNotification] = React.useState(false);
  const [hasBreadcrumb, setBreadcrumb] = React.useState(true);
  const [hasNesting, setNesting] = React.useState(true);
  const { urlParams, setUrlParams } = useContext(AppContext as any) as any;
  const [value, setHeaderType] = React.useState('homepage');

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

  const handleBreadcrumbChange = (isChecked: boolean) => {
    setBreadcrumb(isChecked);
    if (onBreadcrumbChange) {
      onBreadcrumbChange(isChecked);
    }
  };

  const handleNestingChange = (isChecked: boolean) => {
    setNesting(isChecked);
    if (onNestingChange) {
      onNestingChange(isChecked);
    }
  };

  const handleHeaderTypeChange = (isChecked: string) => {
    setHeaderType(isChecked);
    if (onHeaderTypeChange) {
      onHeaderTypeChange(isChecked);
    }
  };

  return (
    <HelpPanel header={<h2>Configuration</h2>}>
      <SpaceBetween size="m">
        <Toggle
          onChange={({ detail }) => {
            setUrlParams({ removeHighContrastHeader: detail.checked });
            location.reload();
          }}
          checked={urlParams.removeHighContrastHeader}
        >
          Remove dark header
        </Toggle>
        <Toggle
          onChange={({ detail }) => {
            handleFlashbarChange(detail.checked);
            setUrlParams({ notificationVisible: detail.checked });
          }}
          checked={(urlParams.notificationVisible, hasFlash)}
        >
          Show Flashbar
        </Toggle>
        <Toggle
          onChange={({ detail }) => {
            handleStackedNotificationChange(detail.checked);
            setUrlParams({ stackNotificationVisible: detail.checked });
          }}
          //checked={hasStackedNotification}
          checked={(urlParams.stackNotificationVisible, hasStackedNotification)}
        >
          Sticky notification
        </Toggle>
        <Toggle
          onChange={({ detail }) => {
            handleBreadcrumbChange(detail.checked);
            setUrlParams({ breadcrumbCheck: detail.checked });
          }}
          checked={(urlParams.breadcrumbVisible, hasBreadcrumb)}
        >
          Show Breadcrumb
        </Toggle>
        <Toggle
          onChange={({ detail }) => {
            handleNestingChange(detail.checked);
            setUrlParams({ nestingCheck: detail.checked });
          }}
          checked={(urlParams.breadcrumbVisible, hasNesting)}
        >
          Wrap content in ContentLayout
        </Toggle>
        <FormField
          label="Testing HeaderType"
          description="When 'homepage' is selected, it provides dark visual context for breadcrumb and light visual context for header content. When 'hero' is selected, it provides dark visual context for breadcrumb and header content."
        >
          <RadioGroup
            onChange={({ detail }) => {
              handleHeaderTypeChange(detail.value);
              setUrlParams({ colorOptionCheck: detail.value });
            }}
            value={value}
            items={[
              { value: 'homepage', label: 'homepage' },
              { value: 'documentation', label: 'documentation' },
              { value: 'hero', label: 'hero' },
            ]}
          />
        </FormField>
      </SpaceBetween>
    </HelpPanel>
  );
}

const ContentWithContentLayout = () => {
  return (
    <Box>
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }]}>
        <SpaceBetween size="xxl">
          <div>
            <Box padding={{ top: 'xxxl' }}>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'xxxl' }}>
                How it works
              </Box>
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
        <div>
          <SpaceBetween size="xxl">
            <Container header={<Header variant="h2">Pricing (US)</Header>}>
              <SeparatedList
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
                    <Link external={true} href="#">
                      Cost calculator
                    </Link>
                  </>,
                ]}
              />
            </Container>
            <Container header={<Header info={<Icon name="external" size="medium" />}>Getting started</Header>}>
              <SeparatedList
                ariaLabel="Getting started"
                items={[
                  <>
                    <Link href="#">What is Amazon CloudFront?</Link>
                  </>,
                  <>
                    <Link href="#">Getting started with CloudFront</Link>
                  </>,
                  <>
                    <Link href="#">Working with CloudFront distributions</Link>
                  </>,
                ]}
              />
            </Container>
          </SpaceBetween>
        </div>
      </Grid>
    </Box>
  );
};

const ContentWithoutContentLayout = () => {
  const selectOptions: SelectProps.Options = [{ value: 'First' }, { value: 'Second' }, { value: 'Third' }];
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>({ value: 'First' });
  return (
    <Box margin={{ bottom: 'l' }}>
      <div className={clsx(styles['custom-home__header'])}>
        <Box padding={{ top: 'xl', bottom: 'xxxl', horizontal: 's' }}>
          <Grid
            className="homepage-heading"
            gridDefinition={[
              { offset: { l: 2, xxs: 1 }, colspan: { l: 8, xxs: 10 } },
              { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
              { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
            ]}
          >
            <Box fontWeight="normal" padding={{ top: 'xs', bottom: 'xxxs' }}>
              <span className={clsx(styles['custom-home__category'])}>Category</span>
            </Box>
            <div className={clsx(styles['custom-home__header-title'])}>
              <Box
                variant="h1"
                fontWeight="heavy"
                padding="n"
                fontSize="display-l"
                className={clsx(styles['custom-home__header-title'])}
              >
                Amazon CloudFront
              </Box>
              <Box
                fontWeight="light"
                padding={{ bottom: 's' }}
                fontSize="display-l"
                className={clsx(styles['custom-home__header-title'])}
              >
                Fast and reliable delivery of your static content
              </Box>
              <Box variant="p" fontWeight="normal" padding={{ bottom: 'l' }}>
                <span className={clsx(styles['custom-home__header-sub-title'])}>
                  Amazon CloudFront is a global content delivery network service (CDN) that accelerates delivery of your
                  websites, APIs, video content or other web assets through CDN caching.
                </span>
              </Box>
            </div>
            <div className={clsx(styles['custom-home__header-cta'])}>
              <Container header={<Header variant="h2">Create distribution</Header>}>
                <SpaceBetween size="xl">
                  <FormField stretch={true} label="Delivery method">
                    <Select
                      ariaLabel="Demo select"
                      selectedOption={selectedOption}
                      options={selectOptions}
                      onChange={event => setSelectedOption(event.detail.selectedOption)}
                    />
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
                  aria-label="End user traffic enters the nearest AWS Edge Location"
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
          <div className={clsx(styles['custom-home__sidebar'])}>
            <SpaceBetween size="xxl">
              <Container header={<Header variant="h2">Pricing (US)</Header>}>
                <SeparatedList
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
                />
              </Container>

              <Container header={<Header info={<Icon name="external" size="medium" />}>Getting started</Header>}>
                <SeparatedList
                  ariaLabel="Getting started"
                  items={[
                    <>
                      <Link href="#">What is Amazon CloudFront?</Link>
                    </>,
                    <>
                      <Link href="#">Getting started with CloudFront</Link>
                    </>,
                    <>
                      <Link href="#">Working with CloudFront distributions</Link>
                    </>,
                  ]}
                />
              </Container>

              <Container header={<Header info={<Icon name="external" size="medium" />}>More resources</Header>}>
                <SeparatedList
                  ariaLabel="Getting started"
                  items={[
                    <>
                      <Link href="#">Documentation</Link>
                    </>,
                    <>
                      <Link href="#">FAQ</Link>
                    </>,
                    <>
                      <Link href="#">CloudFront forum</Link>
                    </>,
                    <>
                      <Link href="#">Contact us</Link>
                    </>,
                  ]}
                />
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

  const [flashbarVisible, setFlashbarVisible] = React.useState(true);
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [breadcrumbVisible, setBreadcrumbVisible] = React.useState(true);
  const [nestingVisible, setNestingVisible] = React.useState(true);
  const [headerTypeVisible, setHeaderTypeVisible] = React.useState('homepage');

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

  const handleHeaderTypeChange = (isChecked: string) => {
    setHeaderTypeVisible(isChecked);
  };

  //console.log('headerTypeVisible is ' + headerTypeVisible);

  if (nestingVisible) {
    return (
      <ScreenshotArea gutters={false}>
        <AppLayout
          maxContentWidth={1280}
          ariaLabels={labels}
          breadcrumbs={breadcrumbVisible ? <Breadcrumbs /> : null}
          navigation={<Navigation />}
          tools={
            <Tools
              onFlashbarChange={handleFlashbarChange}
              onStackedNotificationChange={handleStackedNotificationChange}
              onBreadcrumbChange={handleBreadcrumbChange}
              onNestingChange={handleNestingChange}
              onHeaderTypeChange={handleHeaderTypeChange}
            />
          }
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          notifications={flashbarVisible ? <Notifications /> : <></>}
          stickyNotifications={notificationsVisible ? true : false}
          content={
            <ContentLayout
              header={<HeroHeader />}
              disableOverlap={false}
              headerType={
                headerTypeVisible === 'homepage'
                  ? 'homepage'
                  : headerTypeVisible === 'documentation'
                  ? 'documentation'
                  : headerTypeVisible === 'hero'
                  ? 'hero'
                  : 'default'
              }
              // headerBackground={
              //   headerTypeVisible === 'default'
              //     ? '#000716'
              //     : headerTypeVisible === 'gradient-1'
              //     ? 'linear-gradient(135deg, rgba(71,17,118,1) 3%, rgba(131,57,157,1) 44%, rgba(149,85,182,1) 69%, rgba(145,134,215,1) 94%)'
              //     : headerTypeVisible === 'gradient-2'
              //     ? 'radial-gradient(ellipse at 31% 100%, rgba(216, 255, 217, 1) 0%, rgba(229, 255, 251, 1) 48%, rgba(251, 255, 254, 1) 92%)'
              //     : 'red'
              // }
            >
              <ContentWithContentLayout />
            </ContentLayout>
          }
        />
        <Footer legacyConsoleNav={false} />
      </ScreenshotArea>
    );
  } else {
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
              onHeaderTypeChange={handleHeaderTypeChange}
            />
          }
          toolsOpen={toolsOpen}
          onToolsChange={({ detail }) => setToolsOpen(detail.open)}
          notifications={flashbarVisible ? <Notifications /> : <></>}
          stickyNotifications={notificationsVisible ? true : false}
          content={<ContentWithoutContentLayout />}
        />
        <Footer legacyConsoleNav={false} />
      </ScreenshotArea>
    );
  }
}
