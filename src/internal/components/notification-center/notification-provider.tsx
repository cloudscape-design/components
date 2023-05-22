// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { ToastList } from './toast-list';
import NotificationContext from './notification-context';
import Portal from '../portal';
import { ToastProps } from './interface';

export interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider(props: NotificationProviderProps) {
  const [messages, setMessages] = useState<Array<ToastProps>>([]);
  const [queue, setQueue] = useState<Array<ToastProps>>([]);
  const getUniqueId = (prefix: string) => {
    return `${prefix ? prefix : ''}` + `${Date.now()}-${Math.round(Math.random() * 10000)}`;
  };

  const toast = useCallback(function registerNewToast(message: ToastProps['message']) {
    const id = getUniqueId('toast');
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

  const removeFromQueue = useCallback(function hideFromScreen(key: ToastProps['id']) {
    setQueue(messages =>
      messages.filter(message => {
        return message.id !== key;
      })
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ toast, viewAll, markViewed, messages }}>
      {props.children}
      <Portal>
        <ToastList toasts={queue} onAutoClose={removeFromQueue} />
      </Portal>
    </NotificationContext.Provider>
  );
}
