// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useState } from 'react';

import { FlashbarProps } from '../../../flashbar/interfaces';
import { WidgetMessage } from '../../../internal/plugins/widget/interfaces';

export const FlashbarPropsSetter = createContext<((props: FlashbarProps | null) => void) | null>(null);

export function useRuntimeNotifications() {
  const [flashbarProps, setFlashbarProps] = useState<FlashbarProps | null>(null);
  const [notifications, setNotifications] = useState<Array<FlashbarProps.MessageDefinition>>([]);

  function notificationsMessageHandler(message: WidgetMessage) {
    if (message.type === 'emitNotification') {
      setNotifications(notifications => [...notifications, message.payload]);
    }
  }

  return {
    flashbarProps:
      flashbarProps || notifications.length > 0
        ? {
            ...flashbarProps,
            items: [...(flashbarProps?.items ?? []), ...notifications],
          }
        : null,
    setFlashbarProps,
    notificationsMessageHandler,
  };
}
