// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import Flashbar, { FlashbarProps } from '~components/flashbar';
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { sampleNotifications } from './common';

const permutations = createPermutations<FlashbarProps>([
  {
    items: [
      [sampleNotifications.success],
      [sampleNotifications.error],
      [sampleNotifications.warning],
      [sampleNotifications.error, sampleNotifications.success],
      [sampleNotifications.warning, sampleNotifications.error, sampleNotifications.success],
      [
        sampleNotifications['in-progress'],
        sampleNotifications.warning,
        sampleNotifications.error,
        sampleNotifications.success,
      ],
      [
        sampleNotifications.info,
        sampleNotifications['in-progress'],
        sampleNotifications.warning,
        sampleNotifications.error,
        sampleNotifications.success,
      ],
    ],
  },
]);

export default function CollapsibleFlashbarPermutations() {
  return (
    <>
      <h1>Collapsible Flashbar permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
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
              items={permutation.items}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
