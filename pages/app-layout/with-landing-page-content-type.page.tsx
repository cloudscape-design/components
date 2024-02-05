// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
//import Header from '~components/header';
//import Link from '~components/link';
import Box from '~components/box';
import Grid from '~components/grid';
import Container from '~components/container';
//import FormField from '~components/form-field';
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
//import styles from './styles.scss';
import { ContentLayout } from '~components';

//import "./Hero.scss";
function HeroHeader() {
  return (
    <div
      className="full-header"
      style={{
        //display: 'flex',
        //position: 'relative',
        width: '100%',
        //justifyContent: 'center',
      }}
    >
      <div
        className="header-background-image awsui-util-hide-in-dark-mode"
        style={
          {
            //backgroundImage: `url("https://images.unsplash.com/photo-1515256722043-0f2b082ddadc?q=80&w=1702&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          }
        }
      />
      <div
        className="header-background-image awsui-util-show-in-dark-mode"
        style={
          {
            //backgroundImage: `url("https://images.unsplash.com/photo-1515256722043-0f2b082ddadc?q=80&w=1702&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          }
        }
      />
      <div
        className="inner-header"
        style={{
          background: 'blue',
        }}
      >
        <Grid gridDefinition={[{ colspan: { default: 12, s: 8 } }]}>
          <Box padding="s">
            <Box fontSize="display-l" fontWeight="bold" variant="h1" padding="n">
              Hero Header
            </Box>
            <Box fontSize="display-l" fontWeight="light">
              Industry solutions to unlock innovation
            </Box>
            <Box variant="p" color="text-body-secondary" margin={{ top: 'xs', bottom: 'l' }}>
              Shorten procurement times, implement the controls you need to operate with confidence, and enable your
              organization to unlock innovation.
            </Box>
          </Box>
          <Container>
            <SpaceBetween direction="vertical" size="xs">
              <Button variant="primary">Browse by Solution Category</Button>
              <Button>Browse by Solution Industry</Button>
            </SpaceBetween>
          </Container>
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

const ContentTest = () => {
  return (
    <Container>
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box variant="h3" padding={{ top: 'n' }}>
            CloudFront console
          </Box>
          <Box variant="p">
            Create, monitor, and manage your content delivery with a few simple clicks on the CloudFront console.
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
            Get detailed cache statistics reports, monitor your CloudFront usage in near real-time, track your most
            popular objects, and set alarms on operational metrics.
          </Box>
        </div>
        <div>
          <Box variant="h3" padding={{ top: 'n' }}>
            Tools and libraries
          </Box>
          <Box variant="p">
            Take advantage of a variety of tools and libraries for managing your CloudFront distribution, like the
            CloudFront API, the AWS Command Line Interface (AWS CLI), and the AWS SDKs.
          </Box>
        </div>
      </ColumnLayout>
    </Container>
  );
};

// const Content = () => {
//   return (
//     <Box margin={{ bottom: 'l' }}>
//       <Box padding={{ top: 'xxxl', horizontal: 's' }}>
//         <Grid
//           gridDefinition={[
//             { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
//             { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
//           ]}
//         >
//           <SpaceBetween size="xxl">
//             <div>
//               <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'm' }}>
//                 How it works
//               </Box>
//               <Container>
//                 <div
//                   className={styles.contentPlaceholder}
//                   role="img"
//                   aria-label="End user traffic enters the nearest AWS Edge Location protected by AWS Shield and AWS WAF before it passes through Regional Edge Caches and Origin Shield to the Application Content Origin"
//                 ></div>
//               </Container>
//             </div>

//             <div>
//               <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'm' }}>
//                 Benefits and features
//               </Box>
//               <Container>
//                 <ColumnLayout columns={2} variant="text-grid">
//                   <div>
//                     <Box variant="h3" padding={{ top: 'n' }}>
//                       CloudFront console
//                     </Box>
//                     <Box variant="p">
//                       Create, monitor, and manage your content delivery with a few simple clicks on the CloudFront
//                       console.
//                     </Box>
//                   </div>
//                   <div>
//                     <Box variant="h3" padding={{ top: 'n' }}>
//                       Static and dynamic content
//                     </Box>
//                     <Box variant="p">
//                       Deliver both static content and dynamic content that you can personalize for individual users.
//                     </Box>
//                   </div>
//                   <div>
//                     <Box variant="h3" padding={{ top: 'n' }}>
//                       Reporting and analytics
//                     </Box>
//                     <Box variant="p">
//                       Get detailed cache statistics reports, monitor your CloudFront usage in near real-time, track your
//                       most popular objects, and set alarms on operational metrics.
//                     </Box>
//                   </div>
//                   <div>
//                     <Box variant="h3" padding={{ top: 'n' }}>
//                       Tools and libraries
//                     </Box>
//                     <Box variant="p">
//                       Take advantage of a variety of tools and libraries for managing your CloudFront distribution, like
//                       the CloudFront API, the AWS Command Line Interface (AWS CLI), and the AWS SDKs.
//                     </Box>
//                   </div>
//                 </ColumnLayout>
//               </Container>
//             </div>
//           </SpaceBetween>
//           <div className="custom-home__sidebar">
//             <SpaceBetween size="xxl">
//               <Container header={<Header variant="h2">Pricing (US)</Header>}></Container>
//             </SpaceBetween>
//           </div>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

export default function () {
  const [toolsOpen, setToolsOpen] = useState(true);

  const [flashbarVisible, setFlashbarVisible] = React.useState(false);
  const [notificationsVisible, setNotificationsVisible] = React.useState(false);
  const [breadcrumbVisible, setBreadcrumbVisible] = React.useState(false);
  const [nestingVisible, setNestingVisible] = React.useState(false);

  console.log(nestingVisible);

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
        contentType="hero"
        ariaLabels={labels}
        breadcrumbs={breadcrumbVisible ? <Breadcrumbs /> : null}
        //disableContentPaddings={true}
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
        content={
          <ContentLayout header={<HeroHeader />} disableOverlap={true}>
            <ContentTest />
          </ContentLayout>
        }
      />
      <Footer legacyConsoleNav={false} />
    </ScreenshotArea>
  );
}
