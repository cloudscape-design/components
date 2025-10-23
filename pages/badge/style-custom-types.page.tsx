// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

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
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][colorTheme];
  const borderColor = borderColors[mode][colorTheme];
  const borderWidth = borderWidths[colorTheme];
  const color = colors[mode];
  return (
    <CloudscapeBadge
      style={{
        root: {
          background,
          borderColor,
          borderRadius: '8px',
          color,
          borderWidth,
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      }}
    >
      <span style={{ fontSize: '16px' }}>{children}</span>
    </CloudscapeBadge>
  );
}

const backgrounds = {
  light: {
    blue: palette.blue80,
    critical: palette.red80,
    high: palette.red60,
    medium: palette.green80,
    low: palette.teal90,
    neutral: palette.neutral80,
  },
  dark: {
    blue: palette.blue40,
    critical: palette.red30,
    high: palette.red30,
    medium: palette.green20,
    low: palette.teal20,
    neutral: palette.neutral20,
  },
};

const colors = {
  light: 'white',
  dark: 'black',
};

const borderColors = {
  light: {
    blue: palette.neutral80,
    critical: palette.blue90,
    high: palette.red80,
    medium: palette.green80,
    low: palette.neutral80,
    neutral: palette.teal80,
  },
  dark: {
    blue: palette.neutral20,
    critical: palette.red60,
    high: palette.red10,
    medium: palette.green30,
    low: palette.neutral20,
    neutral: palette.teal40,
  },
};

const borderWidths = {
  blue: '2px',
  critical: '4px',
  high: '0px',
  medium: '0px',
  low: '0px',
  neutral: '0px',
};
