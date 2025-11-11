// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

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
  const linkProps = getLinkProps(colorTheme);

  return (
    <CloudscapeLink
      {...linkProps}
      style={{
        root: {
          color: getColor(colorTheme),
          focusRing: getFocusRing(),
        },
      }}
    >
      {children}
    </CloudscapeLink>
  );
}

function getColor(colorTheme: string) {
  const colors = {
    secondary: {
      active: `light-dark(${palette.blue100}, ${palette.blue20})`,
      default: `light-dark(${palette.blue80}, ${palette.blue40})`,
      hover: `light-dark(${palette.green90}, ${palette.blue60})`,
    },
    primary: {
      active: `light-dark(${palette.blue100}, ${palette.blue20})`,
      default: `light-dark(${palette.blue80}, ${palette.blue40})`,
      hover: `light-dark(${palette.blue90}, ${palette.blue40})`,
    },
    external: {
      active: `light-dark(${palette.red80}, ${palette.red20})`,
      default: `light-dark(${palette.red60}, ${palette.red30})`,
      hover: `light-dark(${palette.red60}, ${palette.red30})`,
    },
    button: {
      active: `light-dark(${palette.green100}, ${palette.green10})`,
      default: `light-dark(${palette.green80}, ${palette.green20})`,
      hover: `light-dark(${palette.green90}, ${palette.green60})`,
    },
    info: {
      active: `light-dark(${palette.teal100}, ${palette.teal10})`,
      default: `light-dark(${palette.teal90}, ${palette.teal20})`,
      hover: `light-dark(${palette.teal90}, ${palette.teal20})`,
    },
  };
  return colors[colorTheme as keyof typeof colors];
}

function getFocusRing() {
  return {
    borderColor: `light-dark(${palette.blue80}, ${palette.red60})`,
    borderRadius: '4px',
    borderWidth: '2px',
  };
}

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
