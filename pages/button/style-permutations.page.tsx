// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button as CloudscapeButton, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomButtonTypes() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Custom Button Types</h1>

      <SpaceBetween direction="horizontal" size="m">
        <CustomButton colorTheme="default" variation="primary" id="default">
          Default
        </CustomButton>
        <CustomButton colorTheme="success" variation="primary">
          Success
        </CustomButton>
        <CustomButton colorTheme="error" variation="primary">
          Error
        </CustomButton>
        <CustomButton colorTheme="info" variation="primary">
          Info
        </CustomButton>
        <CustomButton colorTheme="warning" variation="primary">
          Warning
        </CustomButton>
        <CustomButton colorTheme="success" variation="primary" isDisabled={true}>
          isDisabled
        </CustomButton>
        <CustomButton colorTheme="success" variation="primary" isLoading={true}>
          isLoading
        </CustomButton>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface CustomButtonProps {
  children?: React.ReactNode;
  colorTheme: 'default' | 'error' | 'info' | 'warning' | 'success';
  id?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: any;
  variation: 'primary';
}

function CustomButton({ children, colorTheme, id, isDisabled, isLoading, onClick, variation }: CustomButtonProps) {
  return (
    <CloudscapeButton
      data-testid={id}
      disabled={isDisabled}
      loading={isLoading}
      onClick={onClick}
      variant={variation}
      style={{
        root: {
          background: getBackground(colorTheme),
          borderRadius: '4px',
          borderWidth: '0px',
          color: getColor(),
          focusRing: getFocusRing(),
          paddingBlock: '12px',
          paddingInline: '16px',
          boxShadow: getBoxShadow(colorTheme),
        },
      }}
    >
      <span style={{ fontSize: '16px' }}>{children}</span>
    </CloudscapeButton>
  );
}

function getBackground(colorTheme: string) {
  const backgrounds = {
    default: {
      active: `light-dark(${palette.teal100}, ${palette.teal10})`,
      default: `light-dark(${palette.teal80}, ${palette.teal30})`,
      disabled: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
      hover: `light-dark(${palette.teal90}, ${palette.teal20})`,
    },
    error: {
      active: `light-dark(${palette.red100}, ${palette.red10})`,
      default: `light-dark(${palette.red80}, ${palette.red30})`,
      disabled: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
      hover: `light-dark(${palette.red90}, ${palette.red20})`,
    },
    info: {
      active: `light-dark(${palette.blue100}, ${palette.blue10})`,
      default: `light-dark(${palette.blue80}, ${palette.blue40})`,
      disabled: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
      hover: `light-dark(${palette.blue90}, ${palette.blue20})`,
    },
    success: {
      active: `light-dark(${palette.green100}, ${palette.green10})`,
      default: `light-dark(${palette.green80}, ${palette.green30})`,
      disabled: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
      hover: `light-dark(${palette.green90}, ${palette.green20})`,
    },
    warning: {
      active: `light-dark(${palette.orange100}, ${palette.orange10})`,
      default: `light-dark(${palette.orange80}, ${palette.orange40})`,
      disabled: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
      hover: `light-dark(${palette.orange90}, ${palette.orange20})`,
    },
  };
  return backgrounds[colorTheme as keyof typeof backgrounds];
}

function getColor() {
  return {
    active: `light-dark(${palette.neutral10}, ${palette.neutral100})`,
    default: `light-dark(${palette.neutral10}, ${palette.neutral100})`,
    hover: `light-dark(${palette.neutral10}, ${palette.neutral100})`,
    disabled: `light-dark(${palette.neutral60}, ${palette.neutral60})`,
  };
}

function getFocusRing() {
  return {
    borderColor: 'light-dark(rgb(0, 64, 77), rgb(233, 249, 252))',
    borderWidth: '2px',
  };
}

function getBoxShadow(colorTheme: string) {
  const boxShadows = {
    default: {
      active: `0 4px 8px light-dark(rgba(0, 128, 128, 0.3), rgba(0, 255, 255, 0.4))`,
      default: `0 2px 4px light-dark(rgba(0, 128, 128, 0.2), rgba(0, 255, 255, 0.3))`,
      disabled: 'none',
      hover: `0 6px 12px light-dark(rgba(0, 128, 128, 0.25), rgba(0, 255, 255, 0.35))`,
    },
    error: {
      active: `0 4px 8px light-dark(rgba(255, 0, 0, 0.3), rgba(255, 100, 100, 0.4))`,
      default: `0 2px 4px light-dark(rgba(255, 0, 0, 0.2), rgba(255, 100, 100, 0.3))`,
      disabled: 'none',
      hover: `0 6px 12px light-dark(rgba(255, 0, 0, 0.25), rgba(255, 100, 100, 0.35))`,
    },
    info: {
      active: `0 4px 8px light-dark(rgba(0, 0, 255, 0.3), rgba(100, 100, 255, 0.4))`,
      default: `0 2px 4px light-dark(rgba(0, 0, 255, 0.2), rgba(100, 100, 255, 0.3))`,
      disabled: 'none',
      hover: `0 6px 12px light-dark(rgba(0, 0, 255, 0.25), rgba(100, 100, 255, 0.35))`,
    },
    success: {
      active: `0 4px 8px light-dark(rgba(0, 255, 0, 0.3), rgba(100, 255, 100, 0.4))`,
      default: `0 2px 4px light-dark(rgba(0, 255, 0, 0.2), rgba(100, 255, 100, 0.3))`,
      disabled: 'none',
      hover: `0 6px 12px light-dark(rgba(0, 255, 0, 0.25), rgba(100, 255, 100, 0.35))`,
    },
    warning: {
      active: `0 4px 8px light-dark(rgba(255, 165, 0, 0.3), rgba(255, 200, 100, 0.4))`,
      default: `0 2px 4px light-dark(rgba(255, 165, 0, 0.2), rgba(255, 200, 100, 0.3))`,
      disabled: 'none',
      hover: `0 6px 12px light-dark(rgba(255, 165, 0, 0.25), rgba(255, 200, 100, 0.35))`,
    },
  };
  return boxShadows[colorTheme as keyof typeof boxShadows];
}
