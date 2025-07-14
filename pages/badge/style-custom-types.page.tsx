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
  const color = colors[mode];
  return (
    <CloudscapeBadge
      data-testid={id}
      style={{
        root: {
          background,
          borderRadius: '8px',
          borderWidth: '0px',
          color,
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
    grey: palette.neutral90,
    blue: palette.blue60,
    critical: palette.red80,
    high: palette.red60,
    medium: palette.orange60,
    low: palette.teal60,
    neutral: palette.neutral60,
  },
  dark: {
    grey: palette.neutral10,
    blue: palette.blue40,
    critical: palette.red60,
    high: palette.red80,
    medium: palette.orange40,
    low: palette.teal20,
    neutral: palette.neutral40,
  },
};

const colors = {
  light: palette.neutral10,
  dark: palette.neutral100,
};
