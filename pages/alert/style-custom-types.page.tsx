// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { Alert as CloudscapeAlert, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomAlertTypes() {
  return (
    <ScreenshotArea>
      <h1>Custom Alert Types</h1>
      <SpaceBetween direction="vertical" size="m">
        <CustomAlert type="info" dismissible={true}>
          Info
        </CustomAlert>
        <CustomAlert type="success">Success</CustomAlert>
        <CustomAlert type="error" dismissible={true}>
          Error
        </CustomAlert>
        <CustomAlert type="warning">Warning</CustomAlert>
        <CustomAlert type="info" dismissible={true}>
          With button
        </CustomAlert>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomAlertProps {
  children?: React.ReactNode;
  type: 'info' | 'success' | 'error' | 'warning';
  dismissible?: boolean;
  i18nStrings?: {
    dismissAriaLabel?: string;
  };
}

function CustomAlert({ children, type, dismissible, i18nStrings }: CustomAlertProps) {
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][type];
  const borderColor = borderColors[mode][type];
  const borderWidth = borderWidths[type];
  const color = colors[mode];
  return (
    <CloudscapeAlert
      dismissible={dismissible}
      type={type}
      i18nStrings={i18nStrings}
      style={{
        root: {
          background,
          borderColor,
          borderRadius: '8px',
          borderWidth,
          color,
        },
      }}
    >
      <span style={{ fontSize: '16px' }}>{children}</span>
    </CloudscapeAlert>
  );
}

const backgrounds = {
  light: {
    info: palette.blue80,
    success: palette.blue80,
    error: palette.red60,
    warning: palette.orange80,
  },
  dark: {
    info: palette.blue80,
    success: palette.green80,
    error: palette.red60,
    warning: palette.orange80,
  },
};

const colors = {
  light: palette.neutral10,
  dark: palette.neutral100,
};

const borderColors = {
  light: {
    info: palette.blue80,
    success: palette.green80,
    error: palette.red80,
    warning: palette.orange80,
  },
  dark: {
    info: palette.blue40,
    success: palette.green30,
    error: palette.red60,
    warning: palette.orange40,
  },
};

const borderWidths = {
  info: '2px',
  success: '4px',
  error: '2px',
  warning: '6px',
  button: '8px',
};
