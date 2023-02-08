// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FlashbarProps } from '~components';
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
    type,
    id,
    dismissible: true,
    dismissLabel: 'Dismiss',
    onDismiss: () => dismiss(id),
    buttonText: 'Do Action',
    onButtonClick: () => null,
    statusIconAriaLabel: 'Info',
    content: `This is a flash item with key ${id}`,
    ariaRole: initial ? undefined : type === 'error' ? 'alert' : 'status',
    ...(hasHeader && { header: 'Has Header Content' }),
  };
}
