// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Button from '~components/button';
import Header from '~components/header';
import SplitPanel from '~components/split-panel';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import { discreetSplitPanelI18nStrings } from './utils/strings';

export default function () {
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="dashboard"
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        contentHeader={
          <Header variant="h1" actions={<Button onClick={() => setSplitPanelOpen(true)}>Add widget</Button>}>
            Dashboard page
          </Header>
        }
        content={<Containers />}
        splitPanelPreferences={{ position: 'side' }}
        splitPanelOpen={splitPanelOpen}
        splitPanel={
          <SplitPanel
            header="Add something"
            closeBehavior="hide"
            hidePreferencesButton={true}
            i18nStrings={discreetSplitPanelI18nStrings}
          >
            Hello!
          </SplitPanel>
        }
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
      />
    </ScreenshotArea>
  );
}
