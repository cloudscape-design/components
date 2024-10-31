// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import { discreetSplitPanelI18nStrings } from './utils/strings';

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <div style={{ height: '0px' }}>
        <AppLayout
          {...{ __disableRuntimeDrawers: true, __forceDeduplicationType: `suspended` }}
          data-testid="secondary-layout"
          ariaLabels={labels}
          breadcrumbs={<Breadcrumbs />}
          navigationHide={true}
          splitPanelOpen={true}
          splitPanel={
            <SplitPanel
              header="Split panel from a different app layout"
              hidePreferencesButton={true}
              i18nStrings={discreetSplitPanelI18nStrings}
            >
              Hello! I am a separate layout which is not supposed to be here, but unfortunately this is a use case for
              one console. I want to make sure that I do not render a toolbar and do not cause any overlap on top of
              this page. If you remove __forceDeduplicationType, the page will look broken.
            </SplitPanel>
          }
        />
      </div>
      <AppLayout
        data-testid="main-layout"
        ariaLabels={labels}
        tools={<Tools>Tools content: {name}</Tools>}
        disableContentPaddings={true}
        content={
          <SpaceBetween size="s">
            <Header variant="h1" description="This page contains nested app layout instances">
              Root layout
            </Header>
          </SpaceBetween>
        }
        splitPanelPreferences={{ position: `side` }}
        splitPanelOpen={true}
        splitPanel={
          <SplitPanel
            header="Split panel from main layout"
            closeBehavior="hide"
            hidePreferencesButton={true}
            i18nStrings={discreetSplitPanelI18nStrings}
          >
            Hello!
          </SplitPanel>
        }
      />
    </ScreenshotArea>
  );
}
