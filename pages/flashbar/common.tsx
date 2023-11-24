// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Button, FlashbarProps, ProgressBar } from '~components';
import pseudoRandom from '../utils/pseudo-random';

export const i18nStrings = {
  ariaLabel: 'Notifications',
  notificationBarText: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  errorIconAriaLabel: 'Error',
  successIconAriaLabel: 'Success',
  warningIconAriaLabel: 'Warning',
  infoIconAriaLabel: 'Information',
  inProgressIconAriaLabel: 'In progress',
};

const noop = () => void 0;

const genericNotificationProps = {
  dismissLabel: 'Dismiss',
  dismissible: true,
  onDismiss: noop,
  action: <Button onClick={noop}>Retry</Button>,
};

export const sampleNotifications: Record<string, FlashbarProps.MessageDefinition> = {
  success: {
    ...genericNotificationProps,
    statusIconAriaLabel: 'Success',
    type: 'success',
    header: 'Instance created',
    content: 'Everything went as expected',
    id: 'success',
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
    id: 'warning',
  },
  error: {
    ...genericNotificationProps,
    type: 'error',
    header: 'Unrecoverable error',
    statusIconAriaLabel: 'Error',
    content: 'It all broke, like, really bad.',
    id: 'error',
  },
  'in-progress': {
    ...genericNotificationProps,
    type: 'in-progress',
    statusIconAriaLabel: 'In progress',
    content: (
      <ProgressBar
        label="Progress bar label"
        description="Progress bar description"
        value={37}
        additionalInfo="Additional information"
        variant="flash"
      />
    ),
  },
};

export function generateItem({
  type,
  dismiss,
  id = pseudoRandom().toString(),
  hasHeader = false,
  initial = false,
}: {
  type: FlashbarProps.Type;
  dismiss: (index: string) => void;
  id?: string;
  hasHeader?: boolean;
  initial?: boolean;
}): FlashbarProps.MessageDefinition {
  return {
    ...genericNotificationProps,
    type,
    id,
    onDismiss: () => dismiss(id),
    statusIconAriaLabel: 'Info',
    content: `This is a flash item with key ${id}`,
    ariaRole: initial ? undefined : type === 'error' ? 'alert' : 'status',
    ...(hasHeader && { header: 'Has Header Content' }),
  };
}

export function FocusTarget() {
  return (
    <p>
      Click here to focus so we can tab to the content below{' '}
      <button type="button" id="focus-target">
        focus
      </button>
    </p>
  );
}
