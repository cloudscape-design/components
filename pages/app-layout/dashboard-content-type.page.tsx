// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SplitPanel from '~components/split-panel';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="dashboard"
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        contentHeader={<Header variant="h1">Dashboard page</Header>}
        content={<Containers />}
        splitPanelPreferences={{ position: 'side' }}
        splitPanel={
          <SplitPanel header="Add something" i18nStrings={splitPaneli18nStrings}>
            Hello!
          </SplitPanel>
        }
      />
    </ScreenshotArea>
  );
}
