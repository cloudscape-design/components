// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { Link as CloudscapeLink, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomLinkTypes() {
  return (
    <ScreenshotArea>
      <h1>Custom Link Types</h1>
      <SpaceBetween direction="vertical" size="xl">
        <CustomLink colorTheme="secondary">Secondary</CustomLink>
        <CustomLink colorTheme="primary">Primary</CustomLink>
        <CustomLink colorTheme="external">External</CustomLink>
        <CustomLink colorTheme="button">Button</CustomLink>
        <CustomLink colorTheme="info">Info</CustomLink>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomLinkProps {
  children?: React.ReactNode;
  colorTheme: 'secondary' | 'primary' | 'external' | 'button' | 'info';
}

function CustomLink({ children, colorTheme }: CustomLinkProps) {
  const mode = useCurrentMode(useRef(document.body));
  const color = colors[mode][colorTheme];
  const focusRing = focusRings[mode];
  const linkProps = getLinkProps(colorTheme);

  return (
    <CloudscapeLink
      {...linkProps}
      style={{
        root: {
          color,
          focusRing,
        },
      }}
    >
      {children}
    </CloudscapeLink>
  );
}

const colors = {
  light: {
    secondary: {
      active: palette.blue100,
      default: palette.blue80,
      hover: palette.green90,
    },
    primary: {
      active: palette.blue100,
      default: palette.blue80,
      hover: palette.blue90,
    },
    external: {
      active: palette.red80,
      default: palette.red60,
      hover: palette.red60,
    },
    button: {
      active: palette.green100,
      default: palette.green80,
      hover: palette.green90,
    },
    info: {
      active: palette.teal100,
      default: palette.teal90,
      hover: palette.teal90,
    },
  },
  dark: {
    secondary: {
      active: palette.blue20,
      default: palette.blue40,
      hover: palette.blue60,
    },
    primary: {
      active: palette.blue20,
      default: palette.blue40,
      hover: palette.blue40,
    },
    external: {
      active: palette.red20,
      default: palette.red30,
      hover: palette.red30,
    },
    button: {
      active: palette.green10,
      default: palette.green20,
      hover: palette.green60,
    },
    info: {
      active: palette.teal10,
      default: palette.teal20,
      hover: palette.teal20,
    },
  },
};

const focusRings = {
  light: {
    borderColor: palette.blue80,
    borderRadius: '4px',
    borderWidth: '2px',
  },
  dark: {
    borderColor: palette.red60,
    borderRadius: '4px',
    borderWidth: '2px',
  },
};

function getLinkProps(colorTheme: string) {
  const baseProps = {
    href: '#',
    ariaLabel: `${colorTheme} link example`,
  };

  switch (colorTheme) {
    case 'primary':
      return { ...baseProps, variant: 'primary' as const };
    case 'secondary':
      return { ...baseProps, variant: 'secondary' as const };
    case 'external':
      return { ...baseProps, variant: 'secondary' as const, external: true, target: '_blank' };
    case 'button':
      return {
        ...baseProps,
        variant: 'primary' as const,
        onFollow: () => alert('You clicked the button link!'),
      };
    case 'info':
      return { ...baseProps, variant: 'info' as const };
    default:
      return baseProps;
  }
}
