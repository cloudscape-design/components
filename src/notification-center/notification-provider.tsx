// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { ToastList } from './toast-list';
import NotificationContext from './notification-context';
import Portal from '../internal/components/portal';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ToastProps } from './interface';

export function NotificationProvider(children: React.ReactNode) {
  const [messages, setMessages] = useState<Array<ToastProps>>([]);
  const [queue, setQueue] = useState<Array<ToastProps>>([]);

  const toast = useCallback(function registerNewToast(message: ToastProps['message']) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const id = useUniqueId('toast');
    const toast: ToastProps = {
      message,
      id,
      visible: true,
      reviewed: false,
      createdAt: Date.now(),
    };
    setMessages(messages => [toast, ...messages]);
    setQueue(toasts => [toast, ...toasts]);
    return id;
  }, []);

  const viewAll = useCallback(function viewAllMessages() {
    setMessages(messages =>
      messages.map(message => ({
        ...message,
        reviewed: true,
        visible: false,
      }))
    );
    setQueue([]);
  }, []);

  const markViewed = useCallback(function markMessageAsViewed(key: ToastProps['id']) {
    setMessages(messages =>
      messages.map(message => {
        return message.id === key
          ? {
              ...message,
              reviewed: true,
              visible: false,
            }
          : message;
      })
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ toast, viewAll, markViewed, messages }}>
      {children}
      <Portal>
        <ToastList toasts={queue} />
      </Portal>
    </NotificationContext.Provider>
  );
}
