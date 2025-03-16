import React from 'react';
import { Badge as CloudscapeBadge } from '~components';
import Theme from '~components/theming/component/index';
import { palette } from './theme';

export default function Badge(props: any) {
  return (
    <Theme
      backgroundColor={backgroundColors[props.variation as keyof typeof backgroundColors]}
      borderRadius="32px"
      borderWidth="0px"
      color={colors[props.variation as keyof typeof colors]}
      fontWeight="600"
      lineHeight="14px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors[props.variation as keyof typeof darkModeBackgroundColors],
        color: darkModeColors[props.variation as keyof typeof darkModeColors],
      }}
      paddingBlock="8px"
      paddingInline="12px"
    >
      <CloudscapeBadge>{props.children}</CloudscapeBadge>
    </Theme>
  );
}

const backgroundColors = {
  default: palette.neutral20, 
  error: palette.red10,
  info: palette.blue10,
  success: palette.green10,
  warning: palette.orange10,
};

const colors = {
  default: palette.neutral100,
  error: palette.red100,
  info: palette.blue100,
  success: palette.green100,
  warning: palette.orange100,
}

const darkModeBackgroundColors = {
  ...colors,
  default: palette.neutral80,
};

const darkModeColors = {
  default: palette.neutral40,
  error: palette.red20,
  info: palette.blue20,
  success: palette.green20,
  warning: palette.orange20,
};
