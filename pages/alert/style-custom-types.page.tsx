// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

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
  return (
    <CloudscapeAlert
      dismissible={dismissible}
      type={type}
      action={action}
      i18nStrings={i18nStrings}
      style={{
        root: {
          background: getBackground(type),
          borderColor: getBorderColor(type),
          borderRadius: '8px',
          borderWidth: getBorderWidth(type),
          color: getColor(),
          focusRing: {
            borderColor: palette.red60,
            borderRadius: '4px',
            borderWidth: '2px',
          },
        },
        icon: {
          color: getIconColor(type),
        },
        dismissButton: {
          color: getDismissButtonColor(type),
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

function getBackground(type: string) {
  const backgrounds = {
    info: `light-dark(${palette.blue80}, ${palette.blue40})`,
    success: `light-dark(${palette.green80}, ${palette.green20})`,
    error: `light-dark(${palette.red80}, ${palette.red30})`,
    warning: `light-dark(${palette.teal90}, ${palette.teal20})`,
  };
  return backgrounds[type as keyof typeof backgrounds];
}

function getColor() {
  return `light-dark(${palette.neutral10}, ${palette.neutral100})`;
}

function getBorderColor(type: string) {
  const borderColors = {
    info: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
    success: `light-dark(${palette.green80}, ${palette.green30})`,
    error: `light-dark(${palette.blue90}, ${palette.red60})`,
    warning: `light-dark(${palette.orange80}, ${palette.orange40})`,
  };
  return borderColors[type as keyof typeof borderColors];
}

function getBorderWidth(type: string) {
  const borderWidths = {
    info: '4px',
    success: '0px',
    error: '6px',
    warning: '0px',
  };
  return borderWidths[type as keyof typeof borderWidths];
}

function getIconColor(type: string) {
  const iconColors = {
    info: `light-dark(${palette.orange80}, ${palette.red30})`,
    success: `light-dark(${palette.red60}, ${palette.red60})`,
    error: `light-dark(${palette.blue80}, ${palette.blue40})`,
    warning: `light-dark(${palette.neutral10}, ${palette.neutral90})`,
  };
  return iconColors[type as keyof typeof iconColors];
}

function getDismissButtonColor(type: string) {
  const dismissButtonColors = {
    info: {
      default: `light-dark(${palette.green60}, ${palette.neutral40})`,
      hover: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
      active: `light-dark(${palette.neutral90}, ${palette.neutral10})`,
    },
    success: {
      default: `light-dark(${palette.green60}, ${palette.green30})`,
      hover: `light-dark(${palette.green80}, ${palette.green20})`,
      active: `light-dark(${palette.green90}, ${palette.green10})`,
    },
    error: {
      default: `light-dark(${palette.red60}, ${palette.red60})`,
      hover: `light-dark(${palette.red60}, ${palette.red20})`,
      active: `light-dark(${palette.red80}, ${palette.red10})`,
    },
    warning: {
      default: `light-dark(${palette.orange60}, ${palette.orange40})`,
      hover: `light-dark(${palette.orange80}, ${palette.orange20})`,
      active: `light-dark(${palette.orange90}, ${palette.orange10})`,
    },
  };
  return dismissButtonColors[type as keyof typeof dismissButtonColors];
}
