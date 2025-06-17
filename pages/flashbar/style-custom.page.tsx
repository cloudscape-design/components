// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Flashbar, FlashbarProps, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

export default function CustomFlashbar() {
  const noop = () => void 0;

  const items: FlashbarProps.MessageDefinition[] = [
    {
      dismissible: true,
      onDismiss: noop,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'Success',
      type: 'success',
      header: 'This is the test header',
      content: 'This is the test content.',
    },
    {
      dismissible: true,
      onDismiss: noop,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'Warning',
      type: 'warning',
      header: 'This is the test header',
      content: 'This is the test content.',
    },
    {
      dismissible: true,
      onDismiss: noop,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'Error',
      type: 'error',
      header: 'This is the test header',
      content: 'This is the test content.',
    },
    {
      dismissible: true,
      onDismiss: noop,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'Info',
      type: 'info',
      header: 'This is the test header',
      content: 'This is the test content.',
    },
    {
      dismissible: true,
      onDismiss: noop,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'In Progress',
      type: 'in-progress',
      header: 'This is the test header',
      content: 'This is the test content.',
    },
  ];

  return (
    <ScreenshotArea>
      <h1>Custom Flashbar</h1>

      <SpaceBetween direction="vertical" size="l">
        <Flashbar
          data-testid="collapsed"
          items={items}
          stackItems={true}
          style={{
            item,
            notificationBar,
          }}
          i18nStrings={i18nStrings}
        />

        <Flashbar
          data-testid="expanded"
          items={items}
          stackItems={false}
          style={{
            item,
          }}
          i18nStrings={i18nStrings}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}

const item = {
  root: {
    background: {
      error: palette.red20,
      info: palette.blue20,
      inProgress: palette.teal20,
      success: palette.green20,
      warning: palette.orange20,
    },
    borderColor: {
      error: palette.red60,
      info: palette.blue60,
      inProgress: palette.teal60,
      success: palette.green60,
      warning: palette.orange60,
    },
    borderRadius: '4px',
    borderWidth: '1px',
    color: {
      error: palette.red100,
      info: palette.blue100,
      inProgress: palette.teal100,
      success: palette.green100,
      warning: palette.orange100,
    },
  },
  dismissButton: {
    color: {
      active: palette.neutral100,
      default: palette.neutral80,
      hover: palette.neutral90,
    },
    focusRing: {
      borderColor: palette.neutral90,
      borderRadius: '4px',
      borderWidth: '1px',
    },
  },
};

const notificationBar = {
  root: {
    background: {
      active: palette.neutral80,
      default: palette.neutral90,
      hover: palette.neutral100,
    },
    borderColor: {
      active: palette.neutral100,
      default: palette.neutral100,
      hover: palette.neutral100,
    },
    borderRadius: '4px',
    borderWidth: '1px',
    color: {
      active: palette.neutral10,
      default: palette.neutral10,
      hover: palette.neutral10,
    },
  },
};
