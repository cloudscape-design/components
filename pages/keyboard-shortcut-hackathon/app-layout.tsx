// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import { AppLayout, ContentLayout, Drawer, Input, SpaceBetween, SplitPanel, TopNavigation } from '~components';
import { AppLayoutProps } from '~components/app-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { drawerLabels } from '../app-layout/utils/drawers';
import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import AWSLogo from './aws-logo.svg';
import KeyValuePairTable from './kvp-table';

import styles from '../app-layout/styles.scss';

type DemoContext = React.Context<
  AppContextType<{
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    disableContentPaddings: boolean | undefined;
  }>
>;

export default function CustomAppLayout({ header, children }: any) {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);

  const disableContentPaddings = urlParams.disableContentPaddings ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  useEffect(() => {
    let keyPressed: any = {};

    const handleKeyDown = (event: any) => {
      keyPressed[event.key + event.location] = true;

      if (keyPressed.Control1 === true && keyPressed['/0'] === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('keyboard-shortcuts');
        }

        keyPressed = {};
      }
      console.log(keyPressed);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDrawerId]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 's') {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        setSplitPanelOpen(!splitPanelOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [splitPanelOpen]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'n') {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        setNavigationOpen(!navigationOpen);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigationOpen]);

  return (
    <ScreenshotArea gutters={false}>
      <TopNavigation
        identity={{
          href: '#',
          logo: { src: AWSLogo, alt: 'AWS logo' },
        }}
        search={
          <>
            <Input value="" type="search" placeholder="Search" ariaLabel="Search" />
            <div />
          </>
        }
        utilities={[
          {
            type: 'button',
            iconName: 'notification',
            title: 'Notifications',
            ariaLabel: 'Notifications (unread)',
            badge: true,
            disableUtilityCollapse: false,
          },
          {
            type: 'menu-dropdown',
            iconName: 'settings',
            ariaLabel: 'Settings',
            title: 'Settings',
            onItemClick: event => {
              if (event.detail.id === 'keyboard-shortcuts') {
                setActiveDrawerId('keyboard-shortcuts');
              }
            },
            items: [
              {
                id: 'keyboard-shortcuts',
                text: 'Keyboard shortcuts',
              },
            ],
          },
          {
            type: 'menu-dropdown',
            text: 'Customer Name',
            description: 'email@example.com',
            iconName: 'user-profile',
            items: [
              { id: 'profile', text: 'Profile' },
              { id: 'preferences', text: 'Preferences' },
              { id: 'security', text: 'Security' },
              {
                id: 'support-group',
                text: 'Support',
                items: [
                  {
                    id: 'documentation',
                    text: 'Documentation',
                    href: '#',
                    external: true,
                    externalIconAriaLabel: ' (opens in new tab)',
                  },
                  { id: 'support', text: 'Support' },
                  {
                    id: 'feedback',
                    text: 'Feedback',
                    href: '#',
                    external: true,
                    externalIconAriaLabel: ' (opens in new tab)',
                  },
                ],
              },
              { id: 'signout', text: 'Sign out' },
            ],
          },
        ]}
      />
      <AppLayout
        ref={appLayoutRef}
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
        content={
          <ContentLayout data-test-id="content" header={header}>
            {children}
          </ContentLayout>
        }
        splitPanelPreferences={{
          position: urlParams.splitPanelPosition,
        }}
        onSplitPanelPreferencesChange={event => {
          const { position } = event.detail;
          setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
        }}
        disableContentPaddings={disableContentPaddings}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
        navigationOpen={navigationOpen}
        onNavigationChange={event => setNavigationOpen(event.detail.open)}
        splitPanel={
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            <SpaceBetween size="l">
              <div className={styles.contentPlaceholder} />
              <div className={styles.contentPlaceholder} />
              <div className={styles.contentPlaceholder} />
            </SpaceBetween>
          </SplitPanel>
        }
        drawers={[
          {
            ariaLabels: {
              closeButton: `Close button`,
              drawerName: `Keyboard shortcuts`,
              triggerButton: `Trigger button`,
              resizeHandle: `$Resize handle`,
            },
            resizable: true,
            defaultSize: 500,
            content: (
              <Drawer header={<h2>Keyboard shortcuts</h2>}>
                <DrawerContent />
              </Drawer>
            ),
            id: 'keyboard-shortcuts',
            trigger: {
              iconName: 'settings',
            },
          },
        ]}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
        activeDrawerId={activeDrawerId}
      />
    </ScreenshotArea>
  );
}

function DrawerContent() {
  return (
    <SpaceBetween size="l">
      <KeyValuePairTable
        header="Settings"
        items={[
          {
            key: 'Toggle dark mode',
            value: '^ + D',
          },
          {
            key: 'Toggle compact mode',
            value: '^ + C',
          },
          {
            key: 'Toggle visual refresh',
            value: '^ + V',
          },
          {
            key: 'Toggle motion disabled',
            value: '^ + M',
          },
          {
            key: 'RTL direction',
            value: '^ + R',
          },
          {
            key: 'LTR direction',
            value: '^ + L',
          },
        ]}
      />
      <KeyValuePairTable
        header="Panels"
        items={[
          {
            key: 'Toggle keyboard shortcuts',
            value: '^ + /',
          },
          {
            key: 'Toggle split panel',
            value: 's',
          },
          {
            key: 'Toggle side navigation',
            value: 'n',
          },
        ]}
      />
    </SpaceBetween>
  );
}
