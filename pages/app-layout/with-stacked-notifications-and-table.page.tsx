// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';
import { FlashbarProps } from '~components/flashbar';
import { AppLayout, Box, Button, Flashbar, Header, SpaceBetween, SplitPanel, Table, Toggle } from '~components';

export default function () {
  const [notifications, setNotifications] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [nextId, setNextId] = useState(0);
  const [disableContentPaddings, setDisableContentPaddings] = useState(true);
  const [stackItems, setStackItems] = useState(true);
  const [stickyNotifications, setStickyNotifications] = useState(false);
  const [stickyTableHeader, setStickyTableHeader] = useState(true);
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);

  const addNotification = () => {
    setNotifications(notifications => {
      const id = nextId.toString();
      return [
        {
          statusIconAriaLabel: 'Info',
          content:
            'Considerably long notification message to verify that the notifications bar in the Flashbar does not overlap the text.',
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
            header={
              <Header
                variant="h2"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button>Dummy secondary button</Button>
                    <Button>Dummy secondary button</Button>
                    <Button>Dummy secondary button</Button>
                    <Button variant="primary" onClick={addNotification} data-id="add-notification">
                      Add notification
                    </Button>
                  </SpaceBetween>
                }
              >
                Table Header
              </Header>
            }
            footer={
              <div style={{ blockSize: '150vh' }}>
                <h1>Table Footer</h1>
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
              <Toggle
                checked={disableContentPaddings}
                onChange={event => setDisableContentPaddings(event.detail.checked)}
                data-id="toggle-content-paddings"
              >
                Disable content paddings
              </Toggle>
              <Toggle
                checked={stickyNotifications}
                onChange={event => setStickyNotifications(event.detail.checked)}
                data-id="toggle-sticky-notifications"
              >
                Sticky Notifications
              </Toggle>
              <Toggle
                checked={stickyTableHeader}
                onChange={event => setStickyTableHeader(event.detail.checked)}
                data-id="toggle-sticky-table-header"
              >
                Sticky Table header
              </Toggle>
              <Toggle
                checked={stackItems}
                onChange={event => setStackItems(event.detail.checked)}
                data-id="toggle-stack-items"
              >
                Stack notifications
              </Toggle>
            </SpaceBetween>
          </Box>
        }
        toolsOpen={true}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
        splitPanel={
          <SplitPanel
            header={'Split Panel'}
            i18nStrings={{
              preferencesTitle: 'Split panel preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Resize split panel',
            }}
          >
            <p>Split panel content</p>
          </SplitPanel>
        }
        splitPanelPreferences={{ position: 'bottom' }}
      />
    </ScreenshotArea>
  );
}
