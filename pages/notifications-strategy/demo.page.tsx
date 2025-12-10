// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  ExpandableSection,
  Flashbar,
  FlashbarProps,
  FormField,
  Icon,
  Link,
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
import FeaturePrompt, { FeaturePromptProps } from '~components/internal/do-not-use/feature-prompt';
import { registerFeatureNotifications, showFeaturePromptIfPossible } from '~components/internal/plugins/widget';
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

registerFeatureNotifications({
  id: 'local-feature-notifications',
  suppressFeaturePrompt: false,
  features: [
    {
      id: '1',
      header: 'Improved tracking',
      content:
        'It is now possible to see event propagation history from event detail. Learn more in the Events management.',
      releaseDate: '2025-12-01',
    },
    {
      id: '2',
      header: 'Smart priority evaluation',
      content:
        'We can now order events by priority using our new agentic AI solution! Learn how to configure it for your needs in the Smart tools.',
      releaseDate: '2025-11-24',
    },
    {
      id: '3',
      header: 'Smart descriptions',
      content:
        'We can now generate event descriptions which summarize event properties, propagation metrics, and comments. Refer to Smart tools to learn how to turn this on and customize.',
      releaseDate: '2025-11-20',
    },
  ],
});

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
  const localFeaturePromptRef = useRef<FeaturePromptProps.Ref>(null);
  const globalFeaturePromptRef = useRef<FeaturePromptProps.Ref>(null);

  useEffect(() => {
    mount(
      <div className={styles.navigation}>
        <Box padding="xxs" color="inherit" id="bug-icon">
          <Icon name="bug" />
        </Box>
        <TextFilter filteringText="" filteringPlaceholder="search" />
      </div>,
      document.querySelector('#h')!
    );
  }, [setHeader]);

  const drawersProps: Pick<AppLayoutToolbarProps, 'activeDrawerId' | 'onDrawerChange' | 'drawers'> = {
    activeDrawerId: activeDrawerId,
    drawers: [
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
      <FeaturePrompt
        ref={globalFeaturePromptRef}
        onDismiss={() => {
          // handle focus behavior here
        }}
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
        getTrack={() => document.querySelector('#bug-icon')}
        trackKey="bug-icon"
      />
      <FeaturePrompt
        ref={localFeaturePromptRef}
        onDismiss={() => {
          const triggerElement = document.querySelector(
            '[data-testid="awsui-app-layout-trigger-service-notifications"]'
          ) as HTMLButtonElement;
          triggerElement!.dataset!.awsuiSuppressTooltip = 'false';
          // TODO handle focus
        }}
        position="left"
        header={<div>Improved tracking</div>}
        content={
          <div>
            It is now possible to see event propagation history from event detail. Learn more in the Events management.
          </div>
        }
        getTrack={() => document.querySelector('[data-testid="awsui-app-layout-trigger-service-notifications"]')}
        trackKey="awsui-app-layout-trigger-service-notifications"
      />
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

            <button
              onClick={() => {
                globalFeaturePromptRef.current?.dismiss();
              }}
            >
              dismiss global feature prompt
            </button>
            <button
              onClick={() => {
                globalFeaturePromptRef.current?.show();
              }}
            >
              show global feature prompt
            </button>
            <button
              onClick={() => {
                localFeaturePromptRef.current?.dismiss();
              }}
            >
              dismiss local feature prompt
            </button>
            <button
              onClick={() => {
                localFeaturePromptRef.current?.show();
                const triggerElement = document.querySelector(
                  '[data-testid="awsui-app-layout-trigger-service-notifications"]'
                ) as HTMLButtonElement;
                triggerElement!.dataset!.awsuiSuppressTooltip = 'true';
              }}
            >
              show local feature prompt
            </button>
            <button
              onClick={() => {
                showFeaturePromptIfPossible();
              }}
            >
              showFeaturePromptIfPossible
            </button>
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
