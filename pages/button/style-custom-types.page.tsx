// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

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
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][colorTheme];
  const color = isDisabled || isLoading ? colors[mode] : colors[mode];
  const focusRing = focusRings[mode];

  return (
    <CloudscapeButton
      data-testid={id}
      disabled={isDisabled}
      loading={isLoading}
      onClick={onClick}
      variant={variation}
      style={{
        root: {
          background,
          borderRadius: '4px',
          borderWidth: '0px',
          color,
          focusRing,
          paddingBlock: '12px',
          paddingInline: '16px',
          boxShadow: boxShadows[mode][colorTheme],
        },
      }}
    >
      <span style={{ fontSize: '16px' }}>{children}</span>
    </CloudscapeButton>
  );
}

const backgrounds = {
  light: {
    default: {
      active: palette.teal100,
      default: palette.teal80,
      disabled: palette.neutral40,
      hover: palette.teal90,
    },
    error: {
      active: palette.red100,
      default: palette.red80,
      disabled: palette.neutral40,
      hover: palette.red90,
    },
    info: {
      active: palette.blue100,
      default: palette.blue80,
      disabled: palette.neutral40,
      hover: palette.blue90,
    },
    success: {
      active: palette.green100,
      default: palette.green80,
      disabled: palette.neutral40,
      hover: palette.green90,
    },
    warning: {
      active: palette.orange100,
      default: palette.orange80,
      disabled: palette.neutral40,
      hover: palette.orange90,
    },
  },
  dark: {
    default: {
      active: palette.teal10,
      default: palette.teal30,
      disabled: palette.neutral80,
      hover: palette.teal20,
    },
    error: {
      active: palette.red10,
      default: palette.red30,
      disabled: palette.neutral80,
      hover: palette.red20,
    },
    info: {
      active: palette.blue10,
      default: palette.blue40,
      disabled: palette.neutral80,
      hover: palette.blue20,
    },
    success: {
      active: palette.green10,
      default: palette.green30,
      disabled: palette.neutral80,
      hover: palette.green20,
    },
    warning: {
      active: palette.orange10,
      default: palette.orange40,
      disabled: palette.neutral80,
      hover: palette.orange20,
    },
  },
};

const colors = {
  light: {
    active: palette.neutral10,
    default: palette.neutral10,
    hover: palette.neutral10,
    disabled: palette.neutral60,
  },
  dark: {
    active: palette.neutral100,
    default: palette.neutral100,
    hover: palette.neutral100,
    disabled: palette.neutral60,
  },
};

const focusRings = {
  light: {
    borderColor: 'rgb(0, 64, 77)',
    borderWidth: '2px',
  },
  dark: {
    borderColor: 'rgb(233, 249, 252)',
    borderWidth: '2px',
  },
};

const boxShadows = {
  light: {
    default: {
      active: '0 4px 8px rgba(0, 128, 128, 0.3)',
      default: '0 2px 4px rgba(0, 128, 128, 0.2)',
      disabled: 'none',
      hover: '0 6px 12px rgba(0, 128, 128, 0.25)',
    },
    error: {
      active: '0 4px 8px rgba(255, 0, 0, 0.3)',
      default: '0 2px 4px rgba(255, 0, 0, 0.2)',
      disabled: 'none',
      hover: '0 6px 12px rgba(255, 0, 0, 0.25)',
    },
    info: {
      active: '0 4px 8px rgba(0, 0, 255, 0.3)',
      default: '0 2px 4px rgba(0, 0, 255, 0.2)',
      disabled: 'none',
      hover: '0 6px 12px rgba(0, 0, 255, 0.25)',
    },
    success: {
      active: '0 4px 8px rgba(0, 255, 0, 0.3)',
      default: '0 2px 4px rgba(0, 255, 0, 0.2)',
      disabled: 'none',
      hover: '0 6px 12px rgba(0, 255, 0, 0.25)',
    },
    warning: {
      active: '0 4px 8px rgba(255, 165, 0, 0.3)',
      default: '0 2px 4px rgba(255, 165, 0, 0.2)',
      disabled: 'none',
      hover: '0 6px 12px rgba(255, 165, 0, 0.25)',
    },
  },
  dark: {
    default: {
      active: '0 4px 8px rgba(0, 255, 255, 0.4)',
      default: '0 2px 4px rgba(0, 255, 255, 0.3)',
      disabled: 'none',
      hover: '0 6px 12px rgba(0, 255, 255, 0.35)',
    },
    error: {
      active: '0 4px 8px rgba(255, 100, 100, 0.4)',
      default: '0 2px 4px rgba(255, 100, 100, 0.3)',
      disabled: 'none',
      hover: '0 6px 12px rgba(255, 100, 100, 0.35)',
    },
    info: {
      active: '0 4px 8px rgba(100, 100, 255, 0.4)',
      default: '0 2px 4px rgba(100, 100, 255, 0.3)',
      disabled: 'none',
      hover: '0 6px 12px rgba(100, 100, 255, 0.35)',
    },
    success: {
      active: '0 4px 8px rgba(100, 255, 100, 0.4)',
      default: '0 2px 4px rgba(100, 255, 100, 0.3)',
      disabled: 'none',
      hover: '0 6px 12px rgba(100, 255, 100, 0.35)',
    },
    warning: {
      active: '0 4px 8px rgba(255, 200, 100, 0.4)',
      default: '0 2px 4px rgba(255, 200, 100, 0.3)',
      disabled: 'none',
      hover: '0 6px 12px rgba(255, 200, 100, 0.35)',
    },
  },
};
