// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// To-do: Delete this page once all instances of beta drawers is gone.
import React, { useState, useContext } from 'react';
import {
  AppLayout,
  ContentLayout,
  Header,
  NonCancelableCustomEvent,
  SpaceBetween,
  SplitPanel,
  Toggle,
} from '~components';
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

  const betaDrawers = !hasDrawers
    ? null
    : {
        drawers: {
          ariaLabel: 'Drawers',
          overflowAriaLabel: 'Overflow drawers',
          overflowWithBadgeAriaLabel: 'Overflow drawers (Unread notifications)',
          activeDrawerId: activeDrawerId,
          items: drawerItems,
          onResize: (event: NonCancelableCustomEvent<string>) => {
            console.log(event.detail);
          },
          onChange: (event: NonCancelableCustomEvent<string>) => {
            setActiveDrawerId(event.detail);
          },
        },
      };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={Object.assign(appLayoutLabels, drawerLabels)}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            data-test-id="content"
            header={
              <SpaceBetween size="m">
                <Header variant="h1" description="Sometimes you need custom drawers to get the job done.">
                  Testing Beta Drawers!
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
        {...(betaDrawers as any)}
      />
    </ScreenshotArea>
  );
}
