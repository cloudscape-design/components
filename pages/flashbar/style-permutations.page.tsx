// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Flashbar, { FlashbarProps } from '~components/flashbar';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { sampleNotifications } from './common';

const permutations = createPermutations<FlashbarProps>([
  {
    items: [
      [sampleNotifications.success],
      [sampleNotifications.error],
      [sampleNotifications.warning],
      [sampleNotifications.info],
      [sampleNotifications['in-progress']],
    ],
  },
]);

export default function FlashbarStylePermutations() {
  return (
    <>
      <h1>Style permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Flashbar
              stackItems={permutation.stackItems}
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
              style={{
                item: {
                  root: {
                    background: {
                      error: 'red',
                      info: 'blue',
                      inProgress: 'purple',
                      success: 'green',
                      warning: '#d76500',
                    },
                    borderColor: {
                      error: 'black',
                      info: 'black',
                      inProgress: 'black',
                      success: 'black',
                      warning: 'black',
                    },
                    borderRadius: '100px',
                    borderWidth: '4px',
                    color: {
                      error: '#f0f0f0',
                      info: '#f0f0f0',
                      inProgress: '#f0f0f0',
                      success: '#f0f0f0',
                      warning: '#f0f0f0',
                    },
                  },
                  dismissButton: {
                    color: {
                      active: '#fff',
                      default: '#f0f0f0',
                      hover: '#ccc',
                    },
                    focusRing: {
                      borderColor: '#f0f0f0',
                      borderRadius: '100px',
                      borderWidth: '3px',
                    },
                  },
                },
              }}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
