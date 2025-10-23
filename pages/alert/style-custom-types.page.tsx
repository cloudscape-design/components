// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { Alert as CloudscapeAlert, Button, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './common';

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
        <CustomAlert
          type="error"
          action={
            <Button
              style={{
                root: {
                  background: {
                    default: palette.blue90,
                    hover: palette.green90,
                    active: palette.blue90,
                  },
                  borderColor: {
                    default: palette.neutral10,
                    hover: palette.neutral10,
                    active: palette.neutral10,
                  },
                  color: {
                    default: palette.neutral10,
                    hover: palette.neutral10,
                    active: palette.neutral10,
                  },
                  paddingBlock: '4px',
                  paddingInline: '12px',
                },
              }}
            >
              Retry
            </Button>
          }
        >
          With Button
        </CustomAlert>
        <CustomAlert type="warning">Warning</CustomAlert>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomAlertProps {
  children?: React.ReactNode;
  type: 'info' | 'success' | 'error' | 'warning';
  dismissible?: boolean;
  action?: React.ReactNode;
}

function CustomAlert({ children, type, dismissible, action }: CustomAlertProps) {
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][type];
  const borderColor = borderColors[mode][type];
  const borderWidth = borderWidths[type];
  const color = colors[mode];
  const iconColor = iconColors[mode][type];
  return (
    <CloudscapeAlert
      dismissible={dismissible}
      type={type}
      action={action}
      i18nStrings={i18nStrings}
      style={{
        root: {
          background,
          borderColor,
          borderRadius: '8px',
          borderWidth,
          color,
          focusRing: {
            borderColor: palette.red60,
            borderRadius: '4px',
            borderWidth: '2px',
          },
        },
        icon: {
          color: iconColor,
        },
        dismissButton: {
          color: {
            default: dismissButtonColors[mode][type].default,
            hover: dismissButtonColors[mode][type].hover,
            active: dismissButtonColors[mode][type].active,
          },
          focusRing: {
            borderColor: palette.red60,
            borderRadius: '4px',
            borderWidth: '2px',
          },
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
    success: palette.green80,
    error: palette.red80,
    warning: palette.teal90,
  },
  dark: {
    info: palette.blue40,
    success: palette.green20,
    error: palette.red30,
    warning: palette.teal20,
  },
};

const colors = {
  light: palette.neutral10,
  dark: palette.neutral100,
};

const borderColors = {
  light: {
    info: palette.neutral80,
    success: palette.green80,
    error: palette.blue90,
    warning: palette.orange80,
  },
  dark: {
    info: palette.neutral20,
    success: palette.green30,
    error: palette.red60,
    warning: palette.orange40,
  },
};

const borderWidths = {
  info: '4px',
  success: '0px',
  error: '6px',
  warning: '0px',
};

const iconColors = {
  light: {
    info: palette.orange80,
    success: palette.red60,
    error: palette.blue80,
    warning: palette.neutral10,
  },
  dark: {
    info: palette.red30,
    success: palette.red60,
    error: palette.blue40,
    warning: palette.neutral90,
  },
};

const dismissButtonColors = {
  light: {
    info: {
      default: palette.green60,
      hover: palette.neutral80,
      active: palette.neutral90,
    },
    success: {
      default: palette.green60,
      hover: palette.green80,
      active: palette.green90,
    },
    error: {
      default: palette.red60,
      hover: palette.red60,
      active: palette.red80,
    },
    warning: {
      default: palette.orange60,
      hover: palette.orange80,
      active: palette.orange90,
    },
  },
  dark: {
    info: {
      default: palette.neutral40,
      hover: palette.neutral20,
      active: palette.neutral10,
    },
    success: {
      default: palette.green30,
      hover: palette.green20,
      active: palette.green10,
    },
    error: {
      default: palette.red60,
      hover: palette.red20,
      active: palette.red10,
    },
    warning: {
      default: palette.orange40,
      hover: palette.orange20,
      active: palette.orange10,
    },
  },
};
