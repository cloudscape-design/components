// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import Flashbar, { FlashbarProps } from '~components/flashbar';
import React from 'react';
import { Button } from '~components';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const noop = () => void 0;

const genericNotificationProps = {
  dismissLabel: 'Dismiss',
  dismissible: true,
  onDismiss: noop,
  action: <Button onClick={noop}>Retry</Button>,
};
const sampleNotifications: Record<string, FlashbarProps.MessageDefinition> = {
  success: {
    ...genericNotificationProps,
    statusIconAriaLabel: 'Success',
    type: 'success',
    header: 'Instance created',
    content: 'Everything went as expected',
  },
  info: {
    ...genericNotificationProps,
    type: 'info',
    statusIconAriaLabel: 'Info',
    header: 'New feature available',
    content: 'Information',
    dismissLabel: 'Dismiss',
    id: 'info',
  },
  warning: {
    ...genericNotificationProps,
    type: 'warning',
    statusIconAriaLabel: 'Warning',
    header: 'Something weird may have happened...',
  },
  error: {
    ...genericNotificationProps,
    type: 'error',
    header: 'Unrecoverable error',
    statusIconAriaLabel: 'Error',
    content: 'It all broke, like, really bad.',
  },
};

const permutations = createPermutations<FlashbarProps>([
  {
    items: [
      [sampleNotifications.success],
      [sampleNotifications.error],
      [sampleNotifications.warning],
      [sampleNotifications.success, sampleNotifications.error],
      [sampleNotifications.success, sampleNotifications.error, sampleNotifications.warning],
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
              {...{
                collapsible: true,
                i18nStrings: {
                  toggleButtonAriaLabel: 'View all notifications',
                  toggleButtonText: 'Notifications',
                  errorCountAriaLabel: 'Error',
                  warningCountAriaLabel: 'Warning',
                  successCountAriaLabel: 'Success',
                  infoCountAriaLabel: 'Info',
                  inProgressCountAriaLabel: 'In progress',
                },
              }}
              items={permutation.items}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
