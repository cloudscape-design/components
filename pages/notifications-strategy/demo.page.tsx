// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FeaturePrompt,
  Flashbar,
  FlashbarProps,
  Icon,
  Link,
  Modal,
  Popover,
  SideNavigation,
  SpaceBetween,
  TextFilter,
} from '~components';
import AppLayoutToolbar, { AppLayoutToolbarProps } from '~components/app-layout-toolbar';
import { mount } from '~mount';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { Breadcrumbs } from '../app-layout/utils/content-blocks';
import appLayoutAriaLabels from '../app-layout/utils/labels';
import { i18nStrings as flashbarI18nStrings } from '../flashbar/common';
import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

type PageContext = React.Context<
  AppContextType<{
    showStatusNotifications?: boolean;
    showStatusNotificationsWithDelay?: boolean;
    showGlobalFeatureNotification?: boolean;
  }>
>;

const createStatusNotifications = (onDismiss: (id: string) => void): readonly FlashbarProps.MessageDefinition[] => [
  {
    id: 'info-1',
    type: 'info',
    content: 'Info status notification',
    dismissible: true,
    onDismiss: () => onDismiss('info-1'),
  },
  {
    id: 'warning-1',
    type: 'warning',
    content: 'Warning status notification',
    dismissible: true,
    onDismiss: () => onDismiss('warning-1'),
  },
];

const featureNotifications = [
  {
    id: 'feature-1',
    header: (
      <Box fontWeight="bold">
        <Icon name="history" /> Improved tracking
      </Box>
    ),
    content: (
      <div>
        <Box variant="p">
          It is now possible to see event propagation history from event detail. Learn more in the{' '}
          <Link href="#">Events management</Link>.
        </Box>
        <Box fontSize="body-s" color="text-body-secondary">
          Released less than 48 hours ago!
        </Box>
      </div>
    ),
  },
  {
    id: 'feature-2',
    header: (
      <Box fontWeight="bold">
        <Icon name="gen-ai" /> Smart priority evaluation
      </Box>
    ),
    content: (
      <div>
        <Box variant="p">
          We can now order events by priority using our new agentic AI solution! Learn how to configure it for your
          needs in the <Link href="#">Smart tools</Link>.
        </Box>
        <Box fontSize="body-s" color="text-body-secondary">
          Released 8 days ago
        </Box>
      </div>
    ),
  },
  {
    id: 'feature-3',
    header: (
      <Box fontWeight="bold">
        <Icon name="gen-ai" /> Smart descriptions
      </Box>
    ),
    content: (
      <div>
        <Box variant="p">
          We can now generate event descriptions which summarize event properties, propagation metrics, and comments.
          Refer to <Link href="#">Smart tools</Link> to learn how to turn this on and customize.
        </Box>
        <Box fontSize="body-s" color="text-body-secondary">
          Released 29 days ago
        </Box>
      </div>
    ),
  },
];

export default function () {
  const {
    urlParams: {
      showStatusNotifications = true,
      showStatusNotificationsWithDelay = false,
      showGlobalFeatureNotification: showGlobalFeatureNotificationInitial = true,
    },
    setUrlParams,
    setHeader,
  } = useContext(AppContext as PageContext);
  const shouldShowNotificationsPrompt = !showStatusNotifications || showStatusNotificationsWithDelay;

  const [showGlobalFeatureNotification, setShowGlobalFeatureNotification] = useState(false);
  useEffect(() => {
    setTimeout(() => setShowGlobalFeatureNotification(showGlobalFeatureNotificationInitial), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mount(
      <div className={styles.navigation}>
        <FeaturePrompt
          visible={showGlobalFeatureNotification}
          onDismiss={() => setShowGlobalFeatureNotification(false)}
          position="bottom"
          header={
            <Box fontWeight="bold">
              <Icon name="gen-ai" /> Our AI buddy is smarter than ever
            </Box>
          }
          content={
            <Box>
              It supports filtering with plain language, reports generation with .pdf, and so much more! See{' '}
              <Link href="#">top 10 things it can do for you</Link>.
            </Box>
          }
        >
          <Box padding="xxs" color="inherit">
            <Icon name="bug" />
          </Box>
        </FeaturePrompt>
        <TextFilter filteringText="" filteringPlaceholder="search" />
      </div>,
      document.querySelector('#h')!
    );
  }, [setHeader, showGlobalFeatureNotification]);

  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [showNotificationsFeaturePrompt, setShowNotificationsFeaturePrompt] = useState(shouldShowNotificationsPrompt);
  const [activeDrawerId, setActiveDrawerId] = useState<null | string>(null);
  const drawersProps: Pick<AppLayoutToolbarProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> = {
    activeDrawerId: activeDrawerId,
    drawers: [
      {
        id: 'feature-notifications',
        resizable: true,
        badge: hasNewNotifications,
        ariaLabels: {
          closeButton: 'Close feature notifications',
          drawerName: 'Feature notifications',
          triggerButton: 'Toggle feature notifications',
          resizeHandle: 'Resize feature notifications panel',
        },
        content: (
          <Drawer header="Latest feature releases">
            <SpaceBetween size="m">
              <Box>Features released less than 30 days ago</Box>

              {featureNotifications.map(n => (
                <Box key={n.id}>
                  {n.header}
                  {n.content}
                </Box>
              ))}

              <Link
                href="#"
                onFollow={event => {
                  event.preventDefault();
                  setWhatsNewOpened(true);
                }}
              >
                See all feature releases
              </Link>
            </SpaceBetween>
          </Drawer>
        ),
        featurePrompt: {
          visible: showNotificationsFeaturePrompt,
          onDismiss: () => setShowNotificationsFeaturePrompt(false),
          header: featureNotifications[0].header,
          content: featureNotifications[0].content,
        },
        trigger: { iconName: 'suggestions' },
      },
      {
        id: 'tools',
        resizable: true,
        ariaLabels: {
          closeButton: 'Close tools',
          drawerName: 'Tools',
          triggerButton: 'Toggle tools',
          resizeHandle: 'Resize tools panel',
        },
        content: <Drawer>Tools content</Drawer>,
        trigger: { iconName: 'settings' },
      },
    ],
    onDrawerChange: event => {
      setActiveDrawerId(event.detail.activeDrawerId);
      if (event.detail.activeDrawerId === 'feature-notifications') {
        setHasNewNotifications(false);
      }
    },
  };

  const [notifications, setNotifications] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(
    showStatusNotifications && !showStatusNotificationsWithDelay ? createStatusNotifications(dismissNotification) : []
  );
  function dismissNotification(id: string) {
    setNotifications(notifications => notifications.filter(item => item.id !== id));
  }

  useEffect(() => {
    if (showStatusNotifications && showStatusNotificationsWithDelay) {
      setTimeout(() => setNotifications(createStatusNotifications(dismissNotification)), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [whatsNewOpened, setWhatsNewOpened] = useState(false);

  return (
    <ScreenshotArea gutters={false}>
      <Modal
        header="Fake what's new page"
        visible={whatsNewOpened}
        onDismiss={() => setWhatsNewOpened(false)}
        footer={
          <div style={{ float: 'inline-end' }}>
            <Button onClick={() => setWhatsNewOpened(false)}>Close</Button>
          </div>
        }
      >
        Page content
      </Modal>

      <AppLayoutToolbar
        ariaLabels={appLayoutAriaLabels}
        breadcrumbs={<Breadcrumbs />}
        navigation={
          <SideNavigation
            onFollow={event => {
              if (event.detail.href === '#whatsnew') {
                event.preventDefault();
                setWhatsNewOpened(true);
              }
            }}
            header={{
              href: '#',
              text: 'Service name',
            }}
            items={[
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'link', text: 'Navigation item 1', href: `#` },
              { type: 'divider' },
              {
                type: 'link',
                text: "What's new",
                href: '#whatsnew',
                info: (
                  <Popover
                    header="Feature spotlight"
                    content="Learn about use cases and features that will help you get the most out of this demo page."
                  >
                    <Button variant="inline-link">New</Button>
                  </Popover>
                ),
              },
            ]}
          />
        }
        notifications={<Flashbar stackItems={true} items={notifications} i18nStrings={flashbarI18nStrings} />}
        {...drawersProps}
        content={
          <SimplePage title="Demo page">
            <SpaceBetween size="s" direction="horizontal">
              <Checkbox
                checked={showStatusNotifications}
                onChange={({ detail }) => setUrlParams({ showStatusNotifications: detail.checked })}
              >
                Show status notifications on page load
              </Checkbox>

              <Checkbox
                checked={showStatusNotificationsWithDelay}
                onChange={({ detail }) => setUrlParams({ showStatusNotificationsWithDelay: detail.checked })}
              >
                Show status notifications with a delay
              </Checkbox>

              <Checkbox
                checked={showGlobalFeatureNotificationInitial}
                onChange={({ detail }) => setUrlParams({ showGlobalFeatureNotification: detail.checked })}
              >
                Show global feature notification on page load
              </Checkbox>
            </SpaceBetween>
          </SimplePage>
        }
      />
    </ScreenshotArea>
  );
}
