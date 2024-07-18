// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';
import Flashbar from '~components/flashbar';

import FocusTarget from '../common/focus-target';
import ScreenshotArea from '../utils/screenshot-area';
import { sampleNotifications } from './common';

const items = [
  { ...sampleNotifications.warning, id: '2' },
  { ...sampleNotifications.error, id: '1' },
  {
    ...sampleNotifications.success,
    id: '0',
  },
];

export default function CollapsibleFlashbarVisualTests() {
  return (
    <>
      <h1>Collapsible Flashbar visual tests</h1>
      <FocusTarget />
      <ScreenshotArea>
        <Box padding="xl">
          <Flashbar
            stackItems={true}
            i18nStrings={{
              ariaLabel: 'Notifications',
              notificationBarAriaLabel: 'View all notifications',
              notificationBarText: 'Notifications',
              errorIconAriaLabel: 'Error',
              warningIconAriaLabel: 'Warning',
              successIconAriaLabel: 'Success',
              infoIconAriaLabel: 'Info',
              inProgressIconAriaLabel: 'In progress',
            }}
            items={items}
          />
        </Box>
      </ScreenshotArea>
    </>
  );
}
