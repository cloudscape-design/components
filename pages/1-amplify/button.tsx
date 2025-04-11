import React, { useRef } from 'react';
import { Button as CloudscapeButton } from '~components';
import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';
import { palette } from './theme';

interface AmplifyButtonProps {
  children?: React.ReactNode;
  colorTheme: 'default' | 'error' | 'info' | 'warning' | 'success';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: any;
  variation: 'primary';
}

export default function Button({
  children,
  colorTheme,
  isDisabled,
  isLoading,
  onClick,
  variation
}: AmplifyButtonProps) {
  const mode = useCurrentMode(useRef(document.body));
  const backgroundColor = backgroundColors[mode][colorTheme];
  const borderColor = backgroundColors[mode][colorTheme];
  const color = isDisabled || isLoading ? colors[mode].disabled : colors[mode].default;
  const boxShadow = boxShadows[mode];

  return (
    <CloudscapeButton 
      disabled={isDisabled} 
      loading={isLoading}
      onClick={onClick}
      variant={variation}
      style={{
        root: {
          backgroundColor,
          borderColor,
          borderRadius: '4px',
          borderWidth: '1px',
          paddingBlock: '11px',
          paddingInline: '16px'
        },
        outline: { boxShadow }
      }}
    >
      <span style={{ color, fontSize: '16px' }}>
        {children}
      </span>
    </CloudscapeButton>
  );
};

const colors = {
  light: {
    default: palette.neutral10,
    disabled: palette.neutral60,
  },
  dark: {
    default: palette.neutral100,
    disabled: palette.neutral60,
  }
};

const boxShadows = {
  light: 'rgb(0, 64, 77) 0px 0px 0px 2px', 
  dark: 'rgb(233, 249, 252) 0px 0px 0px 2px',
};

const backgroundColors = {
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
    }
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
    }
  }
};