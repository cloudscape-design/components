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
  const background = backgrounds[mode][colorTheme];
  const color = colors[mode][colorTheme];
  const paddingBlock = paddings[colorTheme].block;
  const paddingInline = paddings[colorTheme].inline;
  const fontSize = fontSizes[colorTheme];
  const linkProps = getLinkProps(colorTheme);

  return (
    <CloudscapeLink
      {...linkProps}
      style={{
        root: {
          background,
          color,
          paddingBlock,
          paddingInline,
          fontSize,
          focusRing: {
            borderColor: palette.blue80,
            borderRadius: '4px',
            borderWidth: '6px',
          },
        },
      }}
    >
      {children}
    </CloudscapeLink>
  );
}

const backgrounds = {
  light: {
    secondary: 'transparent',
    primary: palette.blue60,
    external: 'tranparent',
    button: palette.green80,
    info: 'tranparent',
  },
  dark: {
    secondary: 'tranparent',
    primary: palette.blue40,
    external: 'transparent',
    button: palette.green20,
    info: 'tranparent',
  },
};

const colors = {
  light: {
    secondary: palette.blue80,
    primary: 'white',
    external: palette.red60,
    button: 'white',
    info: palette.teal90,
  },
  dark: {
    secondary: palette.blue40,
    primary: 'black',
    external: palette.red30,
    button: 'black',
    info: palette.teal20,
  },
};

const paddings = {
  secondary: { block: '4px', inline: '10px' },
  primary: { block: '8px', inline: '12px' },
  external: { block: '6px', inline: '10px' },
  button: { block: '8px', inline: '14px' },
  info: { block: '8px', inline: '6px' },
};

const fontSizes = {
  secondary: '12px',
  primary: '16px',
  external: '14px',
  button: '14px',
  info: '16px',
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
      return { ...baseProps, variant: 'primary' as const };
    case 'info':
      return { ...baseProps, variant: 'info' as const };
    default:
      return baseProps;
  }
}
