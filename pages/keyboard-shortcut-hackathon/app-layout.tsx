// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import { AppLayout, ContentLayout, Drawer, Input, SplitPanel, TopNavigation } from '~components';
import { AppLayoutProps } from '~components/app-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { drawerLabels } from '../app-layout/utils/drawers';
import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import AddNewShortcut from './add-new-shortcut';
import AWSLogo from './aws-logo.svg';

type DemoContext = React.Context<
  AppContextType<{
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    disableContentPaddings: boolean | undefined;
  }>
>;

export default function CustomAppLayout({
  header,
  children,
  splitPanelOpen,
  setSplitPanelOpen,
  customItems,
  setCustomItems,
}: any) {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  //const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);

  const disableContentPaddings = urlParams.disableContentPaddings ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  useEffect(() => {
    let keyPressed: any = {};

    const handleKeyDown = (event: any) => {
      keyPressed[event.key + event.location] = true;

      if (keyPressed.Control1 === true && keyPressed.h0 === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('help-panel');
        }

        keyPressed = {};
      }

      if (keyPressed.Control1 === true && keyPressed.s0 === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        setSplitPanelOpen(!splitPanelOpen);

        keyPressed = {};
      }

      if (keyPressed.Control1 === true && (keyPressed.q0 || keyPressed.x0) === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('amazon-q');
        }

        keyPressed = {};
      }

      if (keyPressed.Control1 === true && keyPressed.n0 === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        setNavigationOpen(!navigationOpen);

        keyPressed = {};
      }

      if (keyPressed.Control1 === true && keyPressed.f0 === true) {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        setNavigationOpen(false);
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('help-panel');
        }
        setSplitPanelOpen(false);

        keyPressed = {};
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDrawerId, splitPanelOpen, navigationOpen, setSplitPanelOpen]);

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
          position: 'side',
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
            closeBehavior="hide"
            header="Add new shortcut"
            hidePreferencesButton={true}
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
            <AddNewShortcut customItems={customItems} setCustomItems={setCustomItems} />
          </SplitPanel>
        }
        drawers={[
          {
            ariaLabels: {
              closeButton: `Close button`,
              drawerName: `Keyboard shortcuts`,
              triggerButton: `Trigger button`,
              resizeHandle: `Resize handle`,
            },
            resizable: true,

            content: <Drawer header={<h2>Help panel</h2>}>Keyboard shortcuts help you become superpowered.</Drawer>,
            id: 'help-panel',
            trigger: {
              iconName: 'status-info',
            },
          },
          {
            ariaLabels: {
              closeButton: `Close button`,
              drawerName: `Keyboard shortcuts`,
              triggerButton: `Trigger button`,
              resizeHandle: `Resize handle`,
            },
            resizable: true,

            content: <Drawer header={<h2>Amazon Q</h2>}>This is Amazon Q</Drawer>,
            id: 'amazon-q',
            trigger: {
              iconSvg: (
                <svg
                  viewBox="0 0 16 16"
                  data-analytics-type="widgetDetail"
                  data-analytics="ChatExperienceEntry"
                  data-analytics-render="true"
                  data-analytics-processed="true"
                >
                  <path
                    d="m14.22,3.41L8.87.32c-.24-.14-.55-.21-.87-.21s-.63.07-.87.21L1.78,3.41c-.48.27-.87.95-.87,1.5v6.18c0,.55.39,1.22.87,1.5l5.36,3.09c.24.14.55.21.87.21s.63-.07.87-.21l5.36-3.09c.48-.28.87-.95.87-1.5v-6.18c0-.55-.39-1.23-.87-1.5Zm-6.22,10.47l-5.09-2.94v-5.88l5.09-2.94,5.09,2.94v4.72l-3.09-1.78v-.74c0-.26-.14-.49-.36-.62l-1.28-.74c-.11-.06-.24-.1-.36-.1s-.25.03-.36.1l-1.28.74c-.22.13-.36.37-.36.62v1.48c0,.26.14.49.36.62l1.28.74c.11.06.24.1.36.1s.25-.03.36-.1l.64-.37,3.09,1.78-4.09,2.36Z"
                    fill="currentColor"
                    strokeWidth="0"
                  ></path>
                </svg>
              ),
            },
          },
        ]}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
        activeDrawerId={activeDrawerId}
      />
    </ScreenshotArea>
  );
}
