// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  ExpandableSection,
  FeaturePrompt,
  Flashbar,
  FlashbarProps,
  FormField,
  Icon,
  Link,
  List,
  Modal,
  Popover,
  Select,
  SelectProps,
  SideNavigation,
  SpaceBetween,
  SplitPanel,
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
    featureNotificationType?: 'global' | 'service' | 'none';
    showStatusNotifications?: boolean;
    delayStatusNotifications?: boolean;
    splitPanelOpen?: boolean;
    activeDrawerId?: 'service-notifications' | 'tools' | 'none';
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

const featureNotificationTypeOptions: SelectProps.Option[] = [
  {
    value: 'global',
    label: 'Global notifications',
    description: 'The global notifications are shown even if page has status notifications',
  },
  {
    value: 'service',
    label: 'Service notifications',
    description: 'The service notifications are shown when there are no status notifications on the page load',
  },
  { value: 'none', label: 'No feature notifications' },
];

const activeDrawerOptions: SelectProps.Option[] = [
  {
    value: 'service-notifications',
    label: 'Latest feature releases',
  },
  {
    value: 'tools',
    label: 'Tools',
  },
  {
    value: 'none',
    label: 'None',
  },
];

export default function () {
  const {
    urlParams: {
      featureNotificationType = 'global',
      showStatusNotifications = false,
      delayStatusNotifications = false,
      splitPanelOpen = false,
      activeDrawerId,
    },
    setUrlParams,
    setHeader,
  } = useContext(AppContext as PageContext);
  const shouldShowNotificationsPrompt =
    featureNotificationType === 'service' && (!showStatusNotifications || delayStatusNotifications);

  const [showGlobalFeatureNotification, setShowGlobalFeatureNotification] = useState(
    featureNotificationType === 'global'
  );

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
  const drawersProps: Pick<AppLayoutToolbarProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> = {
    activeDrawerId: activeDrawerId,
    drawers: [
      {
        id: 'service-notifications',
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

              <List
                items={featureNotifications}
                renderItem={item => ({ id: item.id, content: item.header, secondaryContent: item.content })}
              />

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
        content: <Drawer header="Tools header">Tools content</Drawer>,
        trigger: { iconName: 'settings' },
      },
    ],
    onDrawerChange: event => {
      setUrlParams({ activeDrawerId: event.detail.activeDrawerId as any });
      if (event.detail.activeDrawerId === 'service-notifications') {
        setHasNewNotifications(false);
      }
    },
  };

  const [notifications, setNotifications] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(
    showStatusNotifications && !delayStatusNotifications ? createStatusNotifications(dismissNotification) : []
  );
  function dismissNotification(id: string) {
    setNotifications(notifications => notifications.filter(item => item.id !== id));
  }

  useEffect(() => {
    if (showStatusNotifications && delayStatusNotifications) {
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
        splitPanel={<SplitPanel header="Panel header">Panel content</SplitPanel>}
        splitPanelSize={400}
        splitPanelPreferences={{ position: 'side' }}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setUrlParams({ splitPanelOpen: detail.open })}
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
              { type: 'link', text: 'Navigation item 2', href: `#` },
              { type: 'link', text: 'Navigation item 3', href: `#` },
              { type: 'link', text: 'Navigation item 4', href: `#` },
              { type: 'link', text: 'Navigation item 5', href: `#` },
              { type: 'link', text: 'Navigation item 6', href: `#` },
              { type: 'link', text: 'Navigation item 7', href: `#` },
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
            <Section title="Notification settings">
              <FormField label="Feature notification type" description="Reload the page to see the effect">
                <Select
                  options={featureNotificationTypeOptions}
                  selectedOption={featureNotificationTypeOptions.find(o => o.value === featureNotificationType) ?? null}
                  onChange={({ detail }) =>
                    setUrlParams({ featureNotificationType: detail.selectedOption.value as any })
                  }
                />
              </FormField>

              <SpaceBetween size="s" direction="horizontal">
                <Checkbox
                  checked={showStatusNotifications}
                  onChange={({ detail }) => setUrlParams({ showStatusNotifications: detail.checked })}
                >
                  Show status notifications on page load
                </Checkbox>

                <Checkbox
                  disabled={!showStatusNotifications}
                  checked={delayStatusNotifications}
                  onChange={({ detail }) => setUrlParams({ delayStatusNotifications: detail.checked })}
                >
                  Delay status notifications
                </Checkbox>
              </SpaceBetween>
            </Section>

            <Section title="Panel settings">
              <Checkbox
                checked={splitPanelOpen}
                onChange={({ detail }) => setUrlParams({ splitPanelOpen: detail.checked })}
              >
                Split panel open
              </Checkbox>

              <FormField label="Active drawer">
                <Select
                  options={activeDrawerOptions}
                  selectedOption={activeDrawerOptions.find(o => o.value === activeDrawerId) ?? null}
                  onChange={({ detail }) => setUrlParams({ activeDrawerId: detail.selectedOption.value as any })}
                />
              </FormField>
            </Section>
          </SimplePage>
        }
      />
    </ScreenshotArea>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ExpandableSection headerText={title} defaultExpanded={true}>
      <SpaceBetween size="s">{children}</SpaceBetween>
    </ExpandableSection>
  );
}
