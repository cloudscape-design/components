import React from 'react';
import Theme from '~components/theming/component/index';
import { Button as CloudscapeButton } from '~components';
import { palette } from './theme';

export default function Button(props:any) {
  return (
    <Theme 
      backgroundColor={backgroundColors[props.colorTheme as keyof typeof backgroundColors]}
      borderColor={backgroundColors[props.colorTheme as keyof typeof backgroundColors]}
      borderRadius="4px"
      borderWidth="1px"
      color={colors}
      fontSize='16px'
      lineHeight='24px'
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.colorTheme as keyof typeof darkModeBackgroundColors],
        borderColor:darkModeBackgroundColors[props.colorTheme as keyof typeof darkModeBackgroundColors],
        color: darkModeColors,
      }}
      paddingBlock='8px'
      paddingInline='16px'
    >
      <CloudscapeButton 
        disabled={props.isDisabled} 
        loading={props.isLoading}
        onClick={props.onClick}
        variant={props.variation}
      >
        {props.children}
      </CloudscapeButton>
    </Theme>
  );
};

const backgroundColors = {
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
};

const colors = {
  default: palette.neutral10,
  disabled: palette.neutral60,
};

const darkModeBackgroundColors = {
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
};

const darkModeColors = {
  default: palette.neutral100,
  disabled: palette.neutral60,
};
