// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import SplitPanel from '~components/split-panel';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

type SplitPanelDemoContext = React.Context<
  AppContextType<{
    splitPanelPosition: AppLayoutProps.SplitPanelPreferences['position'];
    splitPanelOpen: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { splitPanelPosition, splitPanelOpen = false },
    setUrlParams,
  } = useContext(AppContext as SplitPanelDemoContext);

  return (
    <AppLayout
      disableContentPaddings={true}
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      tools={<Tools>{toolsContent.long}</Tools>}
      splitPanelPreferences={{ position: splitPanelPosition }}
      onSplitPanelPreferencesChange={event => {
        const { position } = event.detail;
        setUrlParams({ splitPanelPosition: position === 'side' ? position : undefined });
      }}
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={event => setUrlParams({ splitPanelOpen: event.detail.open })}
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
          <Box>Content</Box>
        </SplitPanel>
      }
      content={
        <Box padding="m">
          <div style={{ border: '1px solid magenta' }}>
            <Box variant="h1">Content</Box>
          </div>
        </Box>
      }
    />
  );
}
