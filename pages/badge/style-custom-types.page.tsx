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
    <CloudscapeBadge data-testid={id}>
      <span
        style={{
          background,
          borderRadius: '4px',
          borderWidth: '0px',
          color,
          paddingBlock: '12px',
          paddingInline: '16px',
          fontSize: '16px',
          display: 'inline-block',
        }}
      >
        {children}
      </span>
    </CloudscapeBadge>
  );
}

const backgrounds = {
  light: {
    grey: palette.neutral80,
    blue: palette.blue80,
    critical: palette.red100,
    high: palette.red60,
    medium: palette.orange80,
    low: palette.teal60,
    neutral: palette.neutral40,
  },
  dark: {
    grey: palette.neutral10,
    blue: palette.blue80,
    critical: palette.red80,
    high: palette.red100,
    medium: palette.orange80,
    low: palette.teal10,
    neutral: palette.neutral40,
  },
};

const colors = {
  light: palette.neutral10,
  dark: palette.neutral100,
};
