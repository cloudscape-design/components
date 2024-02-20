// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState, useEffect } from 'react';
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
import Flashbar from '~components/flashbar';
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
import { Theme, applyTheme } from '~components/theming';
import Image1 from './Images/imageOne.png';
import Image2 from './Images/imageTwo.png';
import Image3 from './Images/imageThree.png';
import Image4 from './Images/imageFour.png';

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
  // const selectOptions: SelectProps.Options = [{ value: 'First' }, { value: 'Second' }, { value: 'Third' }];
  // const [selectedOption, setSelectedOption] = useState<SelectProps.Option>({ value: 'First' });
  return (
    <div className={clsx(styles['custom-home__header'])}>
      <div className={clsx(styles['inner-header'])}>
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 7 } }, { colspan: { default: 12, xs: 5 } }]}>
          <Box margin={{ top: 'xxxl', bottom: 'xxxl' }}>
            <Box fontWeight="normal" padding={{ top: 'xxl', bottom: 'xs' }}>
              {/* <span className={clsx(styles['custom-home__category'])}>Category</span> */}
            </Box>
            <Box
              fontSize="display-l"
              fontWeight="bold"
              variant="h1"
              padding={{ top: 'xxxl', bottom: 'xs' }}
              className={clsx(styles['custom-home__header-title'])}
            >
              Generative AI for every business
            </Box>
            {/* <Box fontSize="display-l" fontWeight="light" className={clsx(styles['custom-home__header-sub-title'])}>
            
            </Box> */}
            <Box
              variant="p"
              margin={{ top: 'xs', bottom: 'l' }}
              className={clsx(styles['custom-home__header-sub-title'])}
              fontSize="heading-xl"
            >
              Boost productivity, build differentiated experiences, and innovate faster with AWS
            </Box>

            <Box
              variant="p"
              margin={{ top: 'm', bottom: 'xxxl' }}
              className={clsx(styles['custom-home__header-sub-title'])}
              fontSize="heading-xl"
            >
              <SpaceBetween size={'s'} direction="horizontal">
                <Button variant="primary">Get started with generative AI</Button>
                <Button>Connect with a specialist</Button>
              </SpaceBetween>
              <Box variant="p" margin={{ top: 'm', bottom: 'xxxl' }}></Box>
            </Box>
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
  onColorChange: (isChecked: string) => void;
}

function Tools({
  onFlashbarChange,
  onStackedNotificationChange,
  onBreadcrumbChange,
  onNestingChange,
  onColorChange,
}: ToolsProps) {
  const [hasFlash, setFlash] = React.useState(true);
  const [hasStackedNotification, setStackedNotification] = React.useState(false);
  const [hasBreadcrumb, setBreadcrumb] = React.useState(true);
  const [hasNesting, setNesting] = React.useState(true);
  const { urlParams, setUrlParams } = useContext(AppContext as any) as any;
  const [value, setColorOption] = React.useState('gradient-2');

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

  const handleColorOption = (isChecked: string) => {
    setColorOption(isChecked);
    if (onColorChange) {
      onColorChange(isChecked);
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
          Show stacked notifications
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
        <FormField label="Header background color">
          <RadioGroup
            onChange={({ detail }) => {
              handleColorOption(detail.value);
              setUrlParams({ colorOptionCheck: detail.value });
            }}
            value={value}
            items={[
              { value: 'default', label: 'Grey-900' },
              { value: 'gradient-1', label: 'Gradient 1' },
              { value: 'gradient-2', label: 'Gradient 2' },
            ]}
          />
        </FormField>
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

const ContentWithContentLayout = () => {
  return (
    <Box>
      <SpaceBetween size="xxl">
        <Grid gridDefinition={[{ colspan: { default: 12, xs: 7 } }, { colspan: { default: 12, xs: 5 } }]}>
          <div>
            <Box variant="awsui-value-large" tagOverride="h2" padding={{ top: 'm' }}>
              Generative AI on AWS
            </Box>
            <Box variant="p" fontSize="heading-s" padding={{ bottom: 'xxl', right: 'xxxl' }}>
              From startups to enterprises, organizations trust AWS to innovate with generative artificial intelligence
              (AI). With enterprise-grade security and privacy, access to industry-leading foundation models, and
              generative AI-powered applications, AWS makes it easy to build and scale generative AI, customized for
              your data, your use cases and your customers.
            </Box>
          </div>
          <Box>
            <img src={Image1} alt="test" width={'100%'} />
          </Box>
        </Grid>

        <div>
          <Box variant="awsui-value-large" tagOverride="h2" padding={{ top: 'm' }}>
            What`&apos`s new
          </Box>
          <section className={clsx(styles.parent)}>
            <div className={clsx(styles['child-1'])}>
              <div className={clsx(styles['background-image'])}>
                <img src={Image2} alt="test" width={'auto%'} height={'100%'} />
              </div>
              <div className={clsx(styles['foreground-content'])}>
                <div className={clsx(styles.badge)}>Service</div>
                <div className={clsx(styles.bottom)}>
                  <div>Welcome to the new world of work with Amazon Q</div>
                </div>
              </div>
            </div>

            <div className={clsx(styles['child-2'])}>
              <div className={clsx(styles['background-image'])}>
                <img src={Image3} alt="test" width={'100%'} height={'100%'} />
              </div>
              <div className={clsx(styles['foreground-content'])}>
                <div className={clsx(styles.badge)}>Service</div>
                <div className={clsx(styles.bottom)}>
                  <div>Welcome to the new world of work with Amazon Q</div>
                </div>
              </div>
            </div>
            <div className={clsx(styles['child-3'])}>
              <div className={clsx(styles['background-image'])}>
                <img src={Image4} alt="test" width={'100%'} />
              </div>
              <div className={clsx(styles['foreground-content'])}>
                <div className={clsx(styles.badge)}>Service</div>
                <div className={clsx(styles.bottom)}>
                  <div>Welcome to the new world of work with Amazon Q</div>
                </div>
              </div>
            </div>
          </section>
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
                  website. Use AWS origins such as Amazon S3 or Elastic Load Balancing, and add your own custom origins
                  to the mix.
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
    </Box>
  );
};

const ContentWithoutContentLayout = () => {
  const selectOptions: SelectProps.Options = [{ value: 'First' }, { value: 'Second' }, { value: 'Third' }];
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>({ value: 'First' });
  return (
    <Box margin={{ bottom: 'l' }}>
      <div className={clsx(styles['custom-home__header'])}>
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
              <Box variant="p" fontWeight="normal">
                <span className={clsx(styles['custom-home__header-sub-title'])}>
                  Amazon CloudFront is a global content delivery network service (CDN) that accelerates delivery of your
                  websites, APIs, video content or other web assets through CDN caching.
                </span>
              </Box>
            </div>
            <div className="custom-home__header-cta">
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
              <Box variant="awsui-value-large" tagOverride="h2" padding={{ top: 'm' }}>
                Generative AI on AWS
              </Box>
              <Box variant="p" fontSize="heading-s" padding={{ bottom: 'xxl', right: 'xxxl' }}>
                From startups to enterprises, organizations trust AWS to innovate with generative artificial
                intelligence (AI). With enterprise-grade security and privacy, access to industry-leading foundation
                models, and generative AI-powered applications, AWS makes it easy to build and scale generative AI,
                customized for your data, your use cases and your customers.
              </Box>
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
  const [toolsOpen, setToolsOpen] = useState(false);

  const [flashbarVisible, setFlashbarVisible] = React.useState(true);
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [breadcrumbVisible, setBreadcrumbVisible] = React.useState(true);
  const [nestingVisible, setNestingVisible] = React.useState(true);
  const [colorOptionVisible, setColorOptionVisible] = React.useState('gradient-2');

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

  const handleColorOption = (isChecked: string) => {
    setColorOptionVisible(isChecked);
  };

  const backgroundStyleGradient1 =
    'linear-gradient(135deg, rgba(71,17,118,1) 3%, rgba(131,57,157,1) 44%, rgba(149,85,182,1) 69%, rgba(145,134,215,1) 94%)';
  const backgroundStyleGradient2 =
    'radial-gradient(circle at 70% -45%, rgba(225, 255, 226, 1) 1%, rgba(246, 255, 254, 1) 44%, rgba(255, 255, 255, 1) 100%)';

  // const [themed, setThemed] = useState<boolean>(false);
  // const [secondaryTheme, setSecondaryTheme] = useState<boolean>(false);

  console.log('Background is ' + colorOptionVisible);

  useEffect(() => {
    // const theme: Theme = {
    //   tokens: {
    //     colorBackgroundHomeHeader: {
    //       light: backgroundStyleGradient1,
    //       dark: backgroundStyleGradient1,
    //     },
    //   },
    // };

    const theme: Theme = {
      tokens: {},
    };

    if (colorOptionVisible === 'gradient-1') {
      theme.tokens.colorBackgroundHomeHeader = {
        light: backgroundStyleGradient1,
        dark: backgroundStyleGradient1,
      };
      theme.tokens.colorTextHomeHeaderSecondary = {
        light: '#e9ebed',
        dark: '#e9ebed',
      };
    } else if (colorOptionVisible === 'gradient-2') {
      theme.tokens.colorBackgroundHomeHeader = {
        light: backgroundStyleGradient2,
        dark: backgroundStyleGradient2,
      };
      theme.tokens.colorTextHomeHeaderDefault = {
        light: '#02100C',
        dark: '#02100C',
      };
      theme.tokens.colorTextHomeHeaderSecondary = {
        light: '#0C3A2D',
        dark: '#0C3A2D',
      };
      theme.tokens.colorBackgroundButtonPrimaryDefault = {
        light: '#1c2735',
        dark: '#1c2735',
      };
      theme.tokens.colorBorderButtonNormalDefault = {
        light: '#1c2735',
        dark: '#1c2735',
      };
      theme.tokens.colorTextButtonNormalDefault = {
        light: '#1c2735',
        dark: '#1c2735',
      };
    }
    applyTheme({
      theme,
      baseThemeId: 'visual-refresh',
    });
    console.log('Hello');
  }, [colorOptionVisible]);

  if (nestingVisible) {
    return (
      <ScreenshotArea gutters={false}>
        <AppLayout
          darkHeader={true} // enable dark header if there are breadcrumbs or flashbar
          contentType="hero" // navigation state
          ariaLabels={labels}
          breadcrumbs={breadcrumbVisible ? <Breadcrumbs /> : null}
          navigation={<Navigation />}
          tools={
            <Tools
              onFlashbarChange={handleFlashbarChange}
              onStackedNotificationChange={handleStackedNotificationChange}
              onBreadcrumbChange={handleBreadcrumbChange}
              onNestingChange={handleNestingChange}
              onColorChange={handleColorOption}
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
          content={
            <ContentLayout header={<HeroHeader />} disableOverlap={false} heroHeader={true}>
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
          darkHeader={true} // enable dark header if there are breadcrumbs or flashbar
          contentType="hero" // navigation state
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
              onColorChange={handleColorOption}
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
          content={<ContentWithoutContentLayout />}
        />
        <Footer legacyConsoleNav={false} />
      </ScreenshotArea>
    );
  }
  // const { reset } = applyTheme({
  //   theme,
  //   baseThemeId: 'visual-refresh',
  // });
}
