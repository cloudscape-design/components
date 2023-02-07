// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FlashbarProps } from '~components';

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

const RANDOM_NUMBER_RANGE = 1000;

export function generateItem(
  type: FlashbarProps.Type,
  dismiss: (index: string) => void,
  hasHeader = false,
  initial = false
): FlashbarProps.MessageDefinition {
  const randomKey = `key_${Math.floor(Math.random() * RANDOM_NUMBER_RANGE)}`;
  return {
    type,
    id: randomKey,
    dismissible: true,
    dismissLabel: 'Dismiss',
    onDismiss: () => dismiss(randomKey),
    buttonText: 'Do Action',
    statusIconAriaLabel: 'Info',
    content: `This is a flash item with key ${randomKey.split('_').join(' ')}`,
    ariaRole: initial ? undefined : type === 'error' ? 'alert' : 'status',
    ...(hasHeader && { header: 'Has Header Content' }),
  };
}
