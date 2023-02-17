// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';
import { FlashbarProps } from '~components/flashbar';
import { sampleNotifications } from '../flashbar/common';
import { AppLayout, Box, Button, Flashbar, Header, SpaceBetween, Table, Toggle } from '~components';

export default function () {
  const [notifications, setNotifications] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [nextId, setNextId] = useState(0);
  const [disableContentPaddings, setDisableContentPaddings] = useState(false);
  const [stackItems, setStackItems] = useState(true);
  const [stickyNotifications, setStickyNotifications] = useState(true);
  const [stickyTableHeader, setStickyTableHeader] = useState(true);

  const addNotification = () => {
    setNotifications(notifications => {
      const id = nextId.toString();
      return [
        {
          ...sampleNotifications.info,
          content:
            'Considerably long notification message to verify whether the notifications bar in the Flashbar does not overlap the text. This should be properly tested in collapsed as well as in expanded state, and in compact as well as in comfortable mode.',
          id,
          dismissible: true,
          onDismiss: () => dismissNotification(id),
        },
        ...notifications,
      ];
    });
    setNextId(nextId + 1);
  };

  const dismissNotification = (id: string): void =>
    setNotifications(notifications => notifications.filter(item => item.id !== id));

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        stickyNotifications={stickyNotifications}
        notifications={
          <Flashbar
            items={notifications}
            stackItems={stackItems}
            i18nStrings={{
              ariaLabel: 'Notifications',
              notificationBarText: 'Notifications',
              notificationBarAriaLabel: 'View all notifications',
              errorIconAriaLabel: 'Error',
              successIconAriaLabel: 'Success',
              warningIconAriaLabel: 'Warning',
              infoIconAriaLabel: 'Information',
              inProgressIconAriaLabel: 'In progress',
            }}
          />
        }
        disableContentPaddings={disableContentPaddings}
        content={
          <Table
            header={<Header variant="h1">Sticky Table Header</Header>}
            footer={
              <div style={{ height: '150vh' }}>
                <p>Long footer to make the main content scrollable.</p>
                <p>
                  Use the controls in the Tools panel on the right and the checkboxes at the top in order to test the
                  integration of the Flashbar with App layout in different settings.
                </p>
              </div>
            }
            items={[]}
            columnDefinitions={[]}
            stickyHeader={stickyTableHeader}
          />
        }
        tools={
          <Box padding="xl">
            <SpaceBetween direction="vertical" size="l">
              <Button onClick={addNotification}>Add notification</Button>
              <Toggle
                checked={disableContentPaddings}
                onChange={event => setDisableContentPaddings(event.detail.checked)}
              >
                Disable content paddings
              </Toggle>
              <Toggle checked={stickyNotifications} onChange={event => setStickyNotifications(event.detail.checked)}>
                Sticky Notifications
              </Toggle>
              <Toggle checked={stickyTableHeader} onChange={event => setStickyTableHeader(event.detail.checked)}>
                Sticky Table header
              </Toggle>
              <Toggle checked={stackItems} onChange={event => setStackItems(event.detail.checked)}>
                Stack notifications
              </Toggle>
            </SpaceBetween>
          </Box>
        }
        toolsOpen={true}
      />
    </ScreenshotArea>
  );
}
