// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useState } from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import Tabs from '~components/tabs';
import SpaceBetween from '~components/space-between';

import { Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import NotificationProvider, { useNotificationContext } from '~components/internal/components/notification-center/notification-center';
import { ToastProps } from '~components/internal/components/notification-center/interface';
import {} from '~componetns/internal/components/notification-center/toast'

const MessagesList = (messages: Array<ToastProps>) => {
  return (
    <SpaceBetween size="m">
      {messages.map((message) =>(
        <div>

        </div>
      ))}
    </SpaceBetween>
  )
}

const NotificationCenter = (messages: Array<ToastProps>) => {
  const tabs = [
    {
      label: 'All',
      id: 'all',

    }
  ]
  return (
    <div>

    </div>
  )
}

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

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
          content: <Security />,
          id: 'security',
          resizable: true,
          size: widths.security,
          trigger: {
            iconName: 'security',
          },
        },
        {
          ariaLabels: {
            closeButton: 'ProHelp close button',
            content: 'ProHelp drawer content',
            triggerButton: 'ProHelp trigger button',
            resizeHandle: 'ProHelp resize handle',
          },
          content: <ProHelp />,
          id: 'pro-help',
          trigger: {
            iconName: 'contact',
          },
        },
      ],
      onChange: (event: NonCancelableCustomEvent<string>) => {
        setActiveDrawerId(event.detail);
      },
    },
  };

  const { toast, messages } = useNotificationContext();
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
    <NotificationProvider>
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

      />
    </NotificationProvider>
  );
}
