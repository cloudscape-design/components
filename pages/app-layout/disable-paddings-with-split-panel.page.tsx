// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Box from '~components/box';
import { Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';

export default function () {
  return (
    <AppLayout
      disableContentPaddings={true}
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      tools={<Tools>{toolsContent.long}</Tools>}
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
      content={<Box variant="h1">Content</Box>}
    />
  );
}
