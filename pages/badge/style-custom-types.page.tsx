// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge as CloudscapeBadge, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomBadgeTypes() {
  return (
    <ScreenshotArea>
      <h1>Custom Badge Types</h1>
      <SpaceBetween direction="horizontal" size="m">
        <CustomBadge colorTheme="blue">Blue</CustomBadge>
        <CustomBadge colorTheme="critical">Critical</CustomBadge>
        <CustomBadge colorTheme="high">High</CustomBadge>
        <CustomBadge colorTheme="medium">Medium</CustomBadge>
        <CustomBadge colorTheme="low">Low</CustomBadge>
        <CustomBadge colorTheme="neutral">Neutral</CustomBadge>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomBadgeProps {
  children?: React.ReactNode;
  colorTheme: 'blue' | 'critical' | 'high' | 'medium' | 'low' | 'neutral';
}

function CustomBadge({ children, colorTheme }: CustomBadgeProps) {
  return (
    <CloudscapeBadge
      style={{
        root: {
          background: getBackground(colorTheme),
          borderColor: getBorderColor(colorTheme),
          borderRadius: '8px',
          color: getColor(),
          borderWidth: getBorderWidth(colorTheme),
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      }}
    >
      <span style={{ fontSize: '16px' }}>{children}</span>
    </CloudscapeBadge>
  );
}

function getBackground(colorTheme: string) {
  const backgrounds = {
    blue: `light-dark(${palette.blue80}, ${palette.blue40})`,
    critical: `light-dark(${palette.red80}, ${palette.red30})`,
    high: `light-dark(${palette.red60}, ${palette.red30})`,
    medium: `light-dark(${palette.green80}, ${palette.green20})`,
    low: `light-dark(${palette.teal90}, ${palette.teal20})`,
    neutral: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
  };
  return backgrounds[colorTheme as keyof typeof backgrounds];
}

function getColor() {
  return 'light-dark(white, black)';
}

function getBorderColor(colorTheme: string) {
  const borderColors = {
    blue: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
    critical: `light-dark(${palette.blue90}, ${palette.red60})`,
    high: `light-dark(${palette.red80}, ${palette.red10})`,
    medium: `light-dark(${palette.green80}, ${palette.green30})`,
    low: `light-dark(${palette.neutral80}, ${palette.neutral20})`,
    neutral: `light-dark(${palette.teal80}, ${palette.teal40})`,
  };
  return borderColors[colorTheme as keyof typeof borderColors];
}

function getBorderWidth(colorTheme: string) {
  const borderWidths = {
    blue: '2px',
    critical: '4px',
    high: '0px',
    medium: '0px',
    low: '0px',
    neutral: '0px',
  };
  return borderWidths[colorTheme as keyof typeof borderWidths];
}
