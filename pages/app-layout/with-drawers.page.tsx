// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext, useRef } from 'react';
import { AppLayout, ContentLayout, Header, SpaceBetween, SplitPanel, Toggle, Button } from '~components';
import { AppLayoutProps } from '~components/app-layout';
import appLayoutLabels from './utils/labels';
import { Breadcrumbs, Containers } from './utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import AppContext, { AppContextType } from '../app/app-context';
import styles from './styles.scss';
import { drawerItems, drawerLabels } from './utils/drawers';

type DemoContext = React.Context<
  AppContextType<{
    hasDrawers: boolean | undefined;
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    disableContentPaddings: boolean | undefined;
  }>
>;

export default function WithDrawers() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const hasDrawers = urlParams.hasDrawers ?? true;
  const disableContentPaddings = urlParams.disableContentPaddings ?? false;
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  function openDrawer(id: string) {
    setActiveDrawerId(id);
    appLayoutRef.current?.focusActiveDrawer();
  }

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
                  Testing Custom Drawers!
                </Header>

                <SpaceBetween size="xs">
                  <Toggle
                    checked={hasDrawers}
                    onChange={({ detail }) => setUrlParams({ hasDrawers: detail.checked })}
                    data-id="toggle-drawers"
                  >
                    Has Drawers
                  </Toggle>
                </SpaceBetween>
                <Button onClick={() => openDrawer('security')} data-testid="open-drawer-button">
                  Open drawer
                </Button>
                <Button onClick={() => openDrawer('pro-help')} data-testid="open-drawer-button-2">
                  Open second drawer
                </Button>
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
        drawers={hasDrawers ? drawerItems : undefined}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
        activeDrawerId={activeDrawerId}
      />
    </ScreenshotArea>
  );
}
