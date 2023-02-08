// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FlashbarProps } from '~components';
import { generateUniqueId } from '~components/internal/hooks/use-unique-id';

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

export function generateItem(
  type: FlashbarProps.Type,
  dismiss: (index: string) => void,
  hasHeader = false,
  initial = false
): FlashbarProps.MessageDefinition {
  const randomKey = generateUniqueId('key_');
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
