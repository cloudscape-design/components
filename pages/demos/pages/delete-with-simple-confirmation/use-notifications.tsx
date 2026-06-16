// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useCallback, useState } from 'react';

import { useId } from '../../use-id-polyfill';

import Button from '@cloudscape-design/components/button';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';

interface Resource {
  id: string;
}

export default function useNotifications({ resourceName }: { resourceName: string }) {
  const deletingFlashMessageId = useId();
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(notifications => notifications.filter(notification => notification.id !== id));
  }, []);

  const updateOrAdd = useCallback((notification: FlashbarProps.MessageDefinition) => {
    setNotifications(notifications => {
      const existingItemIndex = notifications.findIndex(item => item.id === notification.id);
      if (existingItemIndex === -1) {
        // Notification with the same id does not exist, add it
        return [notification, ...notifications];
      } else {
        // Notification with the same id already exists, update it
        const newArray = [...notifications];
        newArray.splice(existingItemIndex, 1, notification);
        return newArray;
      }
    });
  }, []);

  const notifyDeleted = useCallback(
    (resources: Resource[]) => {
      if (resources?.length) {
        const messageId = `delete-notification-${resources[0].id}`;
        const content =
          resources.length === 1
            ? `Successfully deleted ${resourceName} ${resources[0].id}.`
            : `Successfully deleted ${resources.length} ${resourceName}s.`;

        updateOrAdd({
          type: 'success',
          dismissible: true,
          statusIconAriaLabel: 'success',
          dismissLabel: 'Dismiss message',
          content,
          id: messageId,
          onDismiss: () => dismissNotification(messageId),
        });
      }
    },
    [dismissNotification, resourceName, updateOrAdd]
  );

  const notifyFailed = useCallback(
    (failedResources: Resource[], options?: { retry?: (resource: Resource) => void }) => {
      if (failedResources?.length) {
        setNotifications(notifications => [
          ...failedResources.map(resource => {
            const id = `failed-${resource.id}`;
            const retry = options?.retry;
            return {
              type: 'error' as FlashbarProps.Type,
              dismissible: true,
              statusIconAriaLabel: 'error',
              dismissLabel: 'Dismiss message',
              header: `Failed to delete ${resourceName} ${resource.id}`,
              content: 'Your request couldn’t be processed because of an issue with the server. Try again later.',
              action: retry ? <Button onClick={() => retry(resource)}>Retry</Button> : undefined,
              id,
              onDismiss: () => dismissNotification(id),
            };
          }),
          ...notifications,
        ]);
      }
    },
    [dismissNotification, resourceName]
  );

  const clearFailed = (resource: Resource) => {
    setNotifications(notifications =>
      notifications.filter(notification => notification.id !== `failed-${resource.id}`)
    );
  };

  const notifyInProgress = useCallback(
    (resources: Resource[]) => {
      if (resources?.length) {
        const content =
          resources.length === 1
            ? `Deleting ${resourceName} ${resources[0].id}.`
            : `Deleting ${resources.length} ${resourceName}s.`;

        updateOrAdd({
          loading: true,
          type: 'info',
          statusIconAriaLabel: 'info',
          dismissible: false,
          content,
          id: deletingFlashMessageId,
        });
      } else {
        setNotifications(notifications =>
          notifications.filter(notification => notification.id !== deletingFlashMessageId)
        );
      }
    },
    [deletingFlashMessageId, resourceName, updateOrAdd]
  );

  return { clearFailed, notifications, notifyDeleted, notifyFailed, notifyInProgress };
}
