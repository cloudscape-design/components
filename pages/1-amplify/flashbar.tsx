import React from 'react';
import { Flashbar as CloudscapeFlashbar } from '~components';
import { palette } from './theme';
import Theme from '~components/theming/component';

export default function Flashbar(props: any) {
  return (
    <Theme
      backgroundColor={backgroundColors}
      borderRadius="4px"
      boxShadow="none"
      color={colors}
      fill={fills}
      gapBlock="8px"
      onDarkMode={{
        backgroundColor: darkModeBackgroundColors,
        color: darkModeColors,
        fill: darkModeFills,
        outline: palette.neutral10,
      }}
    >
      <CloudscapeFlashbar
        items={props.items}
        stackItems={props.stackItems}
        theme={{
          notificationBar: {
            backgroundColor: notificationBarBackgroundColors,
            borderColor: notificationBarBorderColors,
            borderRadius: '16px',
            color: palette.white,
            fill: palette.white,
          }
        }}
      />
    </Theme>
  );
};

const backgroundColors = {
  error: palette.red20,
  info: palette.blue20,
  success: palette.green20,
  warning: palette.orange20,
};

const colors = {
  error: palette.red100,
  info: palette.blue100,
  success: palette.green100,
  warning: palette.orange100,
};

const fills = {
  ...colors,
  active: palette.neutral100,
  default: palette.neutral60,
  hover: palette.neutral80,
};

const darkModeBackgroundColors = {
  error: palette.red60,
  info: palette.blue60,
  success: palette.green60,
  warning: palette.orange60,
};

const darkModeColors = {
  error: palette.red10,
  info: palette.blue10,
  success: palette.green10,
  warning: palette.orange10,
};

const darkModeFills = {
  ...darkModeColors,
  active: palette.neutral60,
  default: palette.neutral20,
  hover: palette.neutral40,
};

const notificationBarBackgroundColors = {
  active: palette.neutral100,
  default: palette.neutral90,
  hover: palette.neutral90,
};

const notificationBarBorderColors = {
  ...notificationBarBackgroundColors
};