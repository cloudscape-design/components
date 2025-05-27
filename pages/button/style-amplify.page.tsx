// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import { Button as CloudscapeButton, SpaceBetween } from '~components';

import { palette } from '../app/themes/amplify';
import ScreenshotArea from '../utils/screenshot-area';

export default function AmplifyButtons() {
  return (
    <ScreenshotArea>
      <SpaceBetween direction="horizontal" size="m">
        <AmplifyButton colorTheme="default" variation="primary">
          Default
        </AmplifyButton>
        <AmplifyButton colorTheme="success" variation="primary">
          Success
        </AmplifyButton>
        <AmplifyButton colorTheme="error" variation="primary">
          Error
        </AmplifyButton>
        <AmplifyButton colorTheme="info" variation="primary">
          Info
        </AmplifyButton>
        <AmplifyButton colorTheme="warning" variation="primary">
          Warning
        </AmplifyButton>
        <AmplifyButton colorTheme="success" variation="primary" isDisabled={true}>
          isDisabled
        </AmplifyButton>
        <AmplifyButton colorTheme="success" variation="primary" isLoading={true}>
          isLoading
        </AmplifyButton>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

interface AmplifyButtonProps {
  children?: React.ReactNode;
  colorTheme: 'default' | 'error' | 'info' | 'warning' | 'success';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: any;
  variation: 'primary';
}

function AmplifyButton({ children, colorTheme, isDisabled, isLoading, onClick, variation }: AmplifyButtonProps) {
  const mode = useCurrentMode(useRef(document.body));
  const background = backgrounds[mode][colorTheme];
  const color = isDisabled || isLoading ? colors[mode] : colors[mode];
  const focusRing = focusRings[mode];

  return (
    <CloudscapeButton
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
  },
  dark: {
    borderColor: 'rgb(233, 249, 252)',
  },
};
