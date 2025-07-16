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
        <CustomBadge colorTheme="grey" id="default">
          Grey
        </CustomBadge>
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
  colorTheme: 'grey' | 'blue' | 'critical' | 'high' | 'medium' | 'low' | 'neutral';
  id?: string;
}

function CustomBadge({ children, colorTheme, id }: CustomBadgeProps) {
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][colorTheme];
  const borderColor = borderColors[mode][colorTheme];
  const borderWidth = borderWidths[colorTheme];
  const color = colors[mode];
  return (
    <CloudscapeBadge
      data-testid={id}
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
    grey: palette.neutral40,
    blue: palette.blue80,
    critical: palette.red80,
    high: palette.red60,
    medium: palette.orange60,
    low: palette.teal90,
    neutral: palette.neutral40,
  },
  dark: {
    grey: palette.neutral80,
    blue: palette.blue40,
    critical: palette.red30,
    high: palette.red30,
    medium: palette.orange40,
    low: palette.teal20,
    neutral: palette.neutral80,
  },
};

const colors = {
  light: palette.neutral10,
  dark: palette.neutral100,
};

const borderColors = {
  light: {
    grey: palette.blue80,
    blue: palette.neutral80,
    critical: palette.blue90,
    high: palette.red80,
    medium: palette.green80,
    low: palette.neutral80,
    neutral: palette.teal80,
  },
  dark: {
    grey: palette.blue60,
    blue: palette.neutral20,
    critical: palette.red60,
    high: palette.red10,
    medium: palette.green20,
    low: palette.neutral20,
    neutral: palette.teal40,
  },
};

const borderWidths = {
  grey: '4px',
  blue: '2px',
  critical: '4px',
  high: '0px',
  medium: '2px',
  low: '6px',
  neutral: '2px',
};
