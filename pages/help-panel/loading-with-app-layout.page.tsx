// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HelpPanel from '~components/help-panel';

import ScreenshotArea from '../utils/screenshot-area';
import AppLayoutWrapper from './app-layout-wrapper';

export default function HelpPanelLoading() {
  return (
    <ScreenshotArea disableAnimations={true} gutters={false}>
      <AppLayoutWrapper tools={<HelpPanel loading={true} loadingText="Loading content" />} />
    </ScreenshotArea>
  );
}
