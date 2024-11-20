// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import { AppLayout, ContentLayout, Drawer, Header, SpaceBetween, SplitPanel } from '~components';
import { AppLayoutProps } from '~components/app-layout';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Containers } from '../app-layout/utils/content-blocks';
import { drawerLabels } from '../app-layout/utils/drawers';
import appLayoutLabels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import KeyValuePairTable from './kvp-table';

import styles from '../app-layout/styles.scss';

type DemoContext = React.Context<
  AppContextType<{
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    disableContentPaddings: boolean | undefined;
  }>
>;

export default function WithDrawers() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('keyboard-shortcuts');

  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [navigationOpen, setNavigationOpen] = useState(true);

  const disableContentPaddings = urlParams.disableContentPaddings ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === ' ') {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('keyboard-shortcuts');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDrawerId]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'h') {
        // Check for spacebar press
        event.preventDefault(); // Prevent default spacebar behavior
        if (activeDrawerId !== null) {
          setActiveDrawerId(null);
        } else if (activeDrawerId === null) {
          setActiveDrawerId('keyboard-shortcuts');
        }
      }
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
      <AppLayout
        ref={appLayoutRef}
        ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            data-test-id="content"
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                  Testing Keyboard shortcuts
                </Header>
              </SpaceBetween>
            }
          >
            <Containers />
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
            key: 'Toggle help panel',
            value: 'h',
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
