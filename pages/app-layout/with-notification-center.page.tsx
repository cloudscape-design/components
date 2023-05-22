// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';

import { Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import NotificationProvider, {
  useNotificationContext,
} from '~components/internal/components/notification-center/use-notifications';

import { Center } from '~components/internal/components/notification-center/notification-center';
import { NonCancelableCustomEvent } from '~components';

function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  const [widths] = useState<{ [id: string]: number }>({
    notifications: 500,
  });

  const { toast, messages } = useNotificationContext();

  const drawers = {
    drawers: {
      ariaLabel: 'Drawers',
      activeDrawerId: activeDrawerId,
      items: [
        {
          ariaLabels: {
            closeButton: 'Security close button',
            content: 'Security drawer content',
            triggerButton: 'Security trigger button',
            resizeHandle: 'Security resize handle',
          },
          content: <Center messages={messages} />,
          id: 'notification-center',
          resizable: true,
          size: widths.notifications,
          trigger: {
            iconName: 'notification',
            count: messages.length,
          },
        },
      ],
      onChange: (event: NonCancelableCustomEvent<string>) => {
        setActiveDrawerId(event.detail);
      },
    },
  };

  const createInfoToast = () => {
    toast({
      type: 'info',
      duration: 5 * 1000,
      title: 'Processing',
      content: 'We are doing our best',
    });
  };
  const createSuccessToast = () => {
    toast({
      type: 'success',
      duration: 5 * 1000,
      title: 'Yay',
      content: 'Action was completed successfully',
    });
  };
  return (
    <AppLayout
      ariaLabels={labels}
      navigation={<Navigation />}
      navigationOpen={navigationOpen}
      onNavigationChange={e => setNavigationOpen(e.detail.open)}
      tools={<Tools>{toolsContent.long}</Tools>}
      toolsOpen={toolsOpen}
      onToolsChange={e => setToolsOpen(e.detail.open)}
      breadcrumbs={<Breadcrumbs />}
      content={
        <div className="content" style={{ width: '100%' }}>
          <Box variant="h1">Toaster</Box>
          <Button onClick={createSuccessToast}>Create success toast</Button>
          <Button onClick={createInfoToast}>Create info toast</Button>
        </div>
      }
      {...drawers}
    />
  );
}

export default function () {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}
