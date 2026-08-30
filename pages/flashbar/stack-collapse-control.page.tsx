// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const noop = () => void 0;

const i18nStrings: FlashbarProps.I18nStrings = {
  ariaLabel: 'Notifications',
  notificationBarText: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
  successIconAriaLabel: 'Success',
  infoIconAriaLabel: 'Information',
  inProgressIconAriaLabel: 'In progress',
};

const items: FlashbarProps.MessageDefinition[] = [
  {
    id: 'success',
    type: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Instance created',
    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
  },
  {
    id: 'warning',
    type: 'warning',
    statusIconAriaLabel: 'Warning',
    header: 'Something weird may have happened...',
  },
  {
    id: 'error',
    type: 'error',
    statusIconAriaLabel: 'Error',
    header: 'Unrecoverable error',
    content: 'It all broke, like, really bad.',
  },
];

export default function FlashbarStackCollapseControl() {
  const [expanded, setExpanded] = React.useState<boolean | null>(null);

  return (
    <>
      <h1>Flashbar stacked group: defaultExpanded + onToggle</h1>
      <SpaceBetween size="m">
        <Box>
          Last toggle event:{' '}
          <span id="toggle-state">{expanded === null ? '(none yet)' : expanded ? 'expanded' : 'collapsed'}</span>
        </Box>
        <ScreenshotArea disableAnimations={true}>
          <Flashbar
            stackItems={true}
            defaultExpanded={true}
            onToggle={event => setExpanded(event.detail.expanded)}
            i18nStrings={i18nStrings}
            items={items}
          />
        </ScreenshotArea>
      </SpaceBetween>
    </>
  );
}
